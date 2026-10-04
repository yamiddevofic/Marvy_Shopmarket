"""Servidor de demostración local.

Usa SQLite (backend/dev.db) y un MongoDB simulado en memoria, así que no
necesita MySQL, MongoDB ni archivo .env. Los productos se reinician cada vez
que arranca; el resto de datos persiste en dev.db.

    python dev_server.py            # http://127.0.0.1:3333
"""
import os

import mongomock

from app import create_app
from app.config import DevelopmentConfig
from app.extensions import db, mongo
from app.models import Administrador, Tenderos, Tiendas
from app.services.auth_service import hash_password

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEMO_ID = 12345678
DEMO_PASSWORD = 'clave123'


class DemoConfig(DevelopmentConfig):
    SECRET_KEY = 'demo-local-no-usar-en-produccion'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'dev.db')
    SQLALCHEMY_ENGINE_OPTIONS = {}
    MONGO_URI = None
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')


def seed_sql():
    if db.session.get(Administrador, DEMO_ID):
        return
    db.session.add(Tiendas(tienda_Id=1, tienda_Nombre='Tienda Demo', tienda_Correo='demo@tienda.co',
                           tienda_Celular='3001234567', tienda_Ubicacion='Bogotá'))
    db.session.flush()
    password = hash_password(DEMO_PASSWORD)
    db.session.add(Administrador(adm_Id=DEMO_ID, adm_Nombre='Admin Demo', adm_Correo='admin@demo.co',
                                 adm_Password=password, tienda_Id=1))
    db.session.add_all([
        Tenderos(tendero_Id=2001, tendero_Nombre='Laura Gómez', tendero_Correo='laura@demo.co',
                 tendero_Celular='3101112233', tendero_Password=password, tienda_Id=1),
        Tenderos(tendero_Id=2002, tendero_Nombre='Carlos Ruiz', tendero_Correo='carlos@demo.co',
                 tendero_Celular='3204445566', tendero_Password=password, tienda_Id=1),
    ])
    db.session.commit()


def seed_productos():
    productos = [
        ('Arroz blanco 1 kg', 'Granos', 4800, 40),
        ('Aceite de girasol 1 L', 'Despensa', 14500, 22),
        ('Leche entera 1 L', 'Lácteos', 4200, 6),
        ('Huevos AA x30', 'Lácteos', 21000, 15),
        ('Panela 500 g', 'Despensa', 3500, 3),
        ('Café molido 500 g', 'Despensa', 18900, 18),
    ]
    mongo.db.productos.insert_many([
        {'_id': f'prd_demo{i}', 'nombre': nombre, 'categoria': categoria, 'stock': stock,
         'tienda_Id': 1, 'precios': [{'fecha': '2026-10-01', 'precio': precio}]}
        for i, (nombre, categoria, precio, stock) in enumerate(productos, start=1)
    ])


app = create_app(DemoConfig)
mongo.db = mongomock.MongoClient().db

with app.app_context():
    db.create_all()
    seed_sql()
    seed_productos()

if __name__ == '__main__':
    print(f'\n  Usuario de demo: {DEMO_ID} / {DEMO_PASSWORD}\n')
    app.run(host='127.0.0.1', port=int(os.getenv('PORT', 3333)), use_reloader=False)
