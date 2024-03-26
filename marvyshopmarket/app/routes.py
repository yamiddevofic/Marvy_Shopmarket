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

class AuthenticatedView(MethodView):
    def esta_autenticado(self):
        return ('adm_Id' in session and 'tienda_Id' in session) or ('tendero_Id' in session and 'tienda_Id' in session)

    def renderizar_login(self):
        mensaje = "Debes iniciar sesión primero"
        estado = 0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)


class IndexView(MethodView):
    def get(self):
        return render_template('0_welcome.html')

class LoginView(MethodView):
    def get(self):
        if self.esta_autenticado():
            return self.renderizar_user_autenticado()
        else:
            return self.renderizar_login()
  
    def esta_autenticado(self):
        return ('adm_Id' in session and 'tienda_Id' in session) or ('tendero_Id' in session and 'tienda_Id' in session)

    def renderizar_user_autenticado(self):
        if 'adm_Id' in session and 'tienda_Id' in session:
            return self.renderizar_admin()
        elif 'tendero_Id' in session and 'tienda_Id' in session:
            return self.renderizar_tendero()
    
    def renderizar_login(self):
        return render_template('1_login.html')

    def renderizar_admin(self):
        tienda_id = session['tienda_Id']
        adm_id = session['adm_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_adm(tendero_id)
        informacion_adm = obtener_informacion_adm(adm_id)
        perfil = "administrador"
        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda,informacion_tendero=informacion_tendero, informacion_adm=informacion_adm,perfil=perfil)
        
    def renderizar_tendero(self):
        tienda_id = session['tienda_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_tendero(tendero_id)
        perfil = "tendero"
        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda,informacion_tendero=informacion_tendero, perfil=perfil)     

class RegistroExitosoView(MethodView):
    def get(self):
        mensaje = "Registro éxitoso, ahora puedes iniciar sesión"
        estado = 2
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

class SignUpView(MethodView):
    def get(self):
        return render_template('2_sign_up.html')

class PaginaPrincipalView(AuthenticatedView,MethodView):
    def get(self, state="",productos=""):
        if self.esta_autenticado():
            return self.renderizar_principal(state,productos)
        else:
            return self.renderizar_login()

    def renderizar_principal(self,state,productos):
        if 'adm_Id' in session and 'tienda_Id' in session:
            return self.renderizar_admin(state,productos)
        elif 'tendero_Id' in session and 'tienda_Id' in session:
            return self.renderizar_tendero(state,productos)

    def renderizar_admin(self,state, productos):
        tienda_id = session['tienda_Id']
        adm_id = session['adm_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_adm(tendero_id)
        informacion_adm = obtener_informacion_adm(adm_id)
        perfil = "administrador"
        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda, informacion_tendero=informacion_tendero, informacion_adm=informacion_adm,perfil=perfil,state=state,productos=productos)

    def renderizar_tendero(self, state,productos):
        tienda_id = session['tienda_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_tendero(tendero_id)
        perfil = "tendero"
        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda, informacion_tendero=informacion_tendero, perfil=perfil,state=state,productos=productos)
    
class RegistroSuministroView(AuthenticatedView,MethodView):    
    @LoginRequired.login_required
    def get(self):
        if self.esta_autenticado():
            return self.renderizar_suministro()
        else:
            return self.renderizar_login()
        
    def renderizar_suministro(self):
        return render_template('5_registro_suministro.html')

class RegistroProductoView(AuthenticatedView):
    def __init__(self, tienda_id=None):
        self.tienda_id = tienda_id

    @LoginRequired.login_required
    def get(self, estado='', mensaje=""):
        self.tienda_id = session.get('tienda_Id')
        if self.esta_autenticado():
            return self.renderizar_producto(estado, mensaje)
        else:
            return self.renderizar_login()

    @LoginRequired.login_required
    def post(self):
        try:
            if self.registrar_producto()['state']:
                return self.get(estado=1, mensaje="Registro exitoso") 
            else:
                return self.get(estado=0, mensaje=self.registrar_producto()['message'])
        except Exception as e:
            return self.get(estado=0, mensaje=f"Ha ocurrido un error: {str(e)}")

    def registrar_producto(self):
        id = request.form['prod_Id']
        nombre = request.form['prod_Nombre']
        precio = request.form['prod_Precio']
        cantidad = request.form['prod_Cantidad']
        ganancia = request.form['prod_Ganancia']
        imagen = request.files['prod_Img']
        imagen_data = imagen.read()
        tienda_id = session['tienda_Id']
        if id=='':
            id=0
        nombre_min = nombre.lower()
        producto_existente = Productos.query.filter(and_(Productos.prod_Id == int(id), Productos.tienda_Id == tienda_id)).first()

        if not id or not nombre or not precio or not cantidad or not imagen:
            return {'state':False, 'message':'Por favor, complete todos los datos'}  
        elif producto_existente:
            return {'state':False, 'message':'Ya existe un producto con esa identificación'} 
        else:
            adm_id = session['adm_Id']
            new_product = Productos(producto_id=int(id), nombre=nombre, precio=precio, ganancia=ganancia, cantidad=cantidad, imagen=imagen_data, tienda=tienda_id, tendero=adm_id)

            db.session.add(new_product)
            db.session.commit()
            return {'state':True, 'message':'Registro exitoso'}

    def renderizar_producto(self, estado, mensaje):
        tienda_id = self.tienda_id
        resultado = db.session.query(Productos, Tiendas).join(Tiendas, Productos.tienda_Id == Tiendas.tienda_Id).all()
        productos_codificados = []
        tienda_info = []
        ganancias = []

        for producto, tienda in resultado:
            if producto.tienda_Id == tienda_id:
                if producto.prod_Img:
                    img_codificada = base64.b64encode(producto.prod_Img).decode('utf-8')
                    productos_codificados.append((producto, img_codificada))
                if producto.prod_Precio:
                    precio = producto.prod_Precio
                    producto.prod_Precio = "{:,}".format(int(producto.prod_Precio))
                if producto.prod_Ganancia:
                    ganancia = producto.prod_Ganancia
                    producto.prod_Ganancia = int(producto.prod_Ganancia)
                if producto.prod_TotalPrecio:
                    preciototal = producto.prod_TotalPrecio
                    producto.prod_TotalPrecio = "{:,}".format(int(producto.prod_TotalPrecio))
                if producto.prod_Total:
                    totalbruto = producto.prod_Total
                    producto.prod_Total = "{:,}".format(int(producto.prod_Total))
                if producto.prod_TotalGana:
                    totalgana= producto.prod_TotalGana
                    producto.prod_TotalGana = "{:,}".format(int(producto.prod_TotalGana))
                gana = "{:,}".format(int(totalgana-totalbruto))
                
                ganancias.append(gana)
                tienda_info.append(tienda)


        return render_template('11_historial_prod.html', resultado=productos_codificados, tienda_info=tienda_info, ganancias=ganancias, mensaje=mensaje, estado=estado)

class EditarProducto(RegistroProductoView,AuthenticatedView):
    @LoginRequired.login_required
    def get(self, producto_id):
        # Aquí puedes hacer lo que necesites con el ID del producto
        # Por ejemplo, cargar los detalles del producto con el ID proporcionado
        product = Productos.query.filter_by(prod_Id=producto_id).first()
        img_codificada = base64.b64encode(product.prod_Img).decode('utf-8')
        return render_template('editar_prod.html', producto=product, imagen=img_codificada)

    @LoginRequired.login_required
    def post(self, producto_id):
        # Buscar el producto en la base de datos
        producto = Productos.query.filter_by(Id=producto_id).first()
        
        if producto:
            # Obtener los datos del formulario HTML
            nuevo_nombre = request.form.get('nombre-prod')
            nuevo_precio = request.form.get('precio-prod')
            nueva_cantidad = request.form.get('cantidad-prod')
            nueva_ganancia = request.form.get('ganancia-prod')
            
            # Verificar si se proporcionaron nuevos datos y actualizar solo esos campos
            if nuevo_nombre:
                producto.prod_Nombre = nuevo_nombre
            if nuevo_precio:
                producto.prod_Precio = nuevo_precio
            if nueva_cantidad:
                producto.prod_Cantidad = nueva_cantidad
            if nueva_ganancia:
                producto.prod_Ganancia = nueva_ganancia
            
            # Guardar los cambios en la base de datos
            db.session.commit()
            
            return super().get(estado=1,mensaje="Actualizaste un producto exitosamente")
        else:
            return super().get(estado=1,mensaje="El producto no se encontró en la base de datos")
class EliminarProducto(RegistroProductoView,AuthenticatedView):
    @LoginRequired.login_required
    def get(self,id):
        producto = Productos.query.filter_by(Id=id).first()
        if producto:
            db.session.delete(producto)
            db.session.commit()
            return super().get( estado=1,mensaje="Eliminaste un producto exitosamente")
        else:
            return super().get(estado=0,mensaje="No se pudo eliminar el producto")
        


class RegistroVentaView(AuthenticatedView, MethodView):
     try:
        @LoginRequired.login_required
        def get(self):
            if self.esta_autenticado():
                return self.renderizar_venta(estado="",mensaje="")
            else:
                return self.renderizar_login()
        def post(self):
            if self.registrar_venta():
                pass
            else:
                pass
        def registrar_venta(self):
            producto = request.form.get('id-producto-venta')
            nombre = request.form.get('nombre-producto-venta')
            precio  = request.form.get('precio-producto-venta')
            cantidad = request.form.get('cantidad-producto-vendido')
        def renderizar_venta(self,estado,mensaje):
            return render_template('6_registro_ventas.html', estado=estado, mensaje=mensaje)
     except Exception as e:
        print("Error: "+e)
class Buscar(PaginaPrincipalView):
    def get(self,state='', resultados=''):
         print("Entré a get")
         return self.renderizar_principal_2(state,resultados)

    def renderizar_principal_2(self, state, resultados):
        return super().renderizar_principal(state=state,productos=resultados)

    def post(self):
        state= 1
        resultados = {}
        return self.get(state,resultados)

class Resultado(Buscar,PaginaPrincipalView):
    def get(self,state='', resultados=''):
         print("Entré a get")
         return super().renderizar_principal(state=state,productos=resultados)

    def post(self):
        texto = request.form['texto_busqueda']
        resultados = Productos.query.filter(Productos.prod_Nombre.ilike(f'%{texto}%')).all()
        if not resultados:
            resultados = [{"prod_Nombre":"Ninguno","prod_Precio":0,"prod_Cantidad":0}]
            return super().renderizar_principal_2(state=1,resultados=resultados)
        else:
            return super().renderizar_principal_2(state=1,resultados=resultados)
        
        

# @usuario_bp.route('/home',methods=['GET','POST'])
# def home():
#     if 'user_Id' in session:
#         user_id= session['user_Id']
#         info_user= obtener_user(user_id)
#         datos = obtener_egreso(user_id)
#         datosDos= obtener_ingreso(user_id)
#         datosTres= obtener_compra(user_id)
#         total_egresos_query = db.session.query(Vista_total_egresos).first()
#         total_egresos = total_egresos_query.total_egresos if total_egresos_query else 0

#         #"{:,}".format(int(db.session.query(Vista_total_egresos).first().total_egresos))
#         total_ingresos_query = db.session.query(Vista_total_ingresos).first()
#         total_ingresos = total_ingresos_query.total_ingresos if total_ingresos_query else 0

#         #"{:,}".format(int(db.session.query(Vista_total_ingresos).first().total_ingresos))
        
            
#         presupuesto = "{:,}".format(int(total_ingresos-total_egresos))
        
#         # Verificar si hay datos disponibles, si no, enviar listas vacías
#         if not datos:
#             datos = []
#         if not datosDos:
#             datosDos = []
#         if not datosTres:
#             datosTres = []
        
    

#         return render_template('3_home.html',user=info_user, egresos=datos, ingresos=datosDos, compras=datosTres,  total_egresos=total_egresos, total_ingresos=total_ingresos, presupuesto=presupuesto)
#     else:
#         estado=False
#         mensaje="Primero debes iniciar sesión"
#         return render_template('1_login.html',estado=estado, mensaje=mensaje)
    
# @usuario_bp.route('/home/<user>',methods=['GET','POST'])
# def homeDos(user):
#         info_user= obtener_user(user)
#         return render_template('3_home.html',user=info_user)

# @LoginRequired.login_required
# def registro_ventas():
#     if request.method == 'GET':
#         if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
#             return render_template('6_registro_ventas.html')
#         else:
#             mensaje="Debes iniciar sesión primero"
#             estado=0
#             return render_template('1_login.html', mensaje=mensaje, estado=estado)
#     if request.method == 'POST':
#         if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
#             # cantidad= request.form['cantidad-producto-vendido']
#             # fecha= datetime.now()
#             # print(fecha)
#             # tienda_id = session['tienda_Id']
#             # tendero_id = session['tendero_Id']
#             venta_Id=request.form=['id-registro-venta']
#             producto_Id= request.form=['id-producto-venta']
#             new_Venta= VentasHasProductos(
#                 venta_Id = venta_Id,
#                 producto_Id = producto_Id
#             )
#             db.session.add(new_Venta)
#             db.session.commit()
#         else:
#             mensaje="Debes iniciar sesión primero"
#             estado=0
#             return render_template('1_login.html', mensaje=mensaje, estado=estado)
        

@main_bp.route('/generar-informe', methods=['GET', 'POST'])

@LoginRequired.login_required
def generar_informe():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('9_generar-informe.html')    
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/ajustes-generales', methods=['GET', 'POST'])

@LoginRequired.login_required
def ajustes_generales():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('13_ajustes-generales.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)
    
@main_bp.route('/ajustes-cuenta', methods=['GET', 'POST'])

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

@LoginRequired.login_required
def ajuste_apariencia():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('15_ajuste-apariencia.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)
@main_bp.route('/ajustes-perfil', methods=['GET', 'POST'])

@LoginRequired.login_required
def ajustes_perfil():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('16_ajustes-perfil.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/cerrar-sesion', methods=['GET', 'POST'])

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

@LoginRequired.login_required
def registro_tendero():
    if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
        return render_template('18_registro-tendero.html')
    else:
        mensaje="Debes iniciar sesión primero"
        estado=0
        return render_template('1_login.html', mensaje=mensaje, estado=estado)

@main_bp.route('/nuevo_tendero', methods=['GET', 'POST'])

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

# @main_bp.route('/historial-productos', methods=['GET', 'POST'])

# @LoginRequired.login_required
# def historial_productos():
#     if request.method == "GET":
#         if ('adm_Id' in session and 'tienda_Id'in session) or ('tendero_Id' in session and 'tienda_Id' in session):
#             tienda_id = session['tienda_Id']
#             try:
#                 resultado = db.session.query(Productos, Tiendas).join(Tiendas, Productos.tienda_Id == Tiendas.tienda_Id).all()
#                 productos_filtrados = [(producto, tienda) for producto, tienda in resultado if producto.tienda_Id == tienda_id]

#                 productos_codificados = []
#                 tienda_info = []

#                 for producto, tienda in productos_filtrados:
#                     if producto.prod_Img:
#                         img_codificada = base64.b64encode(producto.prod_Img).decode('utf-8')
#                         productos_codificados.append((producto, img_codificada))
#                     if producto.prod_Precio:
#                         producto.prod_Precio= "{:,}".format(int(producto.prod_Precio))
#                     if producto.prod_TotalPrecio:
#                         producto.prod_TotalPrecio= "{:,}".format(int(producto.prod_TotalPrecio))
#                     if producto.prod_Total:
#                         producto.prod_Total= "{:,}".format(int(producto.prod_Total))
#                     if producto.prod_Ganancia:
#                         producto.prod_Ganancia= int(producto.prod_Ganancia)
#                     if producto.prod_TotalGana:
#                         producto.prod_TotalGana= "{:,}".format(int(producto.prod_TotalGana))
#                     else:
#                         productos_codificados.append((producto, None))
#                     tienda_info.append(tienda)
#                 return render_template('11_historial_prod.html', resultado=productos_codificados, tienda_info=tienda_info)
#             except:
#                 return render_template('11_historial_prod.html')
#         else:
#             mensaje="Debes iniciar sesión primero"
#             estado=0
#             return render_template('1_login.html', mensaje=mensaje, estado=estado)
        
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
                    id=tienda_id,
                    nombre=tienda_nombre,
                    correo=tienda_email,
                    celular=tienda_tel,
                    ubicacion=tienda_ubicacion,
                    imagen=tienda_data
                )
                db.session.add(new_shop)
                db.session.commit()
                new_user = Administrador(
                    id=userid,
                    nombre=username,
                    correo=useremail,
                    celular=userphone,
                    password=userpassword,
                    tienda=tienda_id
                )
                db.session.add(new_user)
                db.session.commit()
                new_tendero = Tenderos(
                    id=userid,
                    nombre=username,
                    correo=useremail,
                    celular=userphone,
                    password=userpassword,
                    tienda=tienda_id
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
                    return redirect(url_for('main.home', mensaje=mensaje))
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
                        return redirect(url_for('main.home'))
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
main_bp.add_url_rule('/registro-exitoso', view_func=RegistroExitosoView.as_view('registro_exitoso'))
main_bp.add_url_rule('/signUp', view_func=SignUpView.as_view('sign_up'))
main_bp.add_url_rule('/home', view_func=PaginaPrincipalView.as_view('home'))
main_bp.add_url_rule('/suministros', view_func= RegistroSuministroView.as_view('suministros'))
main_bp.add_url_rule('/productos', view_func= RegistroProductoView.as_view('productos'))
main_bp.add_url_rule('/ventas', view_func= RegistroVentaView.as_view('ventas'))
main_bp.add_url_rule('/editar-producto/<int:producto_id>', view_func=EditarProducto.as_view('editar-producto'))
main_bp.add_url_rule('/eliminar-producto/<int:id>', view_func=EliminarProducto.as_view('eliminar-producto'))
main_bp.add_url_rule('/buscar', view_func=Buscar.as_view('buscar'))
main_bp.add_url_rule('/resultado', view_func=Resultado.as_view('resultado'))
