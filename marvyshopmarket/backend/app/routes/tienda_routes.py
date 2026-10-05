from flask import Blueprint, current_app, jsonify, send_from_directory, session

from ..auth import ROLE_ADMIN, current_tienda_id, login_required
from ..errors import json_body
from ..services import tienda_service

tienda_bp = Blueprint('tienda', __name__)


@tienda_bp.post('/api/registrar-admin-tienda')
def registrar_admin_tienda():
    ids = tienda_service.registrar_admin_tienda(json_body())
    return jsonify({'message': 'Registro exitoso', **ids}), 201


@tienda_bp.get('/api/consultar-info')
@login_required(ROLE_ADMIN)
def consultar_info():
    datos = tienda_service.obtener_info(session['adm_Id'], current_tienda_id())
    return jsonify({'estado': 'exitoso', 'datos': datos})


@tienda_bp.get('/uploads/<path:filename>')
def imagen(filename):
    # send_from_directory rechaza rutas fuera de la carpeta (path traversal) y responde 404.
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
