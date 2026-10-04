# backend/app/__init__.py
import logging

from flask import Flask
from flask_cors import CORS

from .config import get_config
from .errors import register_error_handlers
from .extensions import bcrypt, db, migrate, mongo

log = logging.getLogger(__name__)


def create_app(config_object=None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object or get_config())
    _validate_config(app)
    _configure_logging(app)
    app.json.ensure_ascii = False  # respuestas con tildes legibles (UTF-8)

    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)

    # extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    if app.config.get('MONGO_URI'):
        mongo.init_app(app)
    else:
        log.warning('MONGO_URI no está configurado: los endpoints de productos no estarán disponibles')

    # importa los modelos para que Flask-Migrate los detecte
    from . import models  # noqa: F401
    from .routes import register_blueprints

    register_blueprints(app)
    register_error_handlers(app)
    return app


def _validate_config(app):
    missing = [key for key in ('SECRET_KEY', 'SQLALCHEMY_DATABASE_URI') if not app.config.get(key)]
    if missing:
        raise RuntimeError(f"Faltan variables de configuración: {', '.join(missing)}")


def _configure_logging(app):
    # Los logs van a stderr (Docker/Render los recogen); no se escriben archivos locales.
    logging.basicConfig(
        level=logging.DEBUG if app.debug else logging.INFO,
        format='%(asctime)s %(levelname)s [%(name)s] %(message)s',
    )
