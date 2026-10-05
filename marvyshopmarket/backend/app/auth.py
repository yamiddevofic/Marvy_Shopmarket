# backend/app/auth.py
"""Sesión de usuario y control de acceso por rol."""
from functools import wraps

from flask import session

from .errors import APIError

ROLE_ADMIN = 'admin'
ROLE_TENDERO = 'tendero'


def start_session(role, user_id, tienda_id):
    # Se limpia la sesión anterior para no mezclar claves de otro usuario.
    session.clear()
    session['tienda_Id'] = tienda_id
    session['adm_Id' if role == ROLE_ADMIN else 'tendero_Id'] = user_id
    session['rol'] = role
    session['logged_in'] = True


def current_role():
    if session.get('rol'):
        return session['rol']
    # Sesiones creadas antes de guardar el rol explícitamente.
    if session.get('adm_Id'):
        return ROLE_ADMIN
    if session.get('tendero_Id'):
        return ROLE_TENDERO
    return None


def current_tienda_id():
    return session.get('tienda_Id')


def login_required(*roles):
    """Exige sesión activa y, si se indican, uno de los roles dados."""
    def decorator(view):
        @wraps(view)
        def wrapper(*args, **kwargs):
            if not session.get('logged_in') or not current_tienda_id():
                raise APIError('No hay una sesión activa', 401, 'SESION_NO_ENCONTRADA')
            if roles and current_role() not in roles:
                raise APIError('No tiene permisos para esta acción', 403, 'SIN_PERMISOS')
            return view(*args, **kwargs)
        return wrapper
    return decorator
