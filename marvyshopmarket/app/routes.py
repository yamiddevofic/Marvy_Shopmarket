import base64
import os
import locale
import traceback
import logging
import json
import socket
from threading import Thread
from functools import wraps
from flask import Blueprint, render_template, request,send_file,redirect, url_for, jsonify, make_response,session, current_app
from flask.views import MethodView
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from .models import Productos, Administrador, Tenderos, Tiendas, Ventas, VentasHasProductos,Gastos, Suministros, Proveedores
from . import bcrypt
from .helpers import obtener_informacion_adm,obtener_informacion_tendero, obtener_informacion_tienda
from app import db
from datetime import datetime
from .config import SOCKET_HOST, SOCKET_PORT

from flask import render_template, request, redirect, url_for


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
       return render_template('index.html')

class LoginView(AuthenticatedView,MethodView):
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
class FacturaVentas(AuthenticatedView, MethodView):
    @LoginRequired.login_required
    def get(self,vp=[],ventas=[], estado="", mensaje=""):
        print('entré a get en factura')
        if self.esta_autenticado():
            return self.renderizar_factura(vp,ventas,estado, mensaje)
        else:
            return self.renderizar_login()
    def post(self):
        print('entré a post en factura')
        try: 
            tienda_id = int(session['tienda_Id'])
            adm_id = int(session['adm_Id'])
            producto = request.form['producto_venta']
            cantidad = request.form.get('venta_cantidad')
            metodo = request.form.get('venta_metodo')
            fecha = datetime.now()
            
            if not cantidad or not metodo or not producto:
                return {'state': False, 'message': 'Por favor, complete todos los datos'}
            
            info_producto = Productos.query.filter_by(prod_Nombre=producto).all()

            ventaf=[]
                        
            for producto in info_producto:
                new_venta = Ventas(cantidad, metodo, fecha,(float(producto.prod_TotalPrecio) * int(producto.prod_Cantidad)),adm_id,tienda_id)
                
                
                print(producto.prod_Nombre," ",cantidad," ",producto.prod_TotalPrecio," ",str(float(producto.prod_TotalPrecio)*int(cantidad)))

            db.session.add(new_venta)
            db.session.commit()
            
            print(ventaf)  
            
            id_venta = new_venta.venta_Id
            
            nueva_relacion = VentasHasProductos(id_venta,adm_id,tienda_id,producto.Id,adm_id,tienda_id)
            
            db.session.add(nueva_relacion)
            db.session.commit()           
             
            return self.get(vp=nueva_relacion,ventas=ventaf,estado=1, mensaje="Registro de venta exitoso")    
        
        except IntegrityError as e:
            db.session.rollback()
            return {'state': False, 'message': f"Error de integridad referencial: {str(e)}"}
        except Exception as e:
            db.session.rollback()
            return {'state': False, 'message': f"Ha ocurrido un error: {str(e)}"}
            
    def renderizar_factura(self,vp=[],ventas=[],estado='', mensaje=''):
        ventas=db.session.query(Ventas).all()
        vp = VentasHasProductos.query.all()
        print(ventas)
        print(vp)
        return render_template('7_factura.html',ventas_has_productos=vp,ventas= ventas, estado=estado, mensaje=mensaje)
    
class VentaView(AuthenticatedView):
    def __init__(self, ventas=[]):
        self.ventas = ventas

    @LoginRequired.login_required
    def get(self, estado="", mensaje=""):
        if self.esta_autenticado():
            return self.renderizar_venta(estado, mensaje)
        else:
            return self.renderizar_login()
        
    def post(self):
        print("Entré a post de ventas")
        try:
            if self.registrar_venta()['state']:
                return self.get(estado=1, mensaje="Registro de venta exitoso")
            else:
                return self.get(estado=0, mensaje=self.registrar_venta()['message'])
        except Exception as e:
            return self.get(estado=0, mensaje=f"Ha ocurrido un error: {str(e)}")

    def registrar_venta(self):
        try:
            tienda_id = session['tienda_Id']
            producto = request.form['producto_venta']
            cantidad = request.form.get('venta_cantidad')
            metodo = request.form.get('venta_metodo')
            fecha = datetime.now()
            
            if not cantidad or not metodo or not producto:
                return {'state': False, 'message': 'Por favor, complete todos los datos'}
            
            info_producto = Productos.query.filter_by(prod_Nombre=producto).all()
            print(info_producto)
        
            adm_id = int(session['adm_Id'])
            
            new_venta = Ventas(cantidad, metodo, fecha, precio, adm_id, tienda_id)

            db.session.add(new_venta)
            db.session.commit()

            # Obtener el ID de la venta recién creada
            venta_id = new_venta.venta_Id

            # Verificar si el producto existe antes de insertarlo en ventas_has_productos
            producto_existente = Productos.query.filter_by(Id=producto_id).first()
            if producto_existente:

                # Crear una instancia de VentasHasProductos con el ID de la venta
                ventas_has_productos = VentasHasProductos(
                    ventas_venta_Id=venta_id,
                    ventas_tendero_Id=adm_id,
                    ventas_tienda_Id=tienda_id,
                    productos_Id=producto_id,
                    productos_tendero_Id=adm_id,
                    productos_tienda_Id=tienda_id
                )

                db.session.add(ventas_has_productos)
                db.session.commit()

                # Disminuir la cantidad de productos en la tabla Productos
                producto_existente.prod_Cantidad -= int(cantidad)
                db.session.commit()
                return {'state': True, 'message': 'Registro exitoso'}
            else:
                return {'state': False, 'message': 'El producto no existe en la base de datos'}

        except IntegrityError as e:
            db.session.rollback()
            return {'state': False, 'message': f"Error de integridad referencial: {str(e)}"}
        except Exception as e:
            db.session.rollback()
            return {'state': False, 'message': f"Ha ocurrido un error: {str(e)}"}
        
    def guardar_en_json(self, objeto, nombre_archivo):
        with open(nombre_archivo, 'w') as archivo:
            json.dump(objeto, archivo)
        return True        
    
    def renderizar_venta(self, estado, mensaje):
        try:
            tienda_id = session['tienda_Id']
            resultado = db.session.query(Ventas, Productos).join(Productos, Ventas.tienda_Id == Productos.tienda_Id).all()
            datos_relacionados = db.session.query(VentasHasProductos, Productos).join(Productos).all()
            datos_relacionados_dos = db.session.query(VentasHasProductos, Ventas).join(Ventas).all()
            ventas = []  # Aquí almacenaremos las ventas
            tienda_info = []
            total_ventas = 0
            for relacion1, relacion2 in zip(datos_relacionados, datos_relacionados_dos):
                fecha_iso = relacion2.Ventas.venta_Datetime.isoformat()
                total = (int(relacion2.Ventas.venta_Cantidad) * int(relacion1.Productos.prod_Precio))
                total_ventas += total
                obj = {
                    "id": relacion1.VentasHasProductos.ventas_venta_Id,
                    "nombre": relacion1.Productos.prod_Nombre,
                    "cantidad_vendido": relacion2.Ventas.venta_Cantidad,
                    "cantidad_total": relacion1.Productos.prod_Cantidad,
                    "id_producto": relacion1.Productos.Id,
                    "fecha": fecha_iso,
                    "precio": relacion1.Productos.prod_TotalPrecio,
                    "total": total,
                    "total_ventas": total_ventas
                }
                ventas.append(obj)
                self.guardar_en_json( obj,'datos_venta.json')
            if os.path.exists('datos_venta.json') and os.path.getsize('datos_venta.json') > 0:
                with open('datos_venta.json', 'r') as archivo:
                    datos_venta = json.load(archivo)
                
            else:
                datos_venta = {}

            if datos_venta:
                producto_id = datos_venta.get('id_producto')
                cantidad_total = datos_venta.get('cantidad_total')
                cantidad_vendido = datos_venta.get('cantidad_vendido')
                registro_a_modificar = Productos.query.filter_by(Id=producto_id).first()
                print(f"{producto_id} | {cantidad_total} | {cantidad_vendido} | {registro_a_modificar}")

            for venta, tienda in resultado:
                if hasattr(venta, 'venta_Pago') and venta.venta_Pago is not None:
                    venta.venta_Pago = str(venta.venta_Pago).replace(',', '')
                    venta.venta_Pago = int(float(venta.venta_Pago))
                tienda_info.append(tienda)

            return render_template('6_ventas.html', resultado=ventas, tienda_info=tienda_info, mensaje=mensaje, estado=estado)
        except Exception as e:
            print("Error: " + str({e}))
            return render_template('6_ventas.html', estado=0, mensaje=str(e))
        

class PaginaPrincipalView(VentaView,AuthenticatedView, MethodView):
    def __init__(self):
        super().__init__(ventas=[])  # Proporciona una lista vacía como ventas
        self.ventas = []

    def get(self, state="", productos=""):
        if self.esta_autenticado():
            return self.renderizar_principal(state, productos)
        else:
            return self.renderizar_login()

    def renderizar_principal(self, state, productos):
        if 'adm_Id' in session and 'tienda_Id' in session:
            return self.renderizar_admin(state, productos)
        elif 'tendero_Id' in session and 'tienda_Id' in session:
            return self.renderizar_tendero(state, productos)

    def renderizar_admin(self, state, productos):
        tienda_id = session['tienda_Id']
        adm_id = session['adm_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_adm(tendero_id)
        informacion_adm = obtener_informacion_adm(adm_id)
        perfil = "administrador"
        ventas = len(db.session.query(Ventas).all())

        print("Ventas: ",ventas)

        if ventas>0:
            if os.path.exists('datos_venta.json') and os.path.getsize('datos_venta.json') > 0:
                with open('datos_venta.json', 'r') as archivo:
                    datos_venta = json.load(archivo)
                total_ventas = datos_venta.get('total_ventas', {})
            else:
                total_ventas = 0
        else:
            total_ventas = 0

        gastos = len(db.session.query(Gastos).all())

        print("Gastos: ",gastos)
        
        if gastos>0:
            if os.path.exists('datos_gasto.json') and os.path.getsize('datos_gasto.json') > 0:
                with open('datos_gasto.json', 'r') as archivo:
                    datos_gasto = json.load(archivo)
                total_gastos = datos_gasto.get('precio', {})
            else:
                total_gastos = 0
        else:
            total_gastos = 0
        total_neto= total_ventas - total_gastos
        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda,
                               informacion_tendero=informacion_tendero, informacion_adm=informacion_adm,
                               perfil=perfil, state=state, productos=productos, total_ventas=total_ventas, total_gastos=int(total_gastos), total_neto=int(total_neto))

    def renderizar_tendero(self, state, productos):
        tienda_id = session['tienda_Id']
        tendero_id = session['tendero_Id']
        informacion_tienda = obtener_informacion_tienda(tienda_id)
        informacion_tendero = obtener_informacion_tendero(tendero_id)
        perfil = "tendero"

        # Accede al atributo ventas directamente desde la instancia
        ventas = self.ventas
        # Llama al método obtener_total_ventas con la lista de ventas como argumento
        total_ventas = self.obtener_total_ventas(ventas)

        return render_template('3_vista-principal.html', informacion_tienda=informacion_tienda,
                               informacion_tendero=informacion_tendero, perfil=perfil, state=state,
                               productos=productos, total_ventas=total_ventas)
        
class RegistroSuministroView(AuthenticatedView):
    def get(self, estado='', mensaje=""):
        if self.esta_autenticado():
            print("Usuario autenticado")
            return self.renderizar_suministro(estado, mensaje)
        else:
            print("Usuario no autenticado")
            return self.renderizar_login()

    def post(self):
        try:
            print("POST request recibido")
            registro_resultado = self.registrar_suministro()
            if registro_resultado['state']:
                return self.get(estado=1, mensaje="Suministro registrado exitosamente")
            else:
                return self.get(estado=0, mensaje=registro_resultado['message'])
        except Exception as e:
            print(f"Error en POST request: {str(e)}")
            return self.get(estado=0, mensaje=f"Ha ocurrido un error: {str(e)}")

    def esta_autenticado(self):
        return session.get('tienda_Id') is not None

    def registrar_suministro(self):
        try:
            print("Intentando registrar suministro")
            id_registro = request.form['idregistro-suministro']
            cantidad = request.form['cantidad-producto-suministro']
            fecha = request.form['fecha-producto-suministro']
            metodo_pago = request.form['metodo-pago-suministro']
            total = request.form['total-producto-suministro']
            tienda_id = request.form['tienda_id-producto-suministro']
            
            if not id_registro or not cantidad or not fecha or not metodo_pago or not total or not tienda_id:
                return {'state': False, 'message': 'Por favor, complete todos los datos'}

            suministro_existente = Suministros.query.filter_by(sum_Id=id_registro).first()
            if suministro_existente:
                return {'state': False, 'message': 'Ya existe un suministro con esa identificación'}
            else:
                nuevo_suministro = Suministros(sum_Id=id_registro, sum_Cantidad=cantidad, sum_Datetime=fecha, sum_Metodo_pago=metodo_pago, sum_Total=total, tienda_Id=tienda_id)
                db.session.add(nuevo_suministro)
                db.session.commit()
                return {'state': True, 'message': 'Suministro registrado exitosamente'}

        except KeyError as e:
            print(f"Error en registrar_suministro: {str(e)}")
            return {'state': False, 'message': f"Error en el formulario: {str(e)}"}
        except Exception as e:
            print(f"Error en registrar_suministro: {str(e)}")
            return {'state': False, 'message': f"Ha ocurrido un error: {str(e)}"}

    def renderizar_suministro(self, estado, mensaje):
        try:
            suministros_lista = Suministros.query.all()
            return render_template('5_registro_suministro.html', estado=estado, mensaje=mensaje, suministros=suministros_lista)
        except Exception as e:
            print(f"Error al renderizar suministros: {str(e)}")
            return render_template('5_registro_suministro.html', estado=0, mensaje=f"Ha ocurrido un error al obtener los suministros: {str(e)}", suministros=[])

#editar suministro.. 
class EditarSuministro(RegistroSuministroView, AuthenticatedView):
    @LoginRequired.login_required
    def get(self, sum_id):
        try:
            suministro = Suministros.query.filter_by(sum_Id=sum_id).first()
            if suministro:
                return render_template('editar_suministros.html', suministro=suministro)
            else:
                return render_template('editar_suministros.html', mensaje="El suministro no se encontró en la base de datos")
        except Exception as e:
            return render_template('editar_suministros.html', mensaje=f"Error al cargar el suministro: {str(e)}")

    @LoginRequired.login_required
    def post(self, sum_id):
        try:
            suministro = Suministros.query.get(sum_id)
            
            if suministro:
                nueva_cantidad = request.form.get('cantidad-suministro')
                nuevo_fecha = request.form.get('fecha-suministro')
                nuevo_metodo_pago = request.form.get('metodo-pago-suministro')
                nuevo_total = request.form.get('total-suministro')
                
                if nueva_cantidad:
                    suministro.sum_Cantidad = nueva_cantidad
                if nuevo_fecha:
                    suministro.sum_Datetime = nuevo_fecha
                if nuevo_metodo_pago:
                    suministro.sum_Metodo_pago = nuevo_metodo_pago
                if nuevo_total:
                    suministro.sum_Total = nuevo_total
                
                db.session.commit()
                
                return redirect(url_for('main.suministros', estado=1, mensaje="Actualizaste un suministro exitosamente"))
            else:
                return render_template('editar_suministros.html',estado=0, mensaje="El suministro no se encontró en la base de datos")
        except Exception as e:
            return render_template('editar_suministros.html', estado=0, mensaje=f"Error al editar el suministro: {str(e)}")


class RegistroProveedorView(MethodView):
    def get(self, estado='', mensaje=""):
        if self.esta_autenticado():
            print("Usuario autenticado")
            return self.renderizar_proveedor(estado, mensaje)
        else:
            print("Usuario no autenticado")
            return self.renderizar_login()

    def post(self):
        try:
            print("POST request recibido")
            resultado_registro = self.registrar_proveedor()
            if resultado_registro['state']:
                return self.get(estado=1, mensaje="Proveedor registrado exitosamente")
            else:
                return self.get(estado=0, mensaje=resultado_registro['message'])
        except Exception as e:
            print(f"Error en POST request: {str(e)}")
            return self.get(estado=0, mensaje=f"Ha ocurrido un error: {str(e)}")

    def esta_autenticado(self):
        return session.get('tienda_Id') is not None

    def registrar_proveedor(self):
        try:
            print("Intentando registrar proveedor")
            id = request.form.get('id-proveedor')
            nombre = request.form.get('nombre-proveedor')
            ubicacion = request.form.get('ubicacion-proveedor')
            contacto = request.form.get('telefono-proveedor')

            if not id or not nombre or not ubicacion or not contacto:
                return {'state': False, 'message': 'Por favor, complete todos los datos'}

            proveedor_existente = Proveedores.query.filter_by(prov_Id=id).first()
            if proveedor_existente:
                print("Proveedor ya existe")
                return {'state': False, 'message': 'Ya existe un proveedor con ese ID'}
            else:
                print("Intentando registrar proveedor...")
                new_proveedor = Proveedores(id, nombre, ubicacion, contacto)
                db.session.add(new_proveedor)
                db.session.commit()
                print("Proveedor registrado exitosamente")
                return {'state': True, 'message': 'Registro exitoso'}
        except Exception as e:
            print("Error al registrar proveedor:", str(e))
            return {'state': False, 'message': f"Ha ocurrido un error: {str(e)}"}

    def renderizar_proveedor(self, estado, mensaje):
        try:
            proveedores_lista = Proveedores.query.all()
            return render_template('19_registro_proveedores.html', estado=estado, mensaje=mensaje, proveedores=proveedores_lista)
        except Exception as e:
            print(f"Error al renderizar proveedores: {str(e)}")
            return render_template('19_registro_proveedores.html', estado=0, mensaje=f"Error: {str(e)}")



class ProductoView(AuthenticatedView):
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
        
    def guardar_en_json(self, objeto, nombre_archivo):
        with open(nombre_archivo, 'w') as archivo:
            json.dump(objeto, archivo)
        return True 
    
    def registrar_producto(self):
        nombre = request.form['prod_Nombre']
        precio = float(request.form['prod_Precio'])
        cantidad = float(request.form['prod_Cantidad'])
        ganancia = float(request.form['prod_Ganancia'])
        imagen = request.files['prod_Img']
        imagen_data = imagen.read()
        tienda_id = session['tienda_Id']
        
        producto_existente = Productos.query.filter(and_(Productos.prod_Nombre == nombre, Productos.tienda_Id == tienda_id)).first()
        if  precio < 0 or cantidad < 0 or ganancia < 0:
            return {'state': False, 'message': 'Por favor, ingrese valores no negativos para id, precio, cantidad y ganancia'}
        if not nombre or not precio or not cantidad or not imagen:
            return {'state':False, 'message':'Por favor, complete todos los datos'}  
        elif producto_existente:
            return {'state':False, 'message':'Ya existe un producto con esa identificación'} 
        else:
            adm_id = session['adm_Id']
            new_product = Productos(nombre=nombre, precio=precio, ganancia=ganancia, cantidad=cantidad, imagen=imagen_data, tienda=tienda_id, tendero=adm_id)

            db.session.add(new_product)
            db.session.commit()
            return {'state':True, 'message':'Registro exitoso'}

    def renderizar_producto(self, estado, mensaje):
        tienda_id = self.tienda_id
        resultado = db.session.query(Productos, Tiendas).join(Tiendas, Productos.tienda_Id == Tiendas.tienda_Id).all()
        productos_codificados = []
        tienda_info = []
        ganancias = []
        colores = []
        
        for producto, tienda in resultado:
            if producto.tienda_Id == tienda_id:
                if producto.prod_Img:
                    img_codificada = base64.b64encode(producto.prod_Img).decode('utf-8')
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
                if producto.prod_TotalGana ==0:
                    gana = 0
                else:
                    gana = "{:,}".format(int(totalgana-totalbruto))
                
                if producto.prod_Cantidad <= 7:
                     obj = {
                        "color": "orange",
                        "producto_color" : producto.Id,
                        "producto_name" : producto.prod_Nombre,
                        "existencias": producto.prod_Cantidad
                     }
                     colores.append(obj)
                     self.guardar_en_json(obj,'control_productos.json')
                     
                if producto.prod_Cantidad <= 7:
                     obj = {
                        "color": "orange",
                        "producto_color" : producto.Id,
                        "producto_name" : producto.prod_Nombre,
                        "existencias": producto.prod_Cantidad
                     }
                     colores.append(obj)
                     self.guardar_en_json(obj,'control_productos.json')
                     
                if producto.prod_Cantidad > 7:
                     obj = {
                        "color": "green",
                        "producto_color" : producto.Id,
                        "producto_name" : producto.prod_Nombre,
                        "existencias": producto.prod_Cantidad
                     }
                     colores.append(obj)
                     self.guardar_en_json(obj,'control_productos.json')
                     
                productos_codificados.append((producto, img_codificada))
                ganancias.append(gana)
                tienda_info.append(tienda)
        print(colores)
        
        return render_template('11_historial_prod.html', resultado=productos_codificados, tienda_info=tienda_info, ganancias=ganancias, mensaje=mensaje, estado=estado,colores = colores)

class EditarProducto(ProductoView,AuthenticatedView):
    @LoginRequired.login_required
    def get(self, producto_id):
        # Aquí puedes hacer lo que necesites con el ID del producto
        # Por ejemplo, cargar los detalles del producto con el ID proporcionado
        product = Productos.query.filter_by(Id=producto_id).first()
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
# 
class EditarVenta(VentaView,AuthenticatedView):
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
        
class GastoView(AuthenticatedView):
    def __init__(self, tienda_id=None):
        self.tienda_id = session.get('tienda_Id')
    
    @LoginRequired.login_required
    def get(self, estado="", mensaje=""):
        if self.esta_autenticado():
            return self.renderizar_gasto(estado, mensaje)
        else:
            return self.renderizar_login()

    def guardar_en_json(self, objeto, nombre_archivo):
        with open(nombre_archivo, 'w') as archivo:
            json.dump(objeto, archivo)   
        return True           

    def post(self):
        try:
            tienda_id = session.get('tienda_Id')
            id = request.form.get('gasto-id')
            precio = float(request.form.get('gasto-precio'))
            descripcion = request.form.get('gasto-descripcion')
            tipo = request.form.get('gasto-tipo')

            if not id or not precio or not descripcion or not tipo or not tienda_id:
                return self.get(estado=0, mensaje='Por favor, complete todos los datos')
            
            obj = {
                    "id": id,
                    "nombre": descripcion,
                    "tipo": tipo,
                    "precio": precio
                }
            
            self.guardar_en_json(obj,'datos_gasto.json')

            # Crear instancia del gasto y guardarlo en la base de datos
            new_gasto = Gastos(id, descripcion, tipo, precio, tienda_id)
            db.session.add(new_gasto)
            db.session.commit()

            return self.get(estado=1, mensaje="Registro de gasto exitoso")
        except Exception as e:
            db.session.rollback()
            return self.get(estado=0, mensaje=f"Ha ocurrido un error: {str(e)}")       
    
    def renderizar_gasto(self, estado, mensaje):
        tienda_id = self.tienda_id
        resultado = db.session.query(Gastos, Tiendas).join(Tiendas, Gastos.tienda_Id == Tiendas.tienda_Id).all()
        tienda_info = []
        gastos = []

        for gasto, tienda in resultado:
            if gasto.tienda_Id == tienda_id:
                if gasto.gastos_Precio:
                    precio = gasto.gastos_Precio
                    gasto.gastos_Precio = "{:,}".format(int(gasto.gastos_Precio))
                
                tienda_info.append(tienda)
                gastos.append((gasto, tienda))  # Aquí añadimos una tupla de (gasto, tienda)
        
        return render_template('20_gastos.html', resultado=gastos, tienda_info=tienda_info, mensaje=mensaje)
class EditarGasto(GastoView,AuthenticatedView):
    @LoginRequired.login_required
    def get(self, gasto_id):
        # Aquí puedes hacer lo que necesites con el ID del producto
        # Por ejemplo, cargar los detalles del producto con el ID proporcionado
        gasto = Gastos.query.filter_by(gasto_Id=gasto_id).first()
        return render_template('editar_prod.html', gasto=gasto)

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
            
            return super().get(estado=1,mensaje="Actualizaste un gasto exitosamente")
        else:
            return super().get(estado=1,mensaje="El gasto no se encontró en la base de datos")
                     
class Buscar(PaginaPrincipalView):
    def get(self,state=1, resultados={}):
         print("Entré a get")
         return self.renderizar_principal_2(state,resultados)

    def renderizar_principal_2(self, state, resultados):
        return super().renderizar_principal(state=state,productos=resultados)

@main_bp.route('/datos')
def obtener_datos():
    tienda_id = session['tienda_Id']
    resultado_json = []
    resultado = db.session.query(Productos, Tiendas).join(Tiendas, Productos.tienda_Id == Tiendas.tienda_Id).all()
    for producto, tienda in resultado:
        producto_dict = {
            "id": producto.Id,
            "nombre": producto.prod_Nombre,
            "cantidad": producto.prod_Cantidad,
            "precio": producto.prod_Precio,
            "imagen": base64.b64encode(producto.prod_Img).decode('utf-8'),
            "tienda": {
                "nombre": tienda.tienda_Nombre,
                "ubicacion": tienda.tienda_Ubicacion
            }
        }
        resultado_json.append(producto_dict)
    return jsonify(resultado_json)

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

#====================================================================================================
        
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
    else:
        return redirect(url_for('main.home'))
    

# Se registran las rutas con las clases correspondientes
main_bp.add_url_rule('/', view_func=IndexView.as_view('index'))
main_bp.add_url_rule('/login', view_func=LoginView.as_view('login'))
main_bp.add_url_rule('/registro-exitoso', view_func=RegistroExitosoView.as_view('registro_exitoso'))
main_bp.add_url_rule('/signUp', view_func=SignUpView.as_view('sign_up'))
main_bp.add_url_rule('/home', view_func=PaginaPrincipalView.as_view('home'))
main_bp.add_url_rule('/suministros', view_func= RegistroSuministroView.as_view('suministros'))
main_bp.add_url_rule('/proveedores', view_func=RegistroProveedorView.as_view('proveedores'))
main_bp.add_url_rule('/productos', view_func= ProductoView.as_view('productos'))
main_bp.add_url_rule('/ventas', view_func= VentaView.as_view('ventas'))
main_bp.add_url_rule('/editar-producto/<int:producto_id>', view_func=EditarProducto.as_view('editar-producto'))
main_bp.add_url_rule('/editar-venta/<int:venta_id>', view_func=EditarVenta.as_view('editar-venta'))
main_bp.add_url_rule('/gastos', view_func=GastoView.as_view('gastos'))
main_bp.add_url_rule('/editar-gasto/<int:gasto_id>', view_func=EditarGasto.as_view('editar-gasto'))
main_bp.add_url_rule('/buscar', view_func=Buscar.as_view('buscar'))
main_bp.add_url_rule('/resultado', view_func=Resultado.as_view('resultado'))
main_bp.add_url_rule('/editar-suministros/<int:sum_id>', view_func=EditarSuministro.as_view('editar-suministros'))
main_bp.add_url_rule('/ventas/factura_ventas', view_func=FacturaVentas.as_view('ventas/factura_ventas'))
