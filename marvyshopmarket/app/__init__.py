from flask import Flask
from .models import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    db.init_app(app)
    bcrypt.init_app(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app
