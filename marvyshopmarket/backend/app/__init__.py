from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from .config import get_config
from flask_migrate import Migrate
import logging
from sqlalchemy.exc import OperationalError
import time
from flask_cors import CORS

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    CORS(app, resources={r"/uploads/*": {"origins": "*"}})
    app.config.from_object(get_config())

    # Agregar pool_pre_ping y pool_recycle a la configuración
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 280
    }

    # Inicializar extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        try:
            db.create_all()
            logger.info("Tablas de la base de datos verificadas/creadas exitosamente")
        except Exception as e:
            logger.error(f"Error al inicializar la base de datos: {str(e)}")
            raise

    from .routes import main_bp
    app.register_blueprint(main_bp)

    @app.errorhandler(OperationalError)
    def handle_db_error(error):
        logger.error(f"Error de base de datos: {str(error)}")
        return {"message": "Error de conexión con la base de datos, por favor intente más tarde"}, 500

    return app

def get_db():
    return db
