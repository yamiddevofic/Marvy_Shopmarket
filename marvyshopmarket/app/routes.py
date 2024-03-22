import base64
import locale
from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session
from flask.views import MethodView
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from .models import Productos, Administrador, Tenderos, Tiendas, VentasHasProductos
from . import bcrypt
from .helpers import obtener_informacion_adm,obtener_informacion_tendero, obtener_informacion_tienda
from app import db
from datetime import datetime

locale.setlocale(locale.LC_ALL, '')
main_bp = Blueprint('main', __name__)

class LoginRequired:
    @staticmethod
    def login_required(func):
        @wraps(func)
        def decorated_function(*args, **kwargs):
            if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
                return func(*args, **kwargs)
            else:
                mensaje = "ERROR: Debes iniciar sesión primero"
                estado = 0
                return render_template('1_login.html', mensaje=mensaje, estado=estado)
        return decorated_function

class IndexView(MethodView):
    def get(self):
        return render_template('0_welcome.html')

class LoginView(MethodView):
    def get(self):
        if self.is_authenticated():
            return self.render_authenticated_user()
        else:
            return self.render_login_page()
  
    def is_authenticated(self):
        return ('adm_Id' in session and 'tienda_Id' in session) or ('tendero_Id' in session and 'tienda_Id' in session)

    def render_authenticated_user(self):
        if 'adm_Id' in session and 'tienda_Id' in session:
            return self.render_admin_page()
        elif 'tendero_Id' in session and 'tienda_Id' in session:
            return self.render_tender_page()
    
    def render_login_page(self):
        return render_template('1_login.html')

    def render_admin_page(self):
        tienda_id = session['tienda_Id']
        adm_id = session['adm_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_adm(tendero_id)
        informacion_adm = obtener_informacion_adm(adm_id)
        perfil = "administrador"
        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda,informacion_tendero=informacion_tendero, informacion_adm=informacion_adm,perfil=perfil)
        
    def render_tender_page(self):
        tienda_id = session['tienda_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_tendero(tendero_id)
        perfil = "tendero"
        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda,informacion_tendero=informacion_tendero, perfil=perfil)


# @main_bp.route('/login', methods=['GET', 'POST'])
# def login():
#     if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
#         if ('adm_Id' in session and 'tienda_Id'in session):
#             tienda_id = session['tienda_Id']
#             adm_id = session['adm_Id']
#             tendero_id= session['tendero_Id']
#             informacion_tienda = obtener_informacion_tienda(tienda_id)
#             informacion_tendero = obtener_informacion_adm(tendero_id)
#             informacion_adm = obtener_informacion_adm(adm_id)
#             perfil="administrador"
#             return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda, informacion_tendero=informacion_tendero, informacion_adm=informacion_adm,perfil=perfil)
#         else:
#             if ('tendero_Id' in session and 'tienda_Id'in session) and not ('adm_Id' in session):
#                 tienda_id = session['tienda_Id']
#                 tendero_id = session['tendero_Id']
#                 informacion_tienda = obtener_informacion_tienda(tienda_id)
#                 informacion_tendero = obtener_informacion_tendero(tendero_id)
#                 perfil="tendero"
#                 return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda, informacion_tendero=informacion_tendero,perfil=perfil)
#     else:
#         return render_template('1_login.html')
        

@main_bp.route('/registro-exitoso', methods=['GET', 'POST'])
def login_dos():
    mensaje = "Registro éxitoso, ahora puedes iniciar sesión"
    estado = 2
    return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/signUp', methods=['GET', 'POST'])
def redirigir_registro():
    return render_template('2_sign_up.html')

@main_bp.route('/pagina-principal', methods=['GET'])
def pagina_principal():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        if ('adm_Id' in session and 'tienda_Id'in session):
            tienda_id = session['tienda_Id']
            adm_id = session['adm_Id']
            tendero_id= session['tendero_Id']
            informacion_tienda = obtener_informacion_tienda(tienda_id)
            informacion_tendero = obtener_informacion_adm(tendero_id)
            informacion_adm = obtener_informacion_adm(adm_id)
            perfil="administrador"
            return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda, informacion_tendero=informacion_tendero, informacion_adm=informacion_adm,perfil=perfil)
        elif ('tendero_Id' in session and 'tienda_Id'in session) and not ('adm_Id' in session):
            tienda_id = session['tienda_Id']
            tendero_id = session['tendero_Id']
            informacion_tienda = obtener_informacion_tienda(tienda_id)
            informacion_tendero = obtener_informacion_tendero(tendero_id)
            perfil="tendero"
            return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda, informacion_tendero=informacion_tendero,perfil=perfil)
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)


@main_bp.route('/registro-suministro', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def registro_suministro():
    if request.method == 'GET':
        if ('adm_Id' in session and 'tienda_Id'in session):
            return render_template('5_registro_suministro.html')
        else:
            mensaje="Debes iniciar sesión primero"
            estado=0
            return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/registro-producto', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def registro_producto():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        if request.method == 'GET':
            return render_template('4_registro_producto.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/registro-ventas', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def registro_ventas():
    if request.method == 'GET':
        if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
            return render_template('6_registro_ventas.html')
        else:
            mensaje="Debes iniciar sesión primero"
            estado=0
            return render_template('1_login.html', mensaje=mensaje, estado=estado)
    if request.method == 'POST':
        if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
            # cantidad= request.form['cantidad-producto-vendido']
            # fecha= datetime.now()
            # print(fecha)
            # tienda_id = session['tienda_Id']
            # tendero_id = session['tendero_Id']
            venta_Id=request.form=['id-registro-venta']
            producto_Id= request.form=['id-producto-venta']
            new_Venta= VentasHasProductos(
                venta_Id = venta_Id,
                producto_Id = producto_Id
            )
            db.session.add(new_Venta)
            db.session.commit()
        else:
            mensaje="Debes iniciar sesión primero"
            estado=0
            return render_template('1_login.html', mensaje=mensaje, estado=estado)
        

@main_bp.route('/generar-informe', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def generar_informe():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('9_generar-informe.html')    
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)
    
@main_bp.route('/ajustes-generales', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def ajustes_generales():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('13_ajustes-generales.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)
    
@main_bp.route('/ajustes-cuenta', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def ajustes_cuenta():
    if request.method == 'GET':
        if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
            return render_template('14_ajustes-cuenta.html')
        else:
            mensaje="Debes iniciar sesión primero"
            estado=0
            return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/ajuste-apariencia', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def ajuste_apariencia():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('15_ajuste-apariencia.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)
@main_bp.route('/ajustes-perfil', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def ajustes_perfil():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('16_ajustes-perfil.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/cerrar-sesion', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def logout():
    if 'tienda_Id' in session or 'adm_Id' in session:
        session.pop('tienda_Id', None)
        session.pop('adm_Id', None)
        return render_template('17_cerrar-sesion.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/registro-tendero', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def registro_tendero():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('18_registro-tendero.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/nuevo_tendero', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def nuevo_tendero():
    if request.method == 'POST':
        id = request.form['id-tendero']
        nombre = request.form['nom-tendero']
        correo = request.form['correo-tendero']
        celular = request.form['celular-tendero']
        try:
            password = bcrypt.generate_password_hash(request.form['password-tendero']).decode('utf-8')
        except:
            estado = 0
            mensaje = "Por favor complete todos los campos"
            return render_template('18_registro-tendero.html', estado=estado, mensaje=mensaje)
        tienda_id = session['tienda_Id']

        existing_user = Tenderos.query.filter(and_(Tenderos.tendero_Id == int(id), Tenderos.tienda_Id == tienda_id)).first()
        if existing_user:
            mensaje = "El usuario ya existe"
            estado = 0
            return render_template('18_registro-tendero.html', mensaje=mensaje, estado=estado)
        else:
            tendero = Tenderos (id=int(id), nombre=nombre, correo=correo, celular=celular, password=password, tienda=tienda_id)
            db.session.add(tendero)
            db.session.commit()
            mensaje = "Registro éxitoso"
            estado = 1
            return render_template('18_registro-tendero.html', mensaje=mensaje, estado=estado)

@main_bp.route('/nuevo_producto', methods=['POST'])
@staticmethod
@LoginRequired.login_required
def nuevo_producto():
    if request.method == 'POST':
        id = request.form['prod_Id']
        nombre = request.form['prod_Nombre']
        precio = request.form['prod_Precio']
        cantidad = request.form['prod_Cantidad']
        ganancia = request.form['prod_Ganancia']
        imagen = request.files['prod_Img']
        imagen_data = imagen.read()
        tienda_id = session['tienda_Id']

        nombre_min = nombre.lower()
        producto_existente = Productos.query.filter(and_(Productos.prod_Id == int(id), Productos.tienda_Id == tienda_id)).first()

        if not id or not nombre or not precio or not cantidad or not imagen:
            mensaje = "Complete todos los datos"
            estado = 0
        elif producto_existente:
            mensaje = "Este producto ya existe en esta tienda"
            estado = 0
        else:
            adm_id = session['adm_Id']
            mensaje = "Registro de producto exitoso"
            estado = 1
            new_product = Productos(
                prod_Id=int(id),
                prod_Nombre=nombre,
                prod_Precio=precio,
                prod_Ganancia= ganancia,
                prod_Cantidad=cantidad,
                prod_Img=imagen_data,
                tienda_Id=tienda_id,
                tendero_Id=adm_id
            )

            db.session.add(new_product)
            db.session.commit()
        return render_template('4_registro_producto.html', mensaje=mensaje, estado=estado)

@main_bp.route('/historial-productos', methods=['GET', 'POST'])
@staticmethod
@LoginRequired.login_required
def historial_productos():
    if request.method == "GET":
        if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
            tienda_id = session['tienda_Id']
            try:
                resultado = db.session.query(Productos, Tiendas).join(Tiendas, Productos.tienda_Id == Tiendas.tienda_Id).all()
                productos_filtrados = [(producto, tienda) for producto, tienda in resultado if producto.tienda_Id == tienda_id]

                productos_codificados = []
                tienda_info = []

                for producto, tienda in productos_filtrados:
                    if producto.prod_Img:
                        img_codificada = base64.b64encode(producto.prod_Img).decode('utf-8')
                        productos_codificados.append((producto, img_codificada))
                    if producto.prod_Precio:
                        producto.prod_Precio= "{:,}".format(int(producto.prod_Precio))
                    if producto.prod_TotalPrecio:
                        producto.prod_TotalPrecio= "{:,}".format(int(producto.prod_TotalPrecio))
                    if producto.prod_Total:
                        producto.prod_Total= "{:,}".format(int(producto.prod_Total))
                    if producto.prod_Ganancia:
                        producto.prod_Ganancia= int(producto.prod_Ganancia)
                    if producto.prod_TotalGana:
                        producto.prod_TotalGana= "{:,}".format(int(producto.prod_TotalGana))
                    else:
                        productos_codificados.append((producto, None))
                    tienda_info.append(tienda)
                return render_template('11_historial_prod.html', resultado=productos_codificados, tienda_info=tienda_info)
            except:
                return render_template('11_historial_prod.html')
        else:
            mensaje="Debes iniciar sesión primero"
            estado=0
            return render_template('1_login.html', mensaje=mensaje, estado=estado)
        
@main_bp.route('/nuevo_usuario', methods=['POST'])
def nuevo_usuario():
    if request.method == 'POST':
        userid = request.form['userid']
        username = request.form['username']
        userphone = request.form['userphone']
        useremail = request.form['useremail']
        try:
            userpassword = bcrypt.generate_password_hash(request.form['userpassword']).decode('utf-8')
        except:
            estado = 0
            mensaje = "Por favor complete todos los campos"
            return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)

        tienda_id = request.form['tiendaid']
        tienda_nombre = request.form['tiendaname']
        tienda_tel = request.form['tiendaphone']
        tienda_email = request.form['tiendaemail']
        tienda_ubicacion = request.form['tiendaubicacion']

        if not userid or not username or not useremail or not userpassword or not userphone or not tienda_id or not tienda_nombre or not tienda_tel or not tienda_email or not tienda_ubicacion:
            estado = 0
            mensaje = "Por favor complete todos los campos"
            return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)

        if 'tienda_img' not in request.files:
            estado = 0
            mensaje = f"No se ha proporcionado ninguna imagen"
            return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)

        tienda_img = request.files['tienda_img']

        if tienda_img.filename == '':
            estado = 0
            mensaje = "No se ha seleccionado ningún archivo"
            return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)

        tienda_data = tienda_img.read()

        num_adm = Administrador.query.count()
        num_tiendas = Tiendas.query.count()
        existing_user = Administrador.query.filter_by(adm_Id=userid).first()
        existing_shop = Tiendas.query.filter_by(tienda_Id=tienda_id).first()

        if num_adm > 0 and num_tiendas > 0:
            mensaje = f"Sólo puedes registrar una tienda y un administrador"
            estado = 0
            return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)
        else:
            if not existing_shop and not existing_user:
                new_shop = Tiendas(
                    tienda_Id=tienda_id,
                    tienda_Nombre=tienda_nombre,
                    tienda_Correo=tienda_email,
                    tienda_Celular=tienda_tel,
                    tienda_Ubicacion=tienda_ubicacion,
                    tienda_IMG=tienda_data
                )
                db.session.add(new_shop)
                db.session.commit()
                new_user = Administrador(
                    adm_Id=userid,
                    adm_Nombre=username,
                    adm_Correo=useremail,
                    adm_Celular=userphone,
                    adm_Password=userpassword,
                    tienda_Id=tienda_id
                )
                db.session.add(new_user)
                db.session.commit()
                new_tendero = Tenderos(
                    tendero_Id=userid,
                    tendero_Nombre=username,
                    tendero_Correo=useremail,
                    tendero_Celular=userphone,
                    tendero_Password=userpassword,
                    tienda_Id=tienda_id
                )
                db.session.add(new_tendero)
                db.session.commit()
                estado = 1
                mensaje = "Registro exitoso"
                return render_template('2_sign_up.html', estado=estado, mensaje=mensaje)
            else:
                estado = 0
                mensaje = f"Ya existe una tienda y administrador con la identificación {tienda_id}"
                return render_template('2_sign_up.html', mensaje=mensaje, estado=estado)

@main_bp.route('/verificar-usuario', methods=['GET', 'POST'])
def verificar_usuario():
    mensaje = None
    if request.method == 'POST':
        userid = (request.form['userid'])
        password = request.form['password']
        if userid == '':
            userid = 0
        try:
            administrador = Administrador.query.filter_by(adm_Id=int(userid)).first()
            tendero = Tenderos.query.filter_by(tendero_Id=int(userid)).first()
            if administrador:
                if bcrypt.check_password_hash(administrador.adm_Password, password):
                    estado = 1
                    session['tienda_Id'] = tendero.tienda_Id
                    session['adm_Id'] = administrador.adm_Id
                    session['tendero_Id'] = tendero.tendero_Id
                    mensaje = "Autenticación exitosa"
                    return redirect(url_for('main.pagina_principal', mensaje=mensaje))
                else:
                    estado = 0
                    mensaje = "Contraseña incorrecta"
            else:
                if tendero:
                    if bcrypt.check_password_hash(tendero.tendero_Password, password):
                        estado = 1
                        session['tienda_Id'] = tendero.tienda_Id
                        session['tendero_Id'] = tendero.tendero_Id
                        mensaje = "Autenticación exitosa"
                        return redirect(url_for('main.pagina_principal'))
                    else:
                        estado = 0
                        mensaje = "Contraseña incorrecta"
                else:
                    mensaje = "Usuario no encontrado"
                    estado = 0
            return render_template('1_login.html', estado=estado, mensaje=mensaje)
        except Exception as e:
            print(e)
            mensaje = f"Error: {e}"
            estado = 0
            return render_template('1_login.html', estado=estado, mensaje=mensaje)

# Se registran las rutas con las clases correspondientes
main_bp.add_url_rule('/', view_func=IndexView.as_view('index'))

main_bp.add_url_rule('/login', view_func=LoginView.as_view('login'))