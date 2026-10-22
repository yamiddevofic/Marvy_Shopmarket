"""Ventas (MongoDB, colección ``ventas``).

Una venta guarda sus líneas con el nombre y el precio del momento, así el
historial no cambia si después se edita o borra el producto. Registrar una
venta descuenta las unidades del inventario; anularla las devuelve.
"""
import uuid

from ..errors import APIError
from ..extensions import db, mongo
from ..models import Administrador, Tenderos
from . import fechas
from .producto_service import _coleccion as _productos, _filtro_tienda

METODOS_PAGO = ('efectivo', 'transferencia', 'tarjeta', 'fiado')
LIMITE_HISTORIAL = 500


def _coleccion():
    if mongo.db is None:
        raise APIError('El servicio de ventas no está disponible', 503)
    return mongo.db.ventas


def serializar(venta):
    return {
        '_id': venta['_id'],
        'fecha': venta['fecha'],
        'dia': venta['dia'],
        'items': venta['items'],
        'total': venta['total'],
        'metodo': venta['metodo'],
        'vendedor': venta.get('vendedor'),
        'anulada': bool(venta.get('anulada')),
        'recibido': venta.get('recibido'),
        'cambio': venta.get('cambio'),
    }


def listar(tienda_id, desde=None, hasta=None):
    filtro = {'tienda_Id': tienda_id, **fechas.filtro_dia(desde, hasta)}
    ventas = _coleccion().find(filtro).sort('fecha', -1).limit(LIMITE_HISTORIAL)
    return [serializar(v) for v in ventas]


def registrar(tienda_id, data, rol, usuario_id):
    cantidades = _validar_items(data.get('items'))
    metodo = data.get('metodo') or 'efectivo'
    if metodo not in METODOS_PAGO:
        raise APIError(f"El método de pago debe ser uno de: {', '.join(METODOS_PAGO)}", 400)

    productos = {p['_id']: p for p in _productos().find({'_id': {'$in': list(cantidades)}, **_filtro_tienda(tienda_id)})}
    items = []
    for producto_id, cantidad in cantidades.items():
        producto = productos.get(producto_id)
        if not producto:
            raise APIError('Uno de los productos ya no existe en el inventario', 404)
        precios = producto.get('precios') or []
        precio = float(precios[-1]['precio']) if precios else 0.0
        if (producto.get('stock') or 0) < cantidad:
            raise APIError(f"Solo quedan {producto.get('stock') or 0} unidades de {producto['nombre']}", 409)
        items.append({'producto_id': producto_id, 'nombre': producto['nombre'], 'cantidad': cantidad,
                      'precio_unitario': precio, 'subtotal': precio * cantidad})

    total = sum(item['subtotal'] for item in items)
    recibido = _validar_recibido(data.get('recibido'), total) if metodo == 'efectivo' else None

    _descontar(tienda_id, items)
    momento = fechas.ahora()
    venta = {
        '_id': f'vta_{uuid.uuid4().hex[:12]}',
        'tienda_Id': tienda_id,
        'fecha': momento.isoformat(),
        'dia': momento.date().isoformat(),
        'items': items,
        'total': total,
        'metodo': metodo,
        'vendedor': {'rol': rol, 'id': usuario_id, 'nombre': _nombre_vendedor(rol, usuario_id)},
        'anulada': False,
        # Solo en efectivo: con cuánto pagó el cliente y cuánto se le devolvió
        'recibido': recibido,
        'cambio': recibido - total if recibido is not None else None,
    }
    try:
        _coleccion().insert_one(venta)
    except Exception:
        _devolver(tienda_id, items)
        raise
    return serializar(venta)


def anular(tienda_id, venta_id):
    venta = _coleccion().find_one({'_id': venta_id, 'tienda_Id': tienda_id})
    if not venta:
        raise APIError('Venta no encontrada', 404)
    # La condición garantiza que dos anulaciones simultáneas no devuelvan el stock dos veces
    result = _coleccion().update_one({'_id': venta_id, 'anulada': {'$ne': True}},
                                     {'$set': {'anulada': True, 'anulada_en': fechas.ahora().isoformat()}})
    if result.modified_count == 0:
        raise APIError('La venta ya estaba anulada', 409)
    # Los productos que se borraron después de la venta no se recrean.
    _devolver(tienda_id, venta['items'])


def _validar_items(items):
    if not isinstance(items, list) or not items:
        raise APIError('La venta debe tener al menos un producto', 400)
    cantidades = {}
    for item in items:
        if not isinstance(item, dict) or not isinstance(item.get('producto_id'), str) or not item['producto_id']:
            raise APIError('Cada línea debe indicar el producto', 400)
        try:
            cantidad = int(item.get('cantidad'))
        except (TypeError, ValueError):
            raise APIError('La cantidad debe ser un número entero', 400)
        if cantidad <= 0:
            raise APIError('La cantidad debe ser mayor que cero', 400)
        # Si el mismo producto viene en dos líneas, se suman
        cantidades[item['producto_id']] = cantidades.get(item['producto_id'], 0) + cantidad
    return cantidades


def _validar_recibido(valor, total):
    """Dinero que entrega el cliente al pagar en efectivo (opcional: sin él se asume pago exacto)."""
    if valor in (None, ''):
        return None
    try:
        recibido = float(valor)
    except (TypeError, ValueError):
        raise APIError('El dinero recibido debe ser numérico', 400)
    if recibido < total:
        raise APIError('El dinero recibido no alcanza para pagar el total', 400)
    return recibido


def _descontar(tienda_id, items):
    """Descuenta stock línea por línea; si alguna falla, revierte las anteriores."""
    hechos = []
    for item in items:
        # La condición de stock evita quedar en negativo si dos ventas llegan a la vez
        result = _productos().update_one(
            {'_id': item['producto_id'], 'stock': {'$gte': item['cantidad']}, **_filtro_tienda(tienda_id)},
            {'$inc': {'stock': -item['cantidad']}},
        )
        if result.modified_count == 0:
            _devolver(tienda_id, hechos)
            raise APIError(f"No hay unidades suficientes de {item['nombre']}", 409)
        hechos.append(item)


def _devolver(tienda_id, items):
    for item in items:
        _productos().update_one({'_id': item['producto_id'], **_filtro_tienda(tienda_id)},
                                {'$inc': {'stock': item['cantidad']}})


def _nombre_vendedor(rol, usuario_id):
    modelo, campo = (Administrador, 'adm_Nombre') if rol == 'admin' else (Tenderos, 'tendero_Nombre')
    usuario = db.session.get(modelo, usuario_id) if usuario_id else None
    return getattr(usuario, campo, None)
