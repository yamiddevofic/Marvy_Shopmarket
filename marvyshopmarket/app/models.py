from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    user_Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_Nombre = db.Column(db.String(45))
    user_Correo = db.Column(db.String(50))
    user_Password = db.Column(db.String(12))
    tiendas_tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))
    tienda = db.relationship("Tienda")

class Producto(db.Model):
    __tablename__ = 'productos'
    prod_Id = db.Column(db.Integer, primary_key=True)
    prod_Nombre = db.Column(db.String(65))
    prod_Precio = db.Column(db.Float)
    prod_Cantidad = db.Column(db.Integer)
    prod_Total = db.Column(db.Float)
    prod_Img = db.Column(LargeBinary)
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Tienda(db.Model):
    __tablename__ = 'tiendas'
    tienda_Id = db.Column(db.Integer, primary_key=True)
    tienda_Nombre = db.Column(db.String(45))
    tienda_Tel = db.Column(db.String(20))
    tienda_Ubicacion = db.Column(db.String(100))
    tienda_total_dia = db.Column(db.Float)
    productos = db.relationship("Producto", backref="tienda", primaryjoin="Tienda.tienda_Id == Producto.tienda_Id")
    suministros = db.relationship("Suministro", backref="tienda", primaryjoin="Tienda.tienda_ Id = Suministro.tienda_Id")
    ventas = db.relationship("Venta", backref="tienda", primaryjoin="Tienda.tienda_Id == Venta.tienda_Id")
    informes = db.relationship("Informe", backref="tienda", primaryjoin="Tienda.tienda_Id == Informe.tienda_Id")

class Suministro(db.Model):
    __tablename__ = 'suministros'
    sum_Id = db.Column(db.Integer, primary_key=True)
    sum_Cantidad = db.Column(db.Integer)
    sum_Datetime = db.Column(db.DateTime)
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Venta(db.Model):
    __tablename__ = 'ventas'
    venta_Id = db.Column(db.Integer, primary_key=True)
    venta_Cantidad = db.Column(db.Integer)
    venta_Metodo = db.Column(db.String(45))
    venta_Datetime = db.Column(db.DateTime)
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Informe(db.Model):
    __tablename__ = 'informes'
    inf_Id = db.Column(db.Integer, primary_key=True)
    inf_Dateime = db.Column(db.DateTime)
    inf_Tipo = db.Column(db.String(45))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))
