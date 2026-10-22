"""Gastos de la tienda (MongoDB, colección ``gastos``): las salidas de dinero."""
import uuid

from ..errors import APIError
from ..extensions import mongo
from . import fechas
from .validation import require_fields

CATEGORIAS = ('Fijos', 'Mantenimiento', 'Mercancía', 'Nómina', 'Transporte', 'Impuestos', 'Otros')


def _coleccion():
    if mongo.db is None:
        raise APIError('El servicio de gastos no está disponible', 503)
    return mongo.db.gastos


def serializar(gasto):
    return {
        '_id': gasto['_id'],
        'descripcion': gasto['descripcion'],
        'categoria': gasto['categoria'],
        'monto': gasto['monto'],
        'dia': gasto['dia'],
    }


def listar(tienda_id, desde=None, hasta=None):
    filtro = {'tienda_Id': tienda_id, **fechas.filtro_dia(desde, hasta)}
    return [serializar(g) for g in _coleccion().find(filtro).sort([('dia', -1), ('creado', -1)])]


def registrar(tienda_id, data):
    require_fields(data, ['descripcion', 'categoria', 'monto'])
    descripcion = str(data['descripcion']).strip()
    if len(descripcion) > 100:
        raise APIError('La descripción no puede superar 100 caracteres', 400)
    if data['categoria'] not in CATEGORIAS:
        raise APIError(f"La categoría debe ser una de: {', '.join(CATEGORIAS)}", 400)
    try:
        monto = float(data['monto'])
    except (TypeError, ValueError):
        raise APIError('El campo monto debe ser numérico', 400)
    if monto <= 0:
        raise APIError('El monto debe ser mayor que cero', 400)

    gasto = {
        '_id': f'gst_{uuid.uuid4().hex[:12]}',
        'tienda_Id': tienda_id,
        'descripcion': descripcion,
        'categoria': data['categoria'],
        'monto': monto,
        'dia': fechas.parse_dia(data['dia'], 'dia') if data.get('dia') else fechas.hoy().isoformat(),
        'creado': fechas.ahora().isoformat(),
    }
    _coleccion().insert_one(gasto)
    return serializar(gasto)


def eliminar(tienda_id, gasto_id):
    if _coleccion().delete_one({'_id': gasto_id, 'tienda_Id': tienda_id}).deleted_count == 0:
        raise APIError('Gasto no encontrado', 404)
