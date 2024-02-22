import re
from flask import Blueprint, render_template, request,redirect,url_for
from .models import Producto, Images
from app import db
import base64
import locale

# Establece la configuración regional actual para usar el formato local
locale.setlocale(locale.LC_ALL, '')

main_bp = Blueprint('main',__name__)

@main_bp.route('/')
def index():
    return render_template('0_welcome.html')

@main_bp.route('/login', methods=['GET','POST'])
def login():
    return render_template('1_login.html')

@main_bp.route('/signUp',methods=['GET','POST'])
def redirigir_registro():
    return render_template('2_sign_up.html')

@main_bp.route('/pagina-principal', methods=['GET','POST'])
def pagina_principal():
    return render_template('3_vista-principal.html')
    
@main_bp.route('/registro-producto', methods=['GET','POST'])
def registro_producto():
    if request.method == 'GET':  
        return render_template('4_registro_prod.html')
    
@main_bp.route('/registro-suministro', methods=['GET','POST'])
def registro_suministro():
    if request.method == 'GET':  
        return render_template('5_registro_suministro.html')
    
@main_bp.route('/registro-ventas', methods=['GET','POST'])
def registro_ventas():
    if request.method == 'GET':  
        return render_template('6_registro_ventas.html')
    
@main_bp.route('/generar-informe', methods=['GET','POST'])
def generar_informe():
    return render_template('9_generar-informe.html')

@main_bp.route('/ajustes-generales', methods=['GET','POST'])
def ajustes_generales():
    return render_template('13_ajustes-generales.html')

@main_bp.route('/ajustes-cuenta', methods=['GET','POST'])
def ajustes_cuenta():
    if request.method == 'GET':  
        return render_template('14_ajustes-cuenta.html')

@main_bp.route('/historial-productos', methods=['GET','POST'])
def historial_productos():
    if request.method == "GET":
       
        productos = Producto.query.all()
       
        suma_totales=sum(producto.prod_Total for producto in productos)
        # Formatea la suma total con separadores de miles
        suma_totales_formateada = locale.format_string('%d', round(suma_totales), grouping=True)
        suma_productos='{:n}'.format(round(sum(producto.prod_Cantidad for producto in productos)))

        for producto in productos:
            producto.prod_Img = base64.b64encode(producto.prod_Img).decode('utf-8')
       
            producto.prod_Precio = locale.format_string('%d', round(producto.prod_Precio), grouping=True)
            producto.prod_Total = locale.format_string('%d', round(float(producto.prod_Total)), grouping=True)
       
        return render_template('11_historial_prod.html', productos=productos, suma_totales_formateada=suma_totales_formateada,suma_productos=suma_productos)

@main_bp.route('/nuevo_producto', methods=['POST'])
def nuevo_producto():
    if request.method == 'POST':
        id = request.form['prod_Id']
        nombre = request.form['prod_Nombre']
        precio = request.form['prod_Precio']
        cantidad = request.form['prod_Cantidad']
        imagen = request.files['prod_Img']
        imagen_data = imagen.read()
        
     
        # Valida los datos antes de insertarlos en la base de datos

        nombre_min = nombre.lower()
        id_exist = Producto.query.filter_by(prod_Id=id).first()

        nombre_exist = Producto.query.filter(db.func.lower(Producto.prod_Nombre) == nombre_min).first()
        if not id or not nombre or not precio or not cantidad or not imagen:
            mensaje="Complete todos los datos"
            estado = 0
        elif id_exist or nombre_exist:
            mensaje="Este producto ya existe"
            estado= 0
        # elif not re.match("^[a-zA-Z0-9]+$", nombre):
        #     mensaje= 'El nombre del producto no puede contener caracteres especiales como espacios, guiones, etc.'
        #     estado=0
        else:
            mensaje="Registro de producto éxitoso"
            estado=1
            new_product = Producto(
                prod_Id=int(id),
                prod_Nombre=nombre,
                prod_Precio=precio,
                prod_Cantidad=cantidad,
                prod_Img = imagen_data,
            )
            db.session.add(new_product)
            db.session.commit()
        return render_template('4_registro_prod.html', mensaje=mensaje, estado=estado)

<<<<<<< HEAD

@main_bp.route('/login', methods=['GET','POST'])
def login():
    return render_template('1_login.html')

@main_bp.route('/signUp',methods=['GET','POST'])
def redirigir_registro():
    return render_template('2_sign_up.html')

@main_bp.route('/pagina-principal', methods=['GET','POST'])
def pagina_principal():
    return render_template('3_vista-principal.html')

@main_bp.route('/registro-producto', methods=['GET','POST'])
def registro_producto():
    if request.method == 'GET':  
        return render_template('4_registro_prod.html')

@main_bp.route('/historial-productos', methods=['GET','POST'])
def historial_productos():
    if request.method == "GET":
       
        productos = Producto.query.all()
       
        suma_totales=sum(producto.prod_Total for producto in productos)
        # Formatea la suma total con separadores de miles
        suma_totales_formateada = locale.format_string('%d', round(suma_totales), grouping=True)
        suma_productos='{:n}'.format(round(sum(producto.prod_Cantidad for producto in productos)))

        for producto in productos:
            producto.prod_Img = base64.b64encode(producto.prod_Img).decode('utf-8')
       
            producto.prod_Precio = locale.format_string('%d', round(producto.prod_Precio), grouping=True)
            producto.prod_Total = locale.format_string('%d', round(float(producto.prod_Total)), grouping=True)
       
        return render_template('11_historial_prod.html', productos=productos, suma_totales_formateada=suma_totales_formateada,suma_productos=suma_productos)
=======
>>>>>>> e9c49bec2315c9143c243b3ad3409363372d096b
