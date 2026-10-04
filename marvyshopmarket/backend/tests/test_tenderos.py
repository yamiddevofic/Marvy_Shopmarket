from app.extensions import db
from app.models import Tenderos
from tests.conftest import login


def nuevo(**overrides):
    data = {'tendero_Id': '201', 'tendero_Nombre': 'Lina', 'tendero_Correo': 'lina@t.co',
            'tendero_Celular': '3000000000', 'tendero_Password': 'clave-123', 'tienda_Id': '1'}
    data.update(overrides)
    return data


def test_registrar_tendero(admin_client):
    res = admin_client.post('/api/registrar-tendero', json=nuevo())
    assert res.status_code == 201
    assert db.session.get(Tenderos, 201).tienda_Id == 1


def test_registrar_tendero_requiere_admin(client, tienda):
    assert client.post('/api/registrar-tendero', json=nuevo()).status_code == 401
    login(client, 200)
    assert client.post('/api/registrar-tendero', json=nuevo()).status_code == 403


def test_registrar_tendero_en_otra_tienda_prohibido(admin_client):
    assert admin_client.post('/api/registrar-tendero', json=nuevo(tienda_Id='2')).status_code == 403


def test_registrar_tendero_duplicados(admin_client):
    assert admin_client.post('/api/registrar-tendero', json=nuevo(tendero_Id='200')).status_code == 409
    assert admin_client.post('/api/registrar-tendero', json=nuevo(tendero_Correo='tito@t.co')).status_code == 409


def test_consultar_tenderos_solo_de_la_tienda(admin_client):
    db.session.add(Tenderos(tendero_Id=999, tendero_Nombre='Ajeno', tendero_Correo='x@t.co', tienda_Id=2))
    db.session.commit()
    body = admin_client.get('/api/consultar-tenderos').get_json()
    assert body['total'] == 1
    assert body['tenderos'][0] == {'id': 200, 'nombre': 'Tito', 'correo': 'tito@t.co',
                                   'celular': '', 'tienda_Id': 1}


def test_actualizar_tendero(admin_client):
    res = admin_client.patch('/api/actualizar-tendero/200',
                             json={'id': 200, 'nombre': 'Tito P.', 'celular': '311', 'tienda_Id': 2})
    assert res.status_code == 200
    tendero = db.session.get(Tenderos, 200)
    assert tendero.tendero_Nombre == 'Tito P.'
    assert tendero.tendero_Celular == '311'
    assert tendero.tienda_Id == 1  # no se puede mover a otra tienda


def test_actualizar_tendero_correo_invalido(admin_client):
    assert admin_client.patch('/api/actualizar-tendero/200', json={'correo': 'sin-arroba'}).status_code == 400


def test_eliminar_tendero(admin_client):
    assert admin_client.delete('/api/eliminar-tendero/200').status_code == 200
    assert db.session.get(Tenderos, 200) is None
    assert admin_client.delete('/api/eliminar-tendero/200').status_code == 404


def test_no_se_gestionan_tenderos_de_otra_tienda(client, tienda):
    login(client, 300)  # admin de la tienda 2
    assert client.delete('/api/eliminar-tendero/200').status_code == 404
    assert client.patch('/api/actualizar-tendero/200', json={'nombre': 'X'}).status_code == 404
    assert db.session.get(Tenderos, 200).tendero_Nombre == 'Tito'


def test_endpoints_sin_sesion(client, tienda):
    assert client.get('/api/consultar-tenderos').status_code == 401
    assert client.delete('/api/eliminar-tendero/200').status_code == 401
    assert client.patch('/api/actualizar-tendero/200', json={}).status_code == 401
