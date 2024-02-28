from flask import Flask
from .models import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
<<<<<<< HEAD
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/marvy_shopmarket'
    app.config['SQLALCHEMY_BINDS'] = {
        'productos': 'mysql://root:@localhost/marvy_shopmarket',
        'suministros':'mysql://root:@localhost/marvy_shopmarket',
        'ventas':'mysql://root:@localhost/marvy_shopmarket',
        'informes':'mysql://root:@localhost/marvy_shopmarket',
        'tiendas':'mysql://root:@localhost/marvy_shopmarket',
=======
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:nidian56@localhost/marvy_shopmarket'
    app.config['SQLALCHEMY_BINDS'] = {
        'productos': 'mysql://root:nidian56@localhost/marvy_shopmarket',
        'suministros':'mysql://root:nidian56@localhost/marvy_shopmarket',
        'ventas':'mysql://root:nidian56@localhost/marvy_shopmarket',
        'informes':'mysql://root:nidian56@localhost/marvy_shopmarket',
        'tiendas':'mysql://root:nidian56@localhost/marvy_shopmarket',
>>>>>>> d3b87b31ab27c44373eeeddc1bcd03c92d291ffe
    }

    db.init_app(app)
    bcrypt.init_app(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app
