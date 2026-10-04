# backend/app/errors.py
"""Errores de la API y manejadores globales.

Las rutas y servicios lanzan ``APIError``; aquí se convierten en respuestas
JSON uniformes. Los errores inesperados se registran en el log y el cliente
solo recibe un mensaje genérico (nunca trazas ni detalles internos).
"""
import logging

from flask import jsonify, request
from sqlalchemy.exc import OperationalError
from werkzeug.exceptions import HTTPException

from .extensions import db

log = logging.getLogger(__name__)


class APIError(Exception):
    def __init__(self, message, status=400, code=None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.code = code

    def to_dict(self):
        body = {'message': self.message}
        if self.code:
            body['code'] = self.code
        return body


def json_body():
    """Devuelve el cuerpo JSON de la petición o lanza 400 si no es un objeto."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise APIError('Se esperaba un cuerpo JSON', 400)
    return data


def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        return jsonify(error.to_dict()), error.status

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({'message': error.description}), error.code

    @app.errorhandler(OperationalError)
    def handle_db_error(error):
        db.session.rollback()
        log.error('Error de base de datos: %s', error)
        return jsonify({'message': 'Error de base de datos'}), 503

    @app.errorhandler(Exception)
    def handle_unexpected(error):
        db.session.rollback()
        log.exception('Error no controlado en %s %s', request.method, request.path)
        return jsonify({'message': 'Error interno del servidor'}), 500
