from flask import Blueprint, render_template, request,redirect,url_for
from .models import Producto, Images
from app import db
import base64
main_bp = Blueprint('main',__name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/resultados')
def results():
    productos = Producto.query.all()
    return render_template('results.html', productos=productos)

@main_bp.route('/imagenes')
def mostrar_imagenes():
    images = Images.query.all()
    for image in images:
        image.image=base64.b64encode(image.image).decode('utf-8')
    return render_template('images.html', images=images)