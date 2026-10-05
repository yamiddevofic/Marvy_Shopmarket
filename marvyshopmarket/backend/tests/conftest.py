import mongomock
import pytest

from app import create_app
from app.config import TestingConfig
from app.extensions import bcrypt, db, mongo
from app.models import Administrador, Tenderos, Tiendas

PASSWORD = 'secreto123'


@pytest.fixture
def app(tmp_path):
    class Config(TestingConfig):
        UPLOAD_FOLDER = str(tmp_path / 'uploads')

    app = create_app(Config)
    mongo.db = mongomock.MongoClient().db
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()
    mongo.db = None


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def tienda(app):
    """Tienda 1 con admin 100 y tendero 200; tienda 2 con admin 300."""
    password_hash = bcrypt.generate_password_hash(PASSWORD).decode('utf-8')
    db.session.add_all([
        Tiendas(tienda_Id=1, tienda_Nombre='Tienda Uno', tienda_Correo='uno@t.co'),
        Tiendas(tienda_Id=2, tienda_Nombre='Tienda Dos', tienda_Correo='dos@t.co'),
    ])
    db.session.flush()
    db.session.add_all([
        Administrador(adm_Id=100, adm_Nombre='Ana', adm_Correo='ana@t.co',
                      adm_Password=password_hash, tienda_Id=1),
        Administrador(adm_Id=300, adm_Nombre='Otro', adm_Correo='otro@t.co',
                      adm_Password=password_hash, tienda_Id=2),
        Tenderos(tendero_Id=200, tendero_Nombre='Tito', tendero_Correo='tito@t.co',
                 tendero_Password=password_hash, tienda_Id=1),
    ])
    db.session.commit()


def login(client, userid, password=PASSWORD):
    return client.post('/api/verificar-usuario', json={'userid': userid, 'password': password})


@pytest.fixture
def admin_client(client, tienda):
    assert login(client, 100).status_code == 200
    return client


@pytest.fixture
def tendero_client(client, tienda):
    assert login(client, 200).status_code == 200
    return client
