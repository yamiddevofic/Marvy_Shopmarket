from flask import Blueprint, jsonify, session

from ..auth import login_required, start_session
from ..errors import json_body
from ..services import auth_service

auth_bp = Blueprint('auth', __name__, url_prefix='/api')


@auth_bp.get('/verificar-usuario')
def estado_servidor():
    return jsonify({'message': 'Conexión exitosa con el servidor'})


@auth_bp.post('/verificar-usuario')
def iniciar_sesion():
    data = json_body()
    rol, user_id, tienda_id, nombre = auth_service.autenticar(data.get('userid'), data.get('password'))
    start_session(rol, user_id, tienda_id)
    return jsonify({'message': 'Autenticación exitosa', 'name': nombre, 'rol': rol})


@auth_bp.post('/cerrar-sesion')
def cerrar_sesion():
    session.clear()
    return jsonify({'message': 'Cierre de sesión exitoso'})


@auth_bp.get('/ruta-protegida')
@login_required()
def ruta_protegida():
    return jsonify({'message': 'Acceso permitido a la ruta protegida'})
