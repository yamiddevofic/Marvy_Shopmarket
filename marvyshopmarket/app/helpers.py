import random
import string
from .models import Productos, Tiendas, Tenderos
import base64

def generar_codigo():
    """Genera una contraseña aleatoria de la longitud especificada."""
    caracteres = string.ascii_letters + string.digits + string.punctuation
    code = ''.join(random.choice(caracteres) for _ in range(8))
    return code

def obtener_informacion_perfil(tendero_id):
    # Busca el usuario en la base de datos por su ID
    tendero = Tenderos.query.filter_by(tendero_ID=tendero_id).first()
    # Si el usuario existe, devuelve su información de perfil, de lo contrario, devuelve None
    if tendero:
        return {
            'id': tendero.tendero_ID,
            'nombre': tendero.tendero_Nombre,
            'correo': tendero.tendero_Correo,
            # Otros campos del perfil que puedas tener en tu modelo de Usuario
        }
    else:
        return None
    
def obtener_informacion_tienda(tienda_id):
    tienda = Tiendas.query.filter_by(tienda_Id=tienda_id).first()

    if tienda:
        imagen_codificada = base64.b64encode(tienda.tienda_IMG).decode('utf-8')
        return {
            'id': tienda.tienda_Id,
            'nombre': tienda.tienda_Nombre,
            'ubicacion': tienda.tienda_Ubicacion,
            'imagen': imagen_codificada  # Asegúrate de devolver la imagen codificada
        }
