import logging

from flask import Blueprint, jsonify
from sqlalchemy import text

from ..extensions import db, mongo

log = logging.getLogger(__name__)

health_bp = Blueprint('health', __name__, url_prefix='/api')


@health_bp.get('/verifica-conexion-amysql')
def verificar_mysql():
    try:
        db.session.execute(text('SELECT 1'))
    except Exception:
        log.exception('Fallo la verificación de MySQL')
        return jsonify({'message': 'Error al conectar con MySQL'}), 503
    return jsonify({'message': 'Conexión exitosa con MySQL'})


@health_bp.get('/verifica-conexion-amongodb')
def verificar_mongodb():
    try:
        if mongo.db is None:
            raise RuntimeError('MONGO_URI no configurado')
        mongo.db.command('ping')
    except Exception:
        log.exception('Fallo la verificación de MongoDB')
        return jsonify({'message': 'Error al conectar con MongoDB'}), 503
    return jsonify({'message': 'Conexión exitosa con MongoDB'})
