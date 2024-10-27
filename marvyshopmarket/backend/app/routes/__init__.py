from flask import Blueprint

# Crear el Blueprint principal
main_bp = Blueprint('main', __name__)

# Importar todas las rutas
from .auth_routes import *
from .admin_routes import *
from .store_routes import *
from .tendero_routes import *


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
