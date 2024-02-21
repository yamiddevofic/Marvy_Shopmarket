from . import db

class Producto(db.Model):
    __bind_key__ = 'producto'
    __tablename__ = 'productos'
    prod_Id = db.Column(db.Integer, primary_key=True)
    prod_Nombre = db.Column(db.String(100))
    prod_Precio = db.Column(db.Float)
    prod_Cantidad = db.Column(db.Integer)
    prod_Total = db.Column(db.Float, server_default='0')
    prod_Img = db.Column(db.LargeBinary)

    def __init__(self, prod_Id,prod_Nombre, prod_Precio, prod_Cantidad,prod_Img):
        self.prod_Id = prod_Id
        self.prod_Nombre = prod_Nombre
        self.prod_Precio = prod_Precio
        self.prod_Cantidad = prod_Cantidad
        self.prod_Img = prod_Img

    def __repr__(self):
        return f"<Producto {self.prod_Id}>"
class Images(db.Model):
    __bind_key__ = 'image'  # Vincula este modelo a la base de datos llamada 'image'
    __tablename__ = 'images'  # Nombre de la tabla en la base de datos
    image_id = db.Column(db.Integer, primary_key=True)
    image_nom = db.Column(db.String(100))
    image = db.Column(db.LargeBinary)
