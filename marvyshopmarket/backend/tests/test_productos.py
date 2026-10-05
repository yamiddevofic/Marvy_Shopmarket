from app.extensions import mongo
from tests.conftest import login


def producto(**overrides):
    data = {'_id': 'prd_1', 'nombre': 'Arroz', 'categoria': 'Granos', 'stock': 10,
            'precios': [{'fecha': '2026-01-01', 'precio': 2500}], 'tienda_Id': 999}
    data.update(overrides)
    return data


def test_registrar_y_listar(admin_client):
    res = admin_client.post('/api/registrar-producto', json=producto())
    assert res.status_code == 201
    # la tienda se toma de la sesión, no del cuerpo
    assert mongo.db.productos.find_one({'_id': 'prd_1'})['tienda_Id'] == 1

    assert admin_client.get('/api/listar-productos').get_json() == [
        {'_id': 'prd_1', 'nombre': 'Arroz', 'categoria': 'Granos', 'precio': 2500.0, 'stock': 10}
    ]


def test_registrar_genera_id_si_falta(tendero_client):
    data = producto()
    del data['_id']
    res = tendero_client.post('/api/registrar-producto', json=data)
    assert res.status_code == 201
    assert res.get_json()['_id'].startswith('prd_')


def test_registrar_ignora_campos_extra(admin_client):
    admin_client.post('/api/registrar-producto', json=producto(admin=True))
    assert 'admin' not in mongo.db.productos.find_one({'_id': 'prd_1'})


def test_registrar_validaciones(admin_client):
    assert admin_client.post('/api/registrar-producto', json=producto(stock='muchos')).status_code == 400
    assert admin_client.post('/api/registrar-producto', json=producto(precios=[])).status_code == 400
    assert admin_client.post('/api/registrar-producto', json=producto(nombre='')).status_code == 400


def test_registrar_duplicado(admin_client):
    admin_client.post('/api/registrar-producto', json=producto())
    assert admin_client.post('/api/registrar-producto', json=producto()).status_code == 409


def test_listar_solo_productos_de_la_tienda(admin_client):
    mongo.db.productos.insert_one({**producto(_id='ajeno'), 'tienda_Id': 2})
    mongo.db.productos.insert_one({**producto(_id='texto'), 'tienda_Id': '1'})
    ids = {p['_id'] for p in admin_client.get('/api/listar-productos').get_json()}
    assert ids == {'texto'}


def test_actualizar_producto(admin_client):
    admin_client.post('/api/registrar-producto', json=producto())
    res = admin_client.patch('/api/actualizar-producto/prd_1',
                             json={'nombre': 'Arroz Premium', 'stock': '7', 'tienda_Id': 2, '$where': 'x'})
    assert res.status_code == 200
    doc = mongo.db.productos.find_one({'_id': 'prd_1'})
    assert doc['nombre'] == 'Arroz Premium'
    assert doc['stock'] == 7
    assert doc['tienda_Id'] == 1


def test_actualizar_sin_campos_validos(admin_client):
    admin_client.post('/api/registrar-producto', json=producto())
    assert admin_client.patch('/api/actualizar-producto/prd_1', json={'otro': 1}).status_code == 400


def test_eliminar_producto(admin_client):
    admin_client.post('/api/registrar-producto', json=producto())
    assert admin_client.delete('/api/eliminar-producto/prd_1').status_code == 200
    assert admin_client.delete('/api/eliminar-producto/prd_1').status_code == 404


def test_no_se_modifican_productos_de_otra_tienda(client, tienda):
    mongo.db.productos.insert_one({**producto(), 'tienda_Id': 1})
    login(client, 300)
    assert client.patch('/api/actualizar-producto/prd_1', json={'nombre': 'X'}).status_code == 404
    assert client.delete('/api/eliminar-producto/prd_1').status_code == 404
    assert mongo.db.productos.find_one({'_id': 'prd_1'})['nombre'] == 'Arroz'


def test_productos_requieren_sesion(client):
    assert client.get('/api/listar-productos').status_code == 401
    assert client.post('/api/registrar-producto', json=producto()).status_code == 401


def test_mongo_no_configurado_responde_503(admin_client):
    mongo.db = None
    assert admin_client.get('/api/listar-productos').status_code == 503
