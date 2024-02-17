from flask import Flask
from flaskext.mysql import MySQL

app = Flask(__name__)

# Configuración de la conexión a la base de datos MySQL
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'nidian56'
app.config['MYSQL_DATABASE_DB'] = 'marvy_shopmarket'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'  # o la dirección IP de tu servidor MySQL

# Inicializar la extensión MySQL
mysql = MySQL(app)

# Ahora puedes usar 'mysql' en cualquier lugar de tu aplicación para interactuar con la base de datos

# Importar tus rutas o vistas
from app import routes
