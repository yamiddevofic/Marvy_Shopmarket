from flask import session

from tests.conftest import login


def test_estado_servidor(client):
    res = client.get('/api/verificar-usuario')
    assert res.status_code == 200
    assert res.get_json()['message'] == 'Conexión exitosa con el servidor'


def test_login_admin_crea_sesion(client, tienda):
    with client:
        res = login(client, '100')
        assert res.status_code == 200
        assert res.get_json() == {'message': 'Autenticación exitosa', 'name': 'Ana', 'rol': 'admin'}
        assert session['adm_Id'] == 100
        assert session['tienda_Id'] == 1


def test_login_tendero(client, tienda):
    res = login(client, 200)
    assert res.status_code == 200
    assert res.get_json()['rol'] == 'tendero'


def test_login_password_incorrecto(client, tienda):
    res = login(client, 100, 'incorrecta')
    assert res.status_code == 401
    assert 'trace' not in res.get_json()


def test_login_id_no_numerico_es_400(client, tienda):
    assert login(client, 'abc').status_code == 400


def test_login_sin_datos(client):
    assert client.post('/api/verificar-usuario', json={}).status_code == 400
    assert client.post('/api/verificar-usuario', data='no-json').status_code == 400


def test_login_limpia_sesion_previa(client, tienda):
    with client:
        login(client, 200)
        login(client, 100)
        assert 'tendero_Id' not in session


def test_cerrar_sesion(admin_client):
    assert admin_client.post('/api/cerrar-sesion').status_code == 200
    assert admin_client.get('/api/ruta-protegida').status_code == 401


def test_ruta_protegida(client, tienda):
    res = client.get('/api/ruta-protegida')
    assert res.status_code == 401
    assert res.get_json()['code'] == 'SESION_NO_ENCONTRADA'
    login(client, 100)
    assert client.get('/api/ruta-protegida').status_code == 200
