from flask import Blueprint, jsonify, request

from ..auth import ROLE_ADMIN, current_role, current_tienda_id, current_user_id, login_required
from ..errors import json_body
from ..services import caja_service, fechas, gasto_service, venta_service

venta_bp = Blueprint('venta', __name__, url_prefix='/api')


def _rango():
    args = request.args
    return fechas.rango(args.get('periodo'), args.get('desde'), args.get('hasta'))


@venta_bp.post('/registrar-venta')
@login_required()
def registrar_venta():
    venta = venta_service.registrar(current_tienda_id(), json_body(), current_role(), current_user_id())
    return jsonify({'message': 'Venta registrada exitosamente', 'venta': venta}), 201


@venta_bp.get('/listar-ventas')
@login_required()
def listar_ventas():
    return jsonify(venta_service.listar(current_tienda_id(), *_rango()))


@venta_bp.post('/anular-venta/<venta_id>')
@login_required(ROLE_ADMIN)
def anular_venta(venta_id):
    venta_service.anular(current_tienda_id(), venta_id)
    return jsonify({'message': 'Venta anulada; las unidades volvieron al inventario'})


@venta_bp.post('/registrar-gasto')
@login_required(ROLE_ADMIN)
def registrar_gasto():
    gasto = gasto_service.registrar(current_tienda_id(), json_body())
    return jsonify({'message': 'Gasto registrado exitosamente', 'gasto': gasto}), 201


@venta_bp.get('/listar-gastos')
@login_required(ROLE_ADMIN)
def listar_gastos():
    return jsonify({'gastos': gasto_service.listar(current_tienda_id(), *_rango()),
                    'categorias': list(gasto_service.CATEGORIAS)})


@venta_bp.delete('/eliminar-gasto/<gasto_id>')
@login_required(ROLE_ADMIN)
def eliminar_gasto(gasto_id):
    gasto_service.eliminar(current_tienda_id(), gasto_id)
    return jsonify({'message': 'Gasto eliminado exitosamente'})


@venta_bp.get('/resumen-caja')
@login_required(ROLE_ADMIN)
def resumen_caja():
    return jsonify(caja_service.resumen(current_tienda_id(), request.args.get('periodo')))
