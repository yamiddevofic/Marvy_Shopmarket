from flask import Blueprint

# Crear el Blueprint principal
main_bp = Blueprint('main', __name__)

# Importar todas las rutas
from .auth_routes import *
from .admin_routes import *
from .store_routes import *
from .tendero_routes import *
from .product_routes import *

# Registrar todas las vistas
main_bp.add_url_rule('/api/verificar-usuario', 
view_func=VerificarUsuarioAPI.as_view('verificar_usuario_api'), 
methods=['GET', 'POST'])

main_bp.add_url_rule('/api/registrar-admin-tienda', 
view_func=RegistrarAdminTiendaAPI.as_view('registrar_admin_tienda_api'), 
methods=['POST'])

main_bp.add_url_rule('/api/registrar-tendero', 
view_func=RegistrarTenderoAPI.as_view('registrar_tendero_api'), 
methods=['POST'])

main_bp.add_url_rule('/api/consultar-info', 
view_func=ConsultarInfoAPI.as_view('consultar_info_api'),
methods=['GET', 'POST'])

imagenes_view = ImagenesAPI.as_view('imagenes_api')
main_bp.add_url_rule('/uploads/<path:filename>', view_func=imagenes_view, methods=['GET'])

cerrar_sesion_api = CerrarSesionAPI.as_view('cerrar_sesion_api')
main_bp.add_url_rule('/api/cerrar-sesion', view_func= cerrar_sesion_api, methods=['POST'])

ruta_protegida_api = RutaProtegidaAPI.as_view('ruta_protegida_api')
main_bp.add_url_rule('/api/ruta-protegida', view_func=ruta_protegida_api, methods=['GET'])

consultar_tenderos_api = ConsultarTenderosAPI.as_view('consultar_tenderos_api')
main_bp.add_url_rule('/api/consultar-tenderos', view_func=consultar_tenderos_api, methods=['GET'])

verifica_conexion_amysql_api = VerificaConexionAMySQLAPI.as_view('verifica_conexion_amysql_api')
main_bp.add_url_rule('/api/verifica-conexion-amysql', view_func=verifica_conexion_amysql_api, methods=['GET'])

verifica_conexion_amongodb_api = VerificaConexionAMongoDBAPI.as_view('verifica_conexion_amongodb_api')
main_bp.add_url_rule('/api/verifica-conexion-amongodb', view_func=verifica_conexion_amongodb_api, methods=['GET'])

registrar_producto_api = RegistrarProductoMongoAPI.as_view('registrar_producto_mongo_api')
main_bp.add_url_rule('/api/registrar-producto', view_func=registrar_producto_api, methods=['POST'])

listar_productos_api = ListarProductosMongoAPI.as_view('listar_productos_mongo_api')
main_bp.add_url_rule('/api/listar-productos', view_func=listar_productos_api, methods=['GET'])

eliminar_producto_api = EliminarProductoMongoAPI.as_view('eliminar_producto_mongo_api')
main_bp.add_url_rule('/api/eliminar-producto/<id>', view_func=eliminar_producto_api, methods=['DELETE'])

eliminar_tendero_api = EliminarTenderoAPI.as_view('eliminar_tendero_api')
actualizar_tendero_api = ActualizarTenderoAPI.as_view('actualizar_tendero_api')
main_bp.add_url_rule('/api/actualizar-tendero/<tendero_id>', view_func=actualizar_tendero_api, methods=['PATCH'])
main_bp.add_url_rule('/api/eliminar-tendero/<tendero_id>', view_func=eliminar_tendero_api, methods=['DELETE'])

actualizar_producto_api = ActualizarProductoMongoAPI.as_view('actualizar_producto_mongo_api')
main_bp.add_url_rule('/api/actualizar-producto/<id>', view_func=actualizar_producto_api, methods=['PATCH'])