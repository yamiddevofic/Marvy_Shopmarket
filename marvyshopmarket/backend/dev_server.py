"""Servidor de demostración local.

Usa SQLite (backend/dev.db) y un MongoDB simulado en memoria, así que no
necesita MySQL, MongoDB ni archivo .env. Productos, ventas y gastos se reinician cada vez
que arranca; el resto de datos persiste en dev.db.

    python dev_server.py            # http://127.0.0.1:3333
"""
import os

import mongomock

from app import create_app
from app.config import DevelopmentConfig
from app.extensions import db, mongo
from app.models import Administrador, Tenderos, Tiendas
from app.services import fechas
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


def seed_movimientos():
    """Ventas y gastos de los últimos días para que el inicio muestre un resumen."""
    from datetime import timedelta
    hoy = fechas.hoy()
    ventas = [  # (días atrás, hora, [(producto, cantidad, precio)], método)
        (6, '09:10', [('prd_demo1', 3, 4800)], 'efectivo'),
        (5, '17:40', [('prd_demo2', 1, 14500), ('prd_demo3', 2, 4200)], 'transferencia'),
        (3, '11:05', [('prd_demo6', 1, 18900)], 'efectivo'),
        (2, '19:20', [('prd_demo4', 1, 21000), ('prd_demo5', 2, 3500)], 'tarjeta'),
        (1, '08:30', [('prd_demo1', 2, 4800), ('prd_demo3', 1, 4200)], 'efectivo'),
        (0, '10:15', [('prd_demo2', 1, 14500)], 'efectivo'),
    ]
    nombres = {p['_id']: p['nombre'] for p in mongo.db.productos.find()}
    mongo.db.ventas.insert_many([
        {'_id': f'vta_demo{i}', 'tienda_Id': 1,
         'fecha': f"{(hoy - timedelta(days=atras)).isoformat()}T{hora}:00-05:00",
         'dia': (hoy - timedelta(days=atras)).isoformat(),
         'items': [{'producto_id': pid, 'nombre': nombres[pid], 'cantidad': c, 'precio_unitario': float(pr),
                    'subtotal': float(pr * c)} for pid, c, pr in items],
         'total': float(sum(pr * c for _, c, pr in items)), 'metodo': metodo,
         'vendedor': {'rol': 'admin', 'id': DEMO_ID, 'nombre': 'Admin Demo'}, 'anulada': False}
        for i, (atras, hora, items, metodo) in enumerate(ventas, start=1)
    ])
    gastos = [  # (días atrás, descripción, categoría, monto)
        (6, 'Arriendo del local', 'Fijos', 45000),
        (4, 'Reparación de la nevera', 'Mantenimiento', 18000),
        (2, 'Recibo de la luz', 'Fijos', 12000),
        (0, 'Bolsas y empaques', 'Otros', 6000),
    ]
    mongo.db.gastos.insert_many([
        {'_id': f'gst_demo{i}', 'tienda_Id': 1, 'descripcion': d, 'categoria': c, 'monto': float(m),
         'dia': (hoy - timedelta(days=atras)).isoformat(), 'creado': ''}
        for i, (atras, d, c, m) in enumerate(gastos, start=1)
    ])


app = create_app(DemoConfig)
mongo.db = mongomock.MongoClient().db

with app.app_context():
    db.create_all()
    seed_sql()
    seed_productos()
    seed_movimientos()

if __name__ == '__main__':
    print(f'\n  Usuario de demo: {DEMO_ID} / {DEMO_PASSWORD}\n')
    app.run(host='127.0.0.1', port=int(os.getenv('PORT', 3333)), use_reloader=False)
