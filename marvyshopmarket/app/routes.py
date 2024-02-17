from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuración de la conexión a la base de datos MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:nidian56@localhost/marvy_shopmarket'


# Inicializar la extensión SQLAlchemy
db = SQLAlchemy(app)

# Definir el modelo de la tabla 'productos'
class Productos(db.Model):
    prod_Id = db.Column(db.Integer, primary_key=True)
    prod_Nombre = db.Column(db.String(100))
    prod_Precio = db.Column(db.Integer)
    prod_Cantidad = db.Column(db.Integer)
    prod_Fecha_cad = db.Column(db.Date)

# Ejemplo de cómo usar la conexión en una ruta
@app.route('/')
def index():
    # Obtener todos los productos de la base de datos
    return render_template('index.html')

@app.route('/resultados')
def results():
    # Obtener todos los productos de la base de datos
    productos = Productos.query.all()
    return render_template('results.html', productos=productos)

if __name__ == '__main__':
    app.run(debug=True)
