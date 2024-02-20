from flask import Blueprint, render_template, request,redirect,url_for
from .models import Producto, Images
from app import db
import base64
main_bp = Blueprint('main',__name__)

@main_bp.route('/')
def index():
    return render_template('0_welcome.html')

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
        if not id or not nombre or not precio or not cantidad or not imagen:
            return "Por favor, completa todos los campos.", 400

        new_product = Producto(
            prod_Id=int(id),
            prod_Nombre=nombre,
            prod_Precio=precio,
            prod_Cantidad=cantidad,
            prod_Img = imagen_data
        )
        db.session.add(new_product)
        db.session.commit()
        return redirect(url_for('main.resultados'))

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

@main_bp.route('/resultados', methods=['GET','POST'])
def resultados():
    if request.method == "GET":
        productos = Producto.query.all()
        for producto in productos:
            producto.prod_Img = base64.b64encode(producto.prod_Img).decode('utf-8')
        return render_template('11_historial_prod.html', productos=productos)
