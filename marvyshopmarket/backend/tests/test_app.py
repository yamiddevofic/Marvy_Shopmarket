import pytest

from app import create_app
from app.config import TestingConfig


def test_falla_sin_secret_key():
    class SinClave(TestingConfig):
        SECRET_KEY = None

    with pytest.raises(RuntimeError, match='SECRET_KEY'):
        create_app(SinClave)


def test_404_en_json(client):
    res = client.get('/api/no-existe')
    assert res.status_code == 404
    assert 'message' in res.get_json()


def test_errores_inesperados_no_filtran_detalles(app, client, tienda, monkeypatch):
    from app.services import auth_service

    def boom(*args):
        raise RuntimeError('detalle interno')

    monkeypatch.setattr(auth_service, 'autenticar', boom)
    res = client.post('/api/verificar-usuario', json={'userid': 1, 'password': 'x'})
    assert res.status_code == 500
    assert res.get_json() == {'message': 'Error interno del servidor'}


def test_cors_permite_origen_configurado(client):
    res = client.get('/api/verificar-usuario', headers={'Origin': 'http://localhost:5173'})
    assert res.headers['Access-Control-Allow-Origin'] == 'http://localhost:5173'
    assert res.headers['Access-Control-Allow-Credentials'] == 'true'

    res = client.get('/api/verificar-usuario', headers={'Origin': 'https://malicioso.example'})
    assert 'Access-Control-Allow-Origin' not in res.headers


def test_health_checks(client):
    from app.extensions import mongo

    assert client.get('/api/verifica-conexion-amysql').status_code == 200
    res = client.get('/api/verifica-conexion-amongodb')
    assert res.status_code == 200
    assert res.get_json() == {'message': 'Conexión exitosa con MongoDB'}  # sin datos de productos

    mongo.db = None
    assert client.get('/api/verifica-conexion-amongodb').status_code == 503
