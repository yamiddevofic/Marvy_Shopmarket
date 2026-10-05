from sqlalchemy.exc import IntegrityError

from ..errors import APIError
from ..extensions import db
from ..models import Administrador, Tenderos
from .auth_service import hash_password
from .validation import parse_int, require_email, require_fields, require_password

CAMPOS_ACTUALIZABLES = {
    'nombre': 'tendero_Nombre',
    'correo': 'tendero_Correo',
    'celular': 'tendero_Celular',
}


def serializar(tendero):
    return {
        'id': tendero.tendero_Id,
        'nombre': tendero.tendero_Nombre,
        'correo': tendero.tendero_Correo,
        'celular': tendero.tendero_Celular or '',
        'tienda_Id': tendero.tienda_Id,
    }


def listar(tienda_id):
    tenderos = Tenderos.query.filter_by(tienda_Id=tienda_id).order_by(Tenderos.tendero_Nombre).all()
    return [serializar(t) for t in tenderos]


def registrar(tienda_id, data):
    """Registra un tendero en la tienda de la sesión."""
    require_fields(data, ['tendero_Id', 'tendero_Nombre', 'tendero_Correo', 'tendero_Password'])
    tendero_id = parse_int(data['tendero_Id'], 'tendero_Id')
    correo = require_email(data['tendero_Correo'], 'tendero_Correo')
    password = require_password(data['tendero_Password'], 'tendero_Password')

    if data.get('tienda_Id') not in (None, '') and parse_int(data['tienda_Id'], 'tienda_Id') != tienda_id:
        raise APIError('Solo puede registrar tenderos en su propia tienda', 403)
    # El login busca el mismo ID en administradores y tenderos: debe ser único entre ambos.
    if db.session.get(Tenderos, tendero_id) or db.session.get(Administrador, tendero_id):
        raise APIError('El ID de tendero ya está registrado', 409)
    _validar_correo_disponible(correo)

    tendero = Tenderos(
        tendero_Id=tendero_id,
        tendero_Nombre=data['tendero_Nombre'],
        tendero_Correo=correo,
        tendero_Celular=data.get('tendero_Celular') or None,
        tendero_Password=hash_password(password),
        tienda_Id=tienda_id,
    )
    _commit(tendero)
    return tendero_id


def actualizar(tienda_id, tendero_id, data):
    tendero = _obtener_de_tienda(tienda_id, tendero_id)
    cambios = {campo: data[campo] for campo in CAMPOS_ACTUALIZABLES if campo in data}

    if 'correo' in cambios:
        cambios['correo'] = require_email(cambios['correo'], 'correo')
        _validar_correo_disponible(cambios['correo'], excluir_id=tendero.tendero_Id)
    if 'nombre' in cambios and not str(cambios['nombre'] or '').strip():
        raise APIError('El campo nombre es requerido', 400)

    for campo, valor in cambios.items():
        setattr(tendero, CAMPOS_ACTUALIZABLES[campo], valor if valor != '' else None)
    _commit(tendero)


def eliminar(tienda_id, tendero_id):
    tendero = _obtener_de_tienda(tienda_id, tendero_id)
    db.session.delete(tendero)
    db.session.commit()


def _obtener_de_tienda(tienda_id, tendero_id):
    tendero = Tenderos.query.filter_by(tendero_Id=tendero_id, tienda_Id=tienda_id).first()
    if not tendero:
        raise APIError('Tendero no encontrado', 404)
    return tendero


def _validar_correo_disponible(correo, excluir_id=None):
    query = Tenderos.query.filter_by(tendero_Correo=correo)
    if excluir_id is not None:
        query = query.filter(Tenderos.tendero_Id != excluir_id)
    if query.first():
        raise APIError('El correo ya está registrado', 409)


def _commit(tendero):
    try:
        db.session.add(tendero)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise APIError('Error de integridad de datos', 409)
