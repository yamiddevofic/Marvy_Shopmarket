from flask import Flask
from .models import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/marvy_shopmarket'
    app.config['SQLALCHEMY_BINDS'] = {
        'producto': 'mysql://root:@localhost/marvy_shopmarket',
        'suministro':'mysql://root:@localhost/marvy_shopmarket',
        'venta':'mysql://root:@localhost/marvy_shopmarket',
        'informe':'mysql://root:@localhost/marvy_shopmarket',
        'tienda':'mysql://root:@localhost/marvy_shopmarket',
    }

    db.init_app(app)
    bcrypt.init_app(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app
