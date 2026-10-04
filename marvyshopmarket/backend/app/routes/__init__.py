"""Registro de blueprints. Cada módulo agrupa los endpoints de un dominio."""
from .auth_routes import auth_bp
from .health_routes import health_bp
from .product_routes import producto_bp
from .tendero_routes import tendero_bp
from .tienda_routes import tienda_bp


def register_blueprints(app):
    for blueprint in (auth_bp, health_bp, tienda_bp, tendero_bp, producto_bp):
        app.register_blueprint(blueprint)
