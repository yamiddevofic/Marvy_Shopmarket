# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy.exc import OperationalError
import logging
import os

from .config import get_config

# ───────── CONFIGURAR COOKIE DE SESIÓN ─────────
app.config.update(
    SESSION_COOKIE_SAMESITE="None",   # permite enviarla entre dominios
    SESSION_COOKIE_SECURE=True        # exige HTTPS (Render ya lo usa)
)


# ──────────────────  Logger  ──────────────────
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# ──────────────────  Extensiones  ──────────────────
db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()

# ──────────────────  App factory  ──────────────────
def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config())

    # Pool (override si llega por env)
    app.config.setdefault("SQLALCHEMY_ENGINE_OPTIONS", {})
    app.config["SQLALCHEMY_ENGINE_OPTIONS"].update(
        pool_pre_ping=True,
        pool_recycle=int(os.getenv("POOL_RECYCLE", 280)),
    )

    # CORS
    origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    CORS(
        app,
        origins=origins,
        supports_credentials=True,            #  ← imprescindible
        resources={r"/api/*": {"origins": origins}}
    )

    # Extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    # Blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)

    # DB check (solo dev)
    if app.config.get("DEBUG"):
        with app.app_context():
            try:
                db.create_all()  # usa flask db upgrade en prod
                log.info("Tablas verificadas/creadas.")
            except Exception as e:
                log.error("DB init error: %s", e)
                raise

    # Manejo global de errores DB
    @app.errorhandler(OperationalError)
    def handle_db_error(err):
        log.error("DB error: %s", err)
        return {"message": "Error de base de datos. Intenta más tarde."}, 500

    return app


def get_db() -> SQLAlchemy:
    return db