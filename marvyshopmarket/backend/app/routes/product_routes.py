from flask import request, jsonify
from .. import mongo
from flask.views import MethodView
from datetime import datetime

class RegistrarProductoMongoAPI(MethodView):
    def post(self):
        try:
            data = request.get_json()
            required_fields = ['_id', 'nombre', 'categoria', 'precios', 'stock', 'tienda_Id']

            for field in required_fields:
                if field not in data:
                    return jsonify({'message': f'El campo {field} es requerido'}), 400
        
            # Insertar el nuevo producto
            mongo.db.productos.insert_one(data)
            return jsonify({'message': 'Producto registrado exitosamente'}), 201
        
        except Exception as e:
            return jsonify({'message': f'Error al registrar producto: {str(e)}'}), 500
        
class ListarProductosMongoAPI(MethodView):
    def get(self):
        try:
            productos = mongo.db.productos.find()
            return jsonify([{'_id': producto['_id' ], 'nombre': producto['nombre'], 'categoria': producto['categoria'], 'precio': producto['precios'][0]['precio'], 'stock': producto['stock']} for producto in productos])
        except Exception as e:
            return jsonify({'message': f'Error al listar productos: {str(e)}'}), 500
    
class EliminarProductoMongoAPI(MethodView):
    def delete(self, id):
        try:
            mongo.db.productos.delete_one({'_id': id})
            return jsonify({'message': 'Producto eliminado exitosamente'}), 200
        except Exception as e:
            return jsonify({'message': f'Error al eliminar producto: {str(e)}'}), 500
    