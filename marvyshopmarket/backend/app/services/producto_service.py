"""Productos (MongoDB, colección ``productos``).

Cada producto pertenece a una tienda (``tienda_Id``); todas las operaciones
se limitan a la tienda de la sesión.
"""
import uuid

from pymongo.errors import DuplicateKeyError

from ..errors import APIError
from ..extensions import mongo
from .validation import require_fields

CAMPOS_ACTUALIZABLES = ('nombre', 'categoria', 'stock', 'precios')


def _coleccion():
    if mongo.db is None:
        raise APIError('El servicio de productos no está disponible', 503)
    return mongo.db.productos


def _filtro_tienda(tienda_id):
    # Algunos documentos pueden haber guardado el ID de tienda como texto.
    return {'tienda_Id': {'$in': [tienda_id, str(tienda_id)]}}


def serializar(producto):
    precios = producto.get('precios') or []
    return {
        '_id': producto['_id'],
        'nombre': producto.get('nombre'),
        'categoria': producto.get('categoria'),
        'precio': precios[-1].get('precio') if precios else None,  # precio vigente
        'stock': producto.get('stock'),
    }


def listar(tienda_id):
    return [serializar(p) for p in _coleccion().find(_filtro_tienda(tienda_id))]


def registrar(tienda_id, data):
    require_fields(data, ['nombre', 'categoria', 'precios', 'stock'])
    producto = _validar_campos({campo: data[campo] for campo in CAMPOS_ACTUALIZABLES})
    producto['_id'] = str(data.get('_id') or f'prd_{uuid.uuid4().hex[:12]}')
    producto['tienda_Id'] = tienda_id  # nunca se confía en la tienda enviada por el cliente
    try:
        _coleccion().insert_one(producto)
    except DuplicateKeyError:
        raise APIError('Ya existe un producto con ese ID', 409)
    return producto['_id']


def actualizar(tienda_id, producto_id, data):
    cambios = _validar_campos({c: data[c] for c in CAMPOS_ACTUALIZABLES if c in data})
    if not cambios:
        raise APIError('No se enviaron campos para actualizar', 400)
    result = _coleccion().update_one({'_id': producto_id, **_filtro_tienda(tienda_id)}, {'$set': cambios})
    if result.matched_count == 0:
        raise APIError('Producto no encontrado', 404)


def eliminar(tienda_id, producto_id):
    result = _coleccion().delete_one({'_id': producto_id, **_filtro_tienda(tienda_id)})
    if result.deleted_count == 0:
        raise APIError('Producto no encontrado', 404)


def _validar_campos(campos):
    for texto in ('nombre', 'categoria'):
        if texto in campos and (not isinstance(campos[texto], str) or not campos[texto].strip()):
            raise APIError(f'El campo {texto} es requerido', 400)
    if 'stock' in campos:
        campos['stock'] = _numero(campos['stock'], 'stock', int)
    if 'precios' in campos:
        precios = campos['precios']
        if not isinstance(precios, list) or not precios:
            raise APIError('El campo precios debe ser una lista no vacía', 400)
        campos['precios'] = [_precio(p) for p in precios]
    return campos


def _precio(item):
    if not isinstance(item, dict) or 'precio' not in item:
        raise APIError('Cada precio debe incluir el campo precio', 400)
    return {'fecha': item.get('fecha'), 'precio': _numero(item['precio'], 'precio', float)}


def _numero(valor, campo, tipo):
    try:
        numero = tipo(valor)
    except (TypeError, ValueError):
        raise APIError(f'El campo {campo} debe ser numérico', 400)
    if numero < 0:
        raise APIError(f'El campo {campo} no puede ser negativo', 400)
    return numero
