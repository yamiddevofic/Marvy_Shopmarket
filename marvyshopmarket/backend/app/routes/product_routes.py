from flask import Blueprint, jsonify

from ..auth import current_tienda_id, login_required
from ..errors import json_body
from ..services import producto_service

producto_bp = Blueprint('producto', __name__, url_prefix='/api')


@producto_bp.post('/registrar-producto')
@login_required()
def registrar_producto():
    producto_id = producto_service.registrar(current_tienda_id(), json_body())
    return jsonify({'message': 'Producto registrado exitosamente', '_id': producto_id}), 201


@producto_bp.get('/listar-productos')
@login_required()
def listar_productos():
    return jsonify(producto_service.listar(current_tienda_id()))


@producto_bp.patch('/actualizar-producto/<producto_id>')
@login_required()
def actualizar_producto(producto_id):
    producto_service.actualizar(current_tienda_id(), producto_id, json_body())
    return jsonify({'message': 'Producto actualizado exitosamente'})


@producto_bp.delete('/eliminar-producto/<producto_id>')
@login_required()
def eliminar_producto(producto_id):
    producto_service.eliminar(current_tienda_id(), producto_id)
    return jsonify({'message': 'Producto eliminado exitosamente'})
