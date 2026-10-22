from app.extensions import mongo
from tests.conftest import login


def gasto(**overrides):
    data = {'descripcion': 'Arriendo', 'categoria': 'Fijos', 'monto': 800000, 'dia': '2026-10-01'}
    data.update(overrides)
    return data


def test_registrar_listar_y_eliminar_gasto(admin_client):
    res = admin_client.post('/api/registrar-gasto', json=gasto())
    assert res.status_code == 201
    gasto_id = res.get_json()['gasto']['_id']

    data = admin_client.get('/api/listar-gastos').get_json()
    assert data['gastos'] == [{'_id': gasto_id, 'descripcion': 'Arriendo', 'categoria': 'Fijos',
                               'monto': 800000.0, 'dia': '2026-10-01'}]
    assert 'Mantenimiento' in data['categorias']

    assert admin_client.delete(f'/api/eliminar-gasto/{gasto_id}').status_code == 200
    assert admin_client.delete(f'/api/eliminar-gasto/{gasto_id}').status_code == 404


def test_gasto_validaciones(admin_client):
    assert admin_client.post('/api/registrar-gasto', json=gasto(categoria='Fiesta')).status_code == 400
    assert admin_client.post('/api/registrar-gasto', json=gasto(monto=0)).status_code == 400
    assert admin_client.post('/api/registrar-gasto', json=gasto(monto='mucho')).status_code == 400
    assert admin_client.post('/api/registrar-gasto', json=gasto(dia='ayer')).status_code == 400
    assert admin_client.post('/api/registrar-gasto', json=gasto(descripcion='')).status_code == 400


def test_gasto_sin_dia_usa_hoy(admin_client):
    data = gasto()
    del data['dia']
    assert admin_client.post('/api/registrar-gasto', json=data).status_code == 201
    hoy = admin_client.get('/api/listar-gastos?periodo=hoy').get_json()['gastos']
    assert len(hoy) == 1


def test_gastos_solo_de_la_tienda_y_solo_admin(client, tienda):
    mongo.db.gastos.insert_one({**gasto(), '_id': 'ajeno', 'tienda_Id': 2, 'creado': ''})
    login(client, 100)
    assert client.get('/api/listar-gastos').get_json()['gastos'] == []
    assert client.delete('/api/eliminar-gasto/ajeno').status_code == 404
    login(client, 200)
    assert client.get('/api/listar-gastos').status_code == 403
    assert client.post('/api/registrar-gasto', json=gasto()).status_code == 403


def test_resumen_de_caja(admin_client):
    mongo.db.productos.insert_one({'_id': 'arroz', 'nombre': 'Arroz', 'categoria': 'Granos', 'stock': 10,
                                   'tienda_Id': 1, 'precios': [{'fecha': '2026-01-01', 'precio': 2500}]})
    admin_client.post('/api/registrar-venta', json={'items': [{'producto_id': 'arroz', 'cantidad': 4}]})
    anulada = admin_client.post('/api/registrar-venta', json={'items': [{'producto_id': 'arroz', 'cantidad': 1}]})
    admin_client.post(f"/api/anular-venta/{anulada.get_json()['venta']['_id']}")
    for descripcion, categoria, monto in [('Luz', 'Fijos', 3000), ('Agua', 'Fijos', 1000), ('Pintura', 'Mantenimiento', 2000)]:
        data = gasto(descripcion=descripcion, categoria=categoria, monto=monto)
        del data['dia']
        admin_client.post('/api/registrar-gasto', json=data)

    resumen = admin_client.get('/api/resumen-caja?periodo=hoy').get_json()
    assert resumen['entradas'] == 10000  # la venta anulada no cuenta
    assert resumen['salidas'] == 6000
    assert resumen['balance'] == 4000
    assert resumen['num_ventas'] == 1
    assert resumen['gastos_por_categoria'] == [{'categoria': 'Fijos', 'total': 4000},
                                               {'categoria': 'Mantenimiento', 'total': 2000}]
    assert len(resumen['por_dia']) == 1

    semana = admin_client.get('/api/resumen-caja?periodo=semana').get_json()
    assert len(semana['por_dia']) == 7 and semana['entradas'] == 10000
