import re
from flask import Blueprint, render_template, request, redirect,url_for,render_template_string, session
from sqlalchemy.exc import IntegrityError
 
# Importa los modelos necesarios desde el archivo models.py
from .models import Productos, Tenderos, Tiendas

from app import db
import base64
import locale
from . import bcrypt
from .helpers import obtener_informacion_perfil, obtener_informacion_tienda

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
    # Recupera la información del perfil del usuario desde la sesión
    tendero = obtener_informacion_perfil(session.get('userid'))
    imagen = obtener_informacion_tienda(session.get('userid'))
    return render_template('3_vista-principal.html', tendero=tendero)
    
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
    
@main_bp.route('/ajuste-apariencia', methods=['GET','POST'])
def ajuste_apariencia():
    return render_template('15_ajuste-apariencia.html')

@main_bp.route('/ajustes-perfil', methods=['GET','POST'])
def ajustes_perfil():
    return render_template('16_ajustes-perfil.html')


@main_bp.route('/registro-tendero', methods=['GET','POST'])
def registro_tendero():
    return render_template('18_registro-tendero.html')






@main_bp.route('/historial-productos', methods=['GET','POST'])
def historial_productos():
    if request.method == "GET":
       
        productos = Productos.query.all()
       
        suma_totales=sum(producto.prod_Total for producto in productos)
        # Formatea la suma total con separadores de miles
        suma_totales_formateada = locale.format_string('%d', round(suma_totales), grouping=True)
        suma_productos='{:n}'.format(round(sum(producto.prod_Cantidad for producto in productos)))

        for producto in productos:
            producto.prod_Img = base64.b64encode(producto.prod_Img).decode('utf-8')
       
            producto.prod_Precio = locale.format_string('%d', round(producto.prod_Precio), grouping=True)
            producto.prod_Total = locale.format_string('%d', round(float(producto.prod_Total)), grouping=True)
       
        return render_template('11_historial_prod.html', productos=productos, suma_totales_formateada=suma_totales_formateada,suma_productos=suma_productos)

@main_bp.route('/nuevo_usuario', methods=['POST'])
def nuevo_usuario():
    if request.method=='POST':
        userid= request.form['userid']
        username = request.form['username']
        userphone= request.form['userphone']
        useremail= request.form['useremail']
        try:
            userpassword= bcrypt.generate_password_hash(request.form['userpassword']).decode('utf-8')
            tiendapassword= bcrypt.generate_password_hash(request.form['tiendapassword']).decode('utf-8')
        except:
            estado=0
            mensaje="Por favor complete todos los campos"
            return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)
        
        tienda_id= request.form['tiendaid']
        tienda_nombre= request.form['tiendaname']
        tienda_tel= request.form['tiendaphone']
        tienda_email= request.form['tiendaemail']
        tienda_ubicacion= request.form['tiendaubicacion']
        if not userid or not username or not useremail or not userpassword or not userphone or not tienda_id or not tienda_nombre or not tiendapassword or not tienda_tel or not tienda_email or not tienda_ubicacion:
            estado=0
            mensaje="Por favor complete todos los campos"
            return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)
        else:
            # Verificar si la tienda ya existe en la base de datos
            existing_shop = Tiendas.query.filter_by(tienda_Id=tienda_id).first()
            existing_user = Tenderos.query.filter_by(tendero_ID=userid).first()
            if existing_user:
                    mensaje=f"Error, ya existe un usuario con la identificación {userid}" 
                    estado=0; 
                    return render_template('2_sign_up.html',estado=estado,mensaje=mensaje)
            else:
                if existing_shop:
                    new_user= Tenderos(
                            tendero_ID= userid,
                            tendero_Nombre= username,
                            tendero_Correo= useremail,
                            tendero_Celular= userphone,
                            tendero_Password= userpassword,
                            tienda_Id= tienda_id
                    )
                    estado=1
                    mensaje=f"Has sido agregado a la base de datos de la tienda {tienda_nombre} con éxito"
                    db.session.add(new_user)
                    db.session.commit()
                    return render_template('2_sign_up.html', estado=estado,mensaje=mensaje)
                else:
                    new_shop= Tiendas(
                        tienda_Id= tienda_id,
                        tienda_Nombre= tienda_nombre,
                        tienda_Password= tiendapassword,
                        tienda_Correo= tienda_email,
                        tienda_Celular= tienda_tel,
                        tienda_Ubicacion= tienda_ubicacion
                    )
                    db.session.add(new_shop)
                    db.session.commit()

                    new_user= Tenderos(
                        tendero_ID= userid,
                        tendero_Nombre= username,
                        tendero_Correo= useremail,
                        tendero_Celular= userphone,
                        tendero_Password= userpassword,
                        tienda_Id= tienda_id
                    )
                    db.session.add(new_user)
                    db.session.commit()
                    estado=1
                    mensaje="Registro éxitoso"
                    return render_template('2_sign_up.html', estado=estado,mensaje=mensaje)
                
@main_bp.route('/verificar-usuario', methods=['GET', 'POST'])
def verificar_usuario():
    mensaje = None
    if request.method == 'POST':
        userid = request.form['userid']
        password = request.form['password']  # Obtener la contraseña ingresada por el usuario

        # Obtener el tendero de la base de datos
        tendero = Tenderos.query.filter_by(tendero_ID=userid).first()
        
        if tendero:
            # Verificar si la contraseña ingresada coincide con la contraseña almacenada en la base de datos
            if bcrypt.check_password_hash(tendero.tendero_Password, password):
                # Autenticación exitosa
                estado=1
                # Si el tendero existe y la contraseña coincide, iniciar sesión
                imagen_tienda = db.session.query(Tiendas.tienda_IMG).join(Tenderos).filter(Tenderos.tendero_ID == userid).first()
                for image in imagen_tienda:
                    image.tienda_IMG = base64.b64encode(image.prod_Img).decode('utf-8')
                session['userid'] = tendero.tendero_ID
                session['imagen_Tienda']= imagen_tienda.tienda_IMG
                mensaje = "Autenticación exitosa"
                return redirect(url_for('main.pagina_principal'))
            else:
                estado=0
                mensaje = "Autenticación incorrecta"
        else:
            estado=0
            mensaje = "Usuario no encontrado"
    
    return render_template('1_login.html',estado=estado, mensaje=mensaje)
           
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
        id_exist = Productos.query.filter_by(prod_Id=id).first()

        nombre_exist = Productos.query.filter(db.func.lower(Productos.prod_Nombre) == nombre_min).first()
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
            new_product = Productos(
                prod_Id=int(id),
                prod_Nombre=nombre,
                prod_Precio=precio,
                prod_Cantidad=cantidad,
                prod_Img = imagen_data,
            )
            db.session.add(new_product)
            db.session.commit()
        return render_template('4_registro_prod.html', mensaje=mensaje, estado=estado)

