from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from .config import DevelopmentConfig  # Cambia esto según el entorno de producción o desarrollo
from flask_migrate import Migrate

migrate = Migrate()
db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)  # Cargar configuración desde config.py
    
    # Inicializar SQLAlchemy y Bcrypt
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    # Registrar el blueprint
    from .routes import main_bp
    app.register_blueprint(main_bp)


    return app
