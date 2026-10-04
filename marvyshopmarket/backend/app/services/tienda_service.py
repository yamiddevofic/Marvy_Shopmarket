import base64
import binascii
import logging
import os

from flask import current_app
from sqlalchemy.exc import IntegrityError

from ..errors import APIError
from ..extensions import db
from ..models import Administrador, Tenderos, Tiendas
from .auth_service import hash_password
from .validation import parse_int, require_email, require_fields, require_password

log = logging.getLogger(__name__)

_IMAGE_SIGNATURES = (
    (b'\x89PNG\r\n\x1a\n', 'png'),
    (b'\xff\xd8\xff', 'jpg'),
    (b'GIF87a', 'gif'),
    (b'GIF89a', 'gif'),
)


def registrar_admin_tienda(data):
    require_fields(data, ['tienda_Id', 'tienda_Nombre', 'tienda_Correo',
                          'adm_Id', 'adm_Nombre', 'adm_Correo', 'adm_Password'])
    tienda_id = parse_int(data['tienda_Id'], 'tienda_Id')
    admin_id = parse_int(data['adm_Id'], 'adm_Id')
    tienda_correo = require_email(data['tienda_Correo'], 'tienda_Correo')
    adm_correo = require_email(data['adm_Correo'], 'adm_Correo')
    password = require_password(data['adm_Password'], 'adm_Password')

    if db.session.get(Tiendas, tienda_id):
        raise APIError('El ID de tienda ya está registrado', 409)
    # El login busca el mismo ID en administradores y tenderos: debe ser único entre ambos.
    if db.session.get(Administrador, admin_id) or db.session.get(Tenderos, admin_id):
        raise APIError('El ID de administrador ya está registrado', 409)

    image = _decode_image(data.get('tienda_Img'))

    tienda = Tiendas(
        tienda_Id=tienda_id,
        tienda_Nombre=data['tienda_Nombre'],
        tienda_Correo=tienda_correo,
        tienda_Celular=data.get('tienda_Celular') or None,
        tienda_Ubicacion=data.get('tienda_Ubicacion') or None,
    )
    admin = Administrador(
        adm_Id=admin_id,
        adm_Nombre=data['adm_Nombre'],
        adm_Correo=adm_correo,
        adm_Celular=data.get('adm_Celular') or None,
        adm_Password=hash_password(password),
        tienda_Id=tienda_id,
    )

    image_path = None
    try:
        if image:
            image_path, image_url = _save_image(tienda_id, *image)
            tienda.tienda_IMG = image_url.encode('utf-8')
        db.session.add(tienda)
        db.session.flush()  # la tienda debe existir antes de la FK del administrador
        db.session.add(admin)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        _remove_file(image_path)
        raise APIError('Error de integridad de datos', 409)
    except Exception:
        db.session.rollback()
        _remove_file(image_path)
        raise

    return {'admin_id': admin_id, 'tienda_id': tienda_id}


def obtener_info(admin_id, tienda_id):
    admin = db.session.get(Administrador, int(admin_id))
    tienda = db.session.get(Tiendas, int(tienda_id))
    if not admin or not tienda:
        raise APIError('No se encontró la información solicitada', 404, 'NO_ENCONTRADO')

    return {
        'administrador': {
            'id': admin.adm_Id,
            'nombre': admin.adm_Nombre,
            'correo': admin.adm_Correo,
            'celular': admin.adm_Celular or '',
            'estado': None,
            'fecha_registro': '',
            'ultimo_acceso': '',
        },
        'tienda': {
            'id': tienda.tienda_Id,
            'nombre': tienda.tienda_Nombre,
            'correo': tienda.tienda_Correo,
            'celular': tienda.tienda_Celular or '',
            'ubicacion': tienda.tienda_Ubicacion or '',
            'estado': None,
            'fecha_registro': '',
            'imagen': imagen_url(tienda.tienda_IMG),
        },
    }


def imagen_url(raw):
    """Convierte el valor de ``tienda_IMG`` en algo serializable a JSON."""
    if not raw:
        return None
    if isinstance(raw, str):
        return raw
    try:
        return raw.decode('utf-8')
    except UnicodeDecodeError:
        # Registros antiguos guardaban la imagen binaria en la columna.
        return 'data:image/jpeg;base64,' + base64.b64encode(raw).decode('ascii')


def _decode_image(value):
    """Devuelve (bytes, extensión) a partir de un data URL o base64, o None."""
    if not value:
        return None
    if not isinstance(value, str):
        raise APIError('La imagen debe enviarse como texto base64', 400)
    payload = value.split(',', 1)[1] if ',' in value else value
    try:
        content = base64.b64decode(payload, validate=True)
    except (binascii.Error, ValueError):
        raise APIError('Error al procesar la imagen', 400)
    for signature, extension in _IMAGE_SIGNATURES:
        if content.startswith(signature):
            return content, extension
    raise APIError('Formato de imagen no permitido (png, jpg o gif)', 400)


def _save_image(tienda_id, content, extension):
    folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(folder, exist_ok=True)
    filename = f'tienda_{tienda_id}.{extension}'
    path = os.path.join(folder, filename)
    with open(path, 'wb') as f:
        f.write(content)
    return path, f'/uploads/{filename}'


def _remove_file(path):
    if path and os.path.exists(path):
        try:
            os.remove(path)
        except OSError:
            log.warning('No se pudo eliminar la imagen huérfana %s', path)
