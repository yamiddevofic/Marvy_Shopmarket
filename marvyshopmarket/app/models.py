from . import db
from sqlalchemy import ForeignKey


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

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    user_Id = db.Column(db.Integer, primary_key=True)
    user_Nombre = db.Column(db.String(45))
    user_Correo = db.Column(db.String(50))
    user_Password = db.Column(db.String(12))
    tiendas_tienda_Id = db.Column(db.Integer, ForeignKey('tiendas.tienda_Id'))

class Tienda(db.Model):
    __tablename__ = 'tiendas'

    tienda_Id = db.Column(db.Integer, primary_key=True)
    tienda_Nombre = db.Column(db.String(45))
    tienda_Tel = db.Column(db.String(20))
    tienda_Ubicacion = db.Column(db.String(100))
    tienda_total_dia = db.Column(db.Float)
    suministros_sum_Id = db.Column(db.Integer, ForeignKey('suministros.sum_Id'))
    productos_prod_Id = db.Column(db.Integer, ForeignKey('productos.prod_Id'))
    ventas_venta_Id = db.Column(db.Integer, ForeignKey('ventas.venta_Id'))
    informes_inf_Id = db.Column(db.Integer, ForeignKey('informes.inf_Id'))

    # Definición de relaciones
    suministros = db.relationship("Suministro")
    productos = db.relationship("Producto")
    ventas = db.relationship("Venta")
    informes = db.relationship("Informe")

class Suministro(db.Model):
    __tablename__ = 'suministros'

    sum_Id = db.Column(db.Integer, primary_key=True)
    sum_Cantidad = db.Column(db.Integer)
    sum_Datetime = db.Column(db.DateTime)

class Venta(db.Model):
    __tablename__ = 'ventas'

    venta_Id = db.Column(db.Integer, primary_key=True)
    venta_Cantidad = db.Column(db.Integer)
    venta_Metodo = db.Column(db.String(45))
    venta_Datetime = db.Column(db.DateTime)

class Informe(db.Model):
    __tablename__ = 'informes'

    inf_Id = db.Column(db.Integer, primary_key=True)
    inf_Dateime = db.Column(db.DateTime)
    inf_Tipo = db.Column(db.String(45))
