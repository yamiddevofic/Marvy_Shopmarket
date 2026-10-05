from flask import Blueprint, jsonify

from ..auth import ROLE_ADMIN, current_tienda_id, login_required
from ..errors import json_body
from ..services import tendero_service

tendero_bp = Blueprint('tendero', __name__, url_prefix='/api')


@tendero_bp.post('/registrar-tendero')
@login_required(ROLE_ADMIN)
def registrar_tendero():
    tendero_id = tendero_service.registrar(current_tienda_id(), json_body())
    return jsonify({'message': 'Registro de tendero exitoso', 'tendero_id': tendero_id}), 201


@tendero_bp.get('/consultar-tenderos')
@login_required(ROLE_ADMIN)
def consultar_tenderos():
    tenderos = tendero_service.listar(current_tienda_id())
    return jsonify({'message': 'Consulta exitosa', 'tenderos': tenderos, 'total': len(tenderos)})


@tendero_bp.patch('/actualizar-tendero/<int:tendero_id>')
@login_required(ROLE_ADMIN)
def actualizar_tendero(tendero_id):
    tendero_service.actualizar(current_tienda_id(), tendero_id, json_body())
    return jsonify({'message': 'Tendero actualizado exitosamente'})


@tendero_bp.delete('/eliminar-tendero/<int:tendero_id>')
@login_required(ROLE_ADMIN)
def eliminar_tendero(tendero_id):
    tendero_service.eliminar(current_tienda_id(), tendero_id)
    return jsonify({'message': 'Tendero eliminado exitosamente'})
