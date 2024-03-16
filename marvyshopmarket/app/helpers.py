import random
import string
from .models import Productos, Tiendas, Tenderos, Administrador, Ventas
import base64

def generar_codigo():
    """Genera una contraseña aleatoria de la longitud especificada."""
    caracteres = string.ascii_letters + string.digits + string.punctuation
    code = ''.join(random.choice(caracteres) for _ in range(8))
    return code

def obtener_informacion_adm(adm_id):
    try:
        # Busca el usuario en la base de datos por su ID
        administrador = Administrador.query.filter_by(adm_Id=adm_id).first()
        if administrador:
            return {
                'id': administrador.adm_Id,
                'nombre': administrador.adm_Nombre,
                'correo': administrador.adm_Correo,
                # Otros campos del perfil que puedas tener en tu modelo de Usuario
            }
    except Exception as e:
        print(f"Error al obtener información del perfil del administrador: {e}")
    return None
def obtener_informacion_tendero(tendero_id):
    try:
        # Busca el usuario en la base de datos por su ID
        tendero = Tenderos.query.filter_by(tendero_Id=tendero_id).first()
        if tendero:
            return {
                'id': tendero.tendero_Id,
                'nombre': tendero.tendero_Nombre,
                'correo': tendero.tendero_Correo,
                # Otros campos del perfil que puedas tener en tu modelo de Usuario
            }
    except Exception as e:
        print(f"Error al obtener información del perfil del administrador: {e}")
    return None


def obtener_informacion_tienda(tienda_id):
    try:
        # Busca la tienda en la base de datos por su ID
        tienda = Tiendas.query.filter_by(tienda_Id=tienda_id).first()
        if tienda:
            imagen_codificada = base64.b64encode(tienda.tienda_IMG).decode('utf-8')
            return {
                'id': tienda.tienda_Id,
                'nombre': tienda.tienda_Nombre,
                'ubicacion': tienda.tienda_Ubicacion,
                'imagen': imagen_codificada,  # Asegúrate de devolver la imagen codificada 
            }
    except Exception as e:
        print(f"Error al obtener información de la tienda: {e}")
    return None

def obtener_informacion_venta(venta_id):
    try:
        # Busca la tienda en la base de datos por su ID
        venta = Ventas.query.filter_by(venta_Id=venta_id).first()
        if venta:
            return {
                'id': venta.venta_Id,
                'nombre': tienda.tienda_Nombre,
                'ubicacion': tienda.tienda_Ubicacion,
            }
    except Exception as e:
        print(f"Error al obtener información de la tienda: {e}")
    return None
