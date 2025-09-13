# backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy.exc import OperationalError
import logging, os
from .config import get_config

log = logging.getLogger(__name__)
db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app() -> Flask:
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY")
    app.config.from_object(get_config())

    is_prod = os.getenv("FLASK_ENV") == "production"

    # Cookies de sesión: en producción, Secure y SameSite=None para permitir credenciales cross-site sobre HTTPS.
    # En desarrollo, permitir HTTP (no Secure) y SameSite=Lax (mismo sitio: localhost:puerto distinto sigue siendo same-site).
    app.config.update(
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=True,
    )

    origins = [
        "http://localhost:5174",
        "http://172.20.0.3:5173",
        "http://localhost:5173",
        "http://localhost:5000",
        "https://marvyshopmarket.com",
        "https://marvy-shopmarket.onrender.com"
    ]

    CORS(app, origins=origins, supports_credentials=True,
         resources={r"/api/*": {"origins": origins},
                    r"/upload/*": {"origins": origins}})

    # extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    # blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)

    @app.errorhandler(OperationalError)
    def db_err(e):
        log.error("DB error: %s", e)
        return {"message": "db error"}, 500

    return app
