# backend/app/extensions.py
"""Instancias de extensiones compartidas.

Viven en un módulo propio para que modelos, servicios y rutas puedan
importarlas sin depender de la fábrica de la aplicación (evita imports
circulares con ``app/__init__.py``).
"""
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_pymongo import PyMongo
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()
mongo = PyMongo()
