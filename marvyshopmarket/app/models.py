from . import db

class Producto(db.Model):
    __bind_key__ = 'producto'
    __tablename__ = 'productos'
    prod_Id = db.Column(db.Integer, primary_key=True)
    prod_Nombre = db.Column(db.String(100))
    prod_Precio = db.Column(db.Integer)
    prod_Cantidad = db.Column(db.Integer)
    prod_Fecha_cad = db.Column(db.Date)
    prod_Img = db.Column(db.LargeBinary)

class Images(db.Model):
    __bind_key__ = 'image'  # Vincula este modelo a la base de datos llamada 'image'
    __tablename__ = 'images'  # Nombre de la tabla en la base de datos
    image_id = db.Column(db.Integer, primary_key=True)
    image_nom = db.Column(db.String(100))
    image = db.Column(db.LargeBinary)
