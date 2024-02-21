import random
import string
from .models import Producto, Images

def generar_codigo():
    """Genera una contraseña aleatoria de la longitud especificada."""
    caracteres = string.ascii_letters + string.digits + string.punctuation
    code = ''.join(random.choice(caracteres) for _ in range(8))
    return code

