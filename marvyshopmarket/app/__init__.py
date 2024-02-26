from flask import Flask
from .models import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
<<<<<<< HEAD
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/marvy_shopmarket'
    app.config['SQLALCHEMY_BINDS'] = {
        'producto': 'mysql://root:@localhost/marvy_shopmarket',
        'suministro':'mysql://root:@localhost/marvy_shopmarket',
        'venta':'mysql://root:@localhost/marvy_shopmarket',
        'informe':'mysql://root:@localhost/marvy_shopmarket',
        'tienda':'mysql://root:@localhost/marvy_shopmarket',
=======
    app.config.from_pyfile('config.py')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:nidian56@localhost/marvy_shopmarket'
    app.config['SQLALCHEMY_BINDS'] = {
        'productos': 'mysql://root:nidian56@localhost/marvy_shopmarket',
        'suministros':'mysql://root:nidian56@localhost/marvy_shopmarket',
        'ventas':'mysql://root:nidian56@localhost/marvy_shopmarket',
        'informes':'mysql://root:nidian56@localhost/marvy_shopmarket',
        'tiendas':'mysql://root:nidian56@localhost/marvy_shopmarket',
>>>>>>> ad5bdaf3950453d5b3ca5ae409a364b8a5bdca00
    }

    db.init_app(app)
    bcrypt.init_app(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app
