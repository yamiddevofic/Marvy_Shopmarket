from flask import Blueprint, render_template, request,redirect,url_for
from .models import Producto, Images
from app import db
import base64
main_bp = Blueprint('main',__name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/nuevo_producto', methods=['POST'])
def nuevo_producto():
    if request.method == 'POST':
        id = request.form['prod_Id']
        nombre = request.form['prod_Nombre']
        precio = request.form['prod_Precio']
        cantidad = request.form['prod_Cantidad']
        fecha_cad = request.form['prod_Fecha_cad']
        imagen = request.files['prod_Img']
        
        imagen_data = imagen.read()
        
        # Valida los datos antes de insertarlos en la base de datos
        if not id or not nombre or not precio or not cantidad or not fecha_cad or not imagen:
            return "Por favor, completa todos los campos.", 400

        new_product = Producto(
            prod_Id=int(id),
            prod_Nombre=nombre,
            prod_Precio=precio,
            prod_Cantidad=cantidad,
            prod_Fecha_cad=fecha_cad,
            prod_Img = imagen_data
        )
        db.session.add(new_product)
        db.session.commit()
        return redirect(url_for('main.resultados'))
    
@main_bp.route('/resultados', methods=['GET','POST'])
def resultados():
    if request.method == "GET":
        productos = Producto.query.all()
        for producto in productos:
            producto.prod_Img = base64.b64encode(producto.prod_Img).decode('utf-8')
        return render_template('results.html', productos=productos)
