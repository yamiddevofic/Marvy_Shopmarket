from app.extensions import mongo


def sembrar_productos():
    mongo.db.productos.insert_many([
        {'_id': 'arroz', 'nombre': 'Arroz', 'categoria': 'Granos', 'stock': 10, 'tienda_Id': 1,
         'precios': [{'fecha': '2026-01-01', 'precio': 2000}, {'fecha': '2026-02-01', 'precio': 2500}]},
        {'_id': 'leche', 'nombre': 'Leche', 'categoria': 'Lácteos', 'stock': 3, 'tienda_Id': 1,
         'precios': [{'fecha': '2026-01-01', 'precio': 4000}]},
        {'_id': 'ajeno', 'nombre': 'Ajeno', 'categoria': 'X', 'stock': 50, 'tienda_Id': 2,
         'precios': [{'fecha': '2026-01-01', 'precio': 100}]},
    ])


def stock(producto_id):
    return mongo.db.productos.find_one({'_id': producto_id})['stock']


def vender(client, *items, metodo='efectivo'):
    return client.post('/api/registrar-venta', json={
        'metodo': metodo, 'items': [{'producto_id': p, 'cantidad': c} for p, c in items]})


def test_venta_descuenta_inventario_y_usa_precio_vigente(tendero_client):
    sembrar_productos()
    res = vender(tendero_client, ('arroz', 2), ('leche', 1))
    assert res.status_code == 201
    venta = res.get_json()['venta']
    assert venta['total'] == 2 * 2500 + 4000
    assert venta['vendedor'] == {'rol': 'tendero', 'id': 200, 'nombre': 'Tito'}
    assert stock('arroz') == 8 and stock('leche') == 2


def test_venta_sin_stock_suficiente_no_descuenta_nada(admin_client):
    sembrar_productos()
    res = vender(admin_client, ('arroz', 2), ('leche', 4))
    assert res.status_code == 409
    assert 'Leche' in res.get_json()['message']
    assert stock('arroz') == 10 and stock('leche') == 3
    assert mongo.db.ventas.count_documents({}) == 0


def test_venta_suma_lineas_repetidas(admin_client):
    sembrar_productos()
    assert vender(admin_client, ('leche', 2), ('leche', 2)).status_code == 409
    assert vender(admin_client, ('leche', 1), ('leche', 2)).status_code == 201
    assert stock('leche') == 0


def test_venta_validaciones(admin_client):
    sembrar_productos()
    assert admin_client.post('/api/registrar-venta', json={'items': []}).status_code == 400
    assert vender(admin_client, ('arroz', 0)).status_code == 400
    assert vender(admin_client, ('arroz', 1), metodo='trueque').status_code == 400
    # no se puede vender un producto de otra tienda
    assert vender(admin_client, ('ajeno', 1)).status_code == 404
    assert stock('ajeno') == 50


def test_historial_de_ventas_mas_reciente_primero(admin_client):
    sembrar_productos()
    primera = vender(admin_client, ('arroz', 1)).get_json()['venta']
    segunda = vender(admin_client, ('leche', 1)).get_json()['venta']
    mongo.db.ventas.update_one({'_id': primera['_id']}, {'$set': {'fecha': '2026-01-01T08:00:00-05:00', 'dia': '2026-01-01'}})

    ids = [v['_id'] for v in admin_client.get('/api/listar-ventas').get_json()]
    assert ids == [segunda['_id'], primera['_id']]
    hoy = admin_client.get('/api/listar-ventas?periodo=hoy').get_json()
    assert [v['_id'] for v in hoy] == [segunda['_id']]
    rango = admin_client.get('/api/listar-ventas?desde=2026-01-01&hasta=2026-01-31').get_json()
    assert [v['_id'] for v in rango] == [primera['_id']]
    assert admin_client.get('/api/listar-ventas?periodo=siglo').status_code == 400


def test_anular_venta_devuelve_unidades(admin_client):
    sembrar_productos()
    venta = vender(admin_client, ('arroz', 3)).get_json()['venta']
    assert admin_client.post(f"/api/anular-venta/{venta['_id']}").status_code == 200
    assert stock('arroz') == 10
    assert admin_client.post(f"/api/anular-venta/{venta['_id']}").status_code == 409
    assert stock('arroz') == 10
    assert admin_client.get('/api/listar-ventas').get_json()[0]['anulada'] is True


def test_tendero_no_puede_anular(tendero_client):
    sembrar_productos()
    venta = vender(tendero_client, ('arroz', 1)).get_json()['venta']
    assert tendero_client.post(f"/api/anular-venta/{venta['_id']}").status_code == 403


def test_ventas_requieren_sesion(client):
    assert client.get('/api/listar-ventas').status_code == 401


def test_venta_en_efectivo_calcula_vueltos(admin_client):
    sembrar_productos()
    res = admin_client.post('/api/registrar-venta', json={
        'metodo': 'efectivo', 'recibido': 10000, 'items': [{'producto_id': 'arroz', 'cantidad': 2}]})
    venta = res.get_json()['venta']
    assert (venta['total'], venta['recibido'], venta['cambio']) == (5000, 10000, 5000)
    assert admin_client.get('/api/listar-ventas').get_json()[0]['cambio'] == 5000


def test_vueltos_validaciones(admin_client):
    sembrar_productos()
    item = [{'producto_id': 'arroz', 'cantidad': 2}]
    res = admin_client.post('/api/registrar-venta', json={'metodo': 'efectivo', 'recibido': 4000, 'items': item})
    assert res.status_code == 400 and stock('arroz') == 10  # no alcanza: no se descuenta nada
    assert admin_client.post('/api/registrar-venta', json={'metodo': 'efectivo', 'recibido': 'mucho', 'items': item}).status_code == 400
    # sin "recibido" se asume pago exacto; con otro método se ignora
    assert admin_client.post('/api/registrar-venta', json={'metodo': 'efectivo', 'items': item}).get_json()['venta']['cambio'] is None
    tarjeta = admin_client.post('/api/registrar-venta', json={'metodo': 'tarjeta', 'recibido': 1, 'items': item}).get_json()['venta']
    assert tarjeta['recibido'] is None and tarjeta['cambio'] is None
