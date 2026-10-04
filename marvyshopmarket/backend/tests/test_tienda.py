import base64

from app.extensions import bcrypt, db
from app.models import Administrador, Tiendas

PNG = b'\x89PNG\r\n\x1a\n' + b'\x00' * 16


def payload(**overrides):
    data = {
        'tienda_Id': '10', 'tienda_Nombre': 'Mi Tienda', 'tienda_Correo': 'tienda@x.co',
        'tienda_Celular': '3001234567', 'tienda_Ubicacion': 'Bogotá',
        'adm_Id': '1010', 'adm_Nombre': 'Laura', 'adm_Correo': 'laura@x.co',
        'adm_Password': 'clave-segura',
    }
    data.update(overrides)
    return data


def test_registro_crea_tienda_y_admin(client, app):
    res = client.post('/api/registrar-admin-tienda', json=payload())
    assert res.status_code == 201
    assert res.get_json() == {'message': 'Registro exitoso', 'admin_id': 1010, 'tienda_id': 10}

    admin = db.session.get(Administrador, 1010)
    assert admin.tienda_Id == 10
    assert bcrypt.check_password_hash(admin.adm_Password, 'clave-segura')
    assert db.session.get(Tiendas, 10).tienda_Nombre == 'Mi Tienda'


def test_registro_y_login(client):
    client.post('/api/registrar-admin-tienda', json=payload())
    res = client.post('/api/verificar-usuario', json={'userid': '1010', 'password': 'clave-segura'})
    assert res.status_code == 200


def test_registro_con_imagen_y_descarga(client, app):
    img = 'data:image/png;base64,' + base64.b64encode(PNG).decode()
    assert client.post('/api/registrar-admin-tienda', json=payload(tienda_Img=img)).status_code == 201

    client.post('/api/verificar-usuario', json={'userid': '1010', 'password': 'clave-segura'})
    info = client.get('/api/consultar-info').get_json()
    assert info['datos']['tienda']['imagen'] == '/uploads/tienda_10.png'

    res = client.get('/uploads/tienda_10.png')
    assert res.status_code == 200
    assert res.data == PNG


def test_registro_rechaza_archivo_que_no_es_imagen(client):
    img = base64.b64encode(b'<?php echo 1; ?>').decode()
    res = client.post('/api/registrar-admin-tienda', json=payload(tienda_Img=img))
    assert res.status_code == 400
    assert db.session.get(Tiendas, 10) is None


def test_registro_campos_requeridos(client):
    res = client.post('/api/registrar-admin-tienda', json=payload(adm_Password=''))
    assert res.status_code == 400
    assert 'adm_Password' in res.get_json()['message']


def test_registro_ids_invalidos(client):
    assert client.post('/api/registrar-admin-tienda', json=payload(tienda_Id='x')).status_code == 400


def test_registro_duplicado(client, tienda):
    assert client.post('/api/registrar-admin-tienda', json=payload(tienda_Id='1')).status_code == 409
    # el ID del admin no puede coincidir con un tendero existente (login ambiguo)
    assert client.post('/api/registrar-admin-tienda', json=payload(adm_Id='200')).status_code == 409


def test_consultar_info(admin_client):
    res = admin_client.get('/api/consultar-info')
    assert res.status_code == 200
    body = res.get_json()
    assert body['estado'] == 'exitoso'
    assert body['datos']['administrador']['nombre'] == 'Ana'
    assert body['datos']['tienda']['id'] == 1
    assert body['datos']['tienda']['imagen'] is None


def test_consultar_info_sin_sesion(client):
    assert client.get('/api/consultar-info').status_code == 401


def test_consultar_info_requiere_admin(tendero_client):
    assert tendero_client.get('/api/consultar-info').status_code == 403


def test_imagen_inexistente_y_path_traversal(client):
    assert client.get('/uploads/no-existe.png').status_code == 404
    assert client.get('/uploads/../config.py').status_code == 404
