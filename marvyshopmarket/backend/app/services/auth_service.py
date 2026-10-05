from ..auth import ROLE_ADMIN, ROLE_TENDERO
from ..errors import APIError
from ..extensions import bcrypt, db
from ..models import Administrador, Tenderos
from .validation import parse_int

CREDENCIALES_INVALIDAS = 'Usuario no encontrado o contraseña incorrecta'


def autenticar(userid, password):
    """Valida credenciales y devuelve (rol, id_usuario, tienda_id, nombre)."""
    if not userid or not password:
        raise APIError('Faltan datos de usuario o contraseña', 400)
    user_id = parse_int(userid, 'userid')

    administrador = db.session.get(Administrador, user_id)
    if administrador and _password_ok(administrador.adm_Password, password):
        return ROLE_ADMIN, administrador.adm_Id, administrador.tienda_Id, administrador.adm_Nombre

    tendero = db.session.get(Tenderos, user_id)
    if tendero and _password_ok(tendero.tendero_Password, password):
        return ROLE_TENDERO, tendero.tendero_Id, tendero.tienda_Id, tendero.tendero_Nombre

    raise APIError(CREDENCIALES_INVALIDAS, 401)


def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')


def _password_ok(stored_hash, password):
    if not stored_hash:
        return False
    try:
        return bcrypt.check_password_hash(stored_hash, password)
    except ValueError:
        # Hash corrupto o en otro formato: se trata como credencial inválida.
        return False
