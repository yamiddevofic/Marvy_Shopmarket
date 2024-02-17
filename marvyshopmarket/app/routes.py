from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuración de la conexión a la base de datos MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:nidian56@localhost/marvy_shopmarket'

# Inicializar la extensión SQLAlchemy
db = SQLAlchemy(app)

# Definir el modelo de la tabla 'productos'
class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    precio = db.Column(db.Float)

# Ejemplo de cómo usar la conexión en una ruta
@app.route('/')
def index():
    # Obtener todos los productos de la base de datos
    productos = Producto.query.all()
    return render_template('results.html', productos=productos)

if __name__ == '__main__':
    app.run(debug=True)
