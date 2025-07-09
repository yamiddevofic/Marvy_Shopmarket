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
    app.config.from_object(get_config())

    # pool & cookie settings
    app.config.update(
        SQLALCHEMY_ENGINE_OPTIONS={
            'pool_pre_ping': True,
            'pool_recycle': int(os.getenv('POOL_RECYCLE', 280))
        },
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=True
    )

    origins = [
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
