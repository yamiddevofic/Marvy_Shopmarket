from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary, ForeignKey
from sqlalchemy.orm import relationship


db = SQLAlchemy()

class Caja(db.Model):
    caja_ID = db.Column(db.Integer, primary_key=True)
    caja_Ingresos = db.Column(db.Float)
    caja_Egresos = db.Column(db.Float)
    caja_Total = db.Column(db.Float)
    tendero_Id = db.Column(db.Integer, db.ForeignKey('tenderos.tendero_ID'))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Facturas(db.Model):
    fac_Id = db.Column(db.Integer, primary_key=True)
    fac_Datetime = db.Column(db.DateTime)
    fac_Tipo = db.Column(db.String(45))
    tendero_Id = db.Column(db.Integer, db.ForeignKey('tenderos.tendero_ID'))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Gastos(db.Model):
    gastos_Id = db.Column(db.Integer, primary_key=True)
    gastos_Descr = db.Column(db.String(100))
    gastos_Tipo = db.Column(db.String(45))
    gastos_Precio = db.Column(db.Float)
    tendero_ID = db.Column(db.Integer, db.ForeignKey('tenderos.tendero_ID'))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Informes(db.Model):
    inf_Id = db.Column(db.Integer, primary_key=True)
    inf_Datetime = db.Column(db.DateTime)
    inf_Tipo = db.Column(db.String(45))
    inf_Doc = db.Column(db.LargeBinary)
    tendero_Id = db.Column(db.Integer, db.ForeignKey('tenderos.tendero_ID'))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Productos(db.Model):
    prod_Id = db.Column(db.Integer, primary_key=True)
    prod_Nombre = db.Column(db.String(70))
    prod_Precio = db.Column(db.Float)
    prod_Cantidad = db.Column(db.Integer)
    prod_Categoria = db.Column(db.String(45))
    prod_Total = db.Column(db.Float, db.Computed('(prod_Precio * prod_Cantidad)'))
    prod_Img = db.Column(db.LargeBinary)
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Proveedores(db.Model):
    prov_Id = db.Column(db.Integer, primary_key=True)
    prov_Nombre = db.Column(db.String(70))
    prov_Ubicacion = db.Column(db.String(100))
    prov_Contacto = db.Column(db.String(50))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class SuministroProveedor(db.Model):
    sum_ID = db.Column(db.Integer, db.ForeignKey('suministros.sum_ID'), primary_key=True)
    prov_ID = db.Column(db.Integer, db.ForeignKey('proveedores.prov_Id'), primary_key=True)

class Suministros(db.Model):
    sum_ID = db.Column(db.Integer, primary_key=True)
    sum_Cantidad = db.Column(db.Integer)
    sum_Datetime = db.Column(db.DateTime)
    sum_Metodo_pago = db.Column(db.String(45))
    sum_Total = db.Column(db.Float)
    sum_Pago = db.Column(db.Float)
    sum_Vueltos = db.Column(db.Float)
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Tenderos(db.Model):
    tendero_ID = db.Column(db.Integer, primary_key=True)
    tendero_Password = db.Column(db.String(100))
    tendero_Nombre = db.Column(db.String(70))
    tendero_Correo= db.Column(db.String(50))
    tendero_Celular= db.Column(db.String(12))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))

class Tiendas(db.Model):
    tienda_Id = db.Column(db.Integer, primary_key=True)
    tienda_Password = db.Column(db.String(100))
    tienda_Nombre = db.Column(db.String(70))
    tienda_Correo = db.Column(db.String(50))
    tienda_Celular = db.Column(db.String(12))
    tienda_Ubicacion = db.Column(db.String(100))
    tienda_IMG = db.Column(db.LargeBinary)

class Ventas(db.Model):
    venta_Id = db.Column(db.Integer, primary_key=True)
    venta_Cantidad = db.Column(db.Integer)
    venta_Metodo = db.Column(db.String(45))
    venta_Datetime = db.Column(db.DateTime)
    venta_Total = db.Column(db.Float)
    venta_Pago = db.Column(db.Float)
    venta_Vueltos = db.Column(db.Float)
    tendero_Id = db.Column(db.Integer, db.ForeignKey('tenderos.tendero_ID'))
    tienda_Id = db.Column(db.Integer, db.ForeignKey('tiendas.tienda_Id'))