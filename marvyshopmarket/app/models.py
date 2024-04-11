from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary, ForeignKey, ForeignKeyConstraint
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Administrador(db.Model):
    __tablename__ = 'administrador'
    adm_Id = db.Column(db.BigInteger, primary_key=True)
    adm_Nombre = db.Column(db.String(70))
    adm_Correo = db.Column(db.String(12))
    adm_Celular = db.Column(db.String(100))
    adm_Password = db.Column(db.String(100))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))

    def __init__(self, id, nombre, correo , celular, password, tienda):
         self.adm_Id = id
         self.adm_Nombre = nombre
         self.adm_Correo = correo
         self.adm_Celular = celular
         self.adm_Password = password
         self.tienda_Id = tienda

class Caja(db.Model):
    __tablename__ = 'caja'
    caja_Id = db.Column(db.BigInteger, primary_key=True)
    caja_Ingresos = db.Column(db.Float)
    caja_Egresos = db.Column(db.Float)
    caja_Total = db.Column(db.Float)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))

    def __init__(self, id, ingresos, egresos, total, tienda):
         self.caja_Id = id
         self.caja_Ingresos = ingresos
         self.caja_Egresos = egresos
         self.caja_Total = total
         self.tienda_Id = tienda
class Factura(db.Model):
    __tablename__ = 'factura'
    fac_Id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    fac_Datetime = db.Column(db.DateTime)
    fac_Tipo = db.Column(db.String(45))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))
    # Este documento asume que es un blob de datos, como un PDF
    fac_Doc = db.Column(db.LargeBinary)
    # Relación para acceder a las ventas desde la factura
    ventas = db.relationship('Ventas', backref='factura', lazy=True)

    def __init__(self, fac_Datetime, fac_Tipo, tienda_Id, fac_Doc=None):
        self.fac_Datetime = fac_Datetime
        self.fac_Tipo = fac_Tipo
        self.tienda_Id = tienda_Id
        self.fac_Doc = fac_Doc
class Gastos(db.Model):
    __tablename__ = 'gastos'
    gastos_Id = db.Column(db.BigInteger, primary_key=True)
    gastos_Descr = db.Column(db.String(100))
    gastos_Tipo = db.Column(db.String(45))
    gastos_Precio = db.Column(db.Float)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))

    def __init__(self, id, descripcion, tipo, precio, tienda):
         self.gastos_Id = id
         self.gastos_Descr = descripcion
         self.gastos_Tipo = tipo
         self.gastos_Precio = precio
         self.tienda_Id = tienda

class Informe(db.Model):
    __tablename__ = 'informe'
    inf_Id = db.Column(db.BigInteger, primary_key=True)
    inf_Datetime = db.Column(db.DateTime)
    inf_Tipo = db.Column(db.String(45))
    inf_Doc = db.Column(db.LargeBinary)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))

    def __init__(self, id, fecha, tipo, documento, tienda):
         self.inf_Id = id
         self.inf_Datetime = fecha
         self.inf_Tipo = tipo
         self.inf_Doc = documento
         self.tienda_Id = tienda

class Productos(db.Model):
    __tablename__ = 'productos'
    Id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    prod_Nombre = db.Column(db.String(70))
    prod_Precio = db.Column(db.Float)
    prod_Ganancia= db.Column(db.Float)
    prod_TotalPrecio = db.Column(db.Float,db.Computed('(prod_Precio*(prod_Ganancia/100))+prod_Precio'))
    prod_Cantidad = db.Column(db.BigInteger)
    prod_Total = db.Column(db.Float,db.Computed('(prod_Precio * prod_Cantidad)'))
    prod_TotalGana = db.Column(db.Float,db.Computed('(prod_TotalPrecio * prod_Cantidad)'))
    prod_Img= db.Column(db.LargeBinary)
    tendero_Id = db.Column(db.BigInteger,db.ForeignKey('tenderos.tendero_Id'))
    tienda_Id = db.Column(db.BigInteger,db.ForeignKey('tenderos.tienda_Id'))

    def __init__(self, nombre, precio, ganancia, cantidad, imagen, tendero, tienda):
         self.prod_Nombre = nombre
         self.prod_Precio = precio
         self.prod_Ganancia = ganancia
         self.prod_Cantidad = cantidad
         self.prod_Img = imagen
         self.tendero_Id = tendero
         self.tienda_Id = tienda

class Proveedores(db.Model):
    __tablename__ = 'proveedores'
    id=db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    prov_Id = db.Column(db.String(50))
    prov_Nombre = db.Column(db.String(70))
    prov_Ubicacion = db.Column(db.String(100))
    prov_Contacto = db.Column(db.String(50))
    prov_prod_nom = db.Column(db.String(500))

    def __init__(self, id, nombre, ubicacion, contacto, productos):
        self.prov_Id = id
        self.prov_Nombre =nombre
        self.prov_Ubicacion = ubicacion
        self.prov_Contacto = contacto
        self.prov_prod_nom = productos

class Suministros(db.Model):
    __tablename__ = 'suministros'
    sum_Id = db.Column(db.BigInteger, primary_key=True)
    sum_Cantidad = db.Column(db.BigInteger)
    sum_Datetime = db.Column(db.DateTime)
    sum_Metodo_pago = db.Column(db.String(100))  # Cambio aquí
    sum_Total = db.Column(db.Float)  # Cambio aquí
    sum_Prov_Nom = db.Column(db.String(65))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))

    def __init__(self, id, cantidad, fecha, metodo_pago, total, proveedor, tienda):
        self.sum_Id = id
        self.sum_Cantidad = cantidad
        self.sum_Datetime = fecha
        self.sum_Metodo_pago = metodo_pago
        self.sum_Total = total
        self.sum_Prov_Nom = proveedor
        self.tienda_Id = tienda


class SuministrosHasProductos(db.Model):
    __tablename__ = 'suministros_has_productos'

    suministros_sum_Id = db.Column(db.BigInteger, primary_key=True)
    suministros_tienda_Id = db.Column(db.BigInteger, primary_key=True)
    productos_Id = db.Column(db.BigInteger, primary_key=True)
    productos_tendero_Id = db.Column(db.BigInteger, primary_key=True)
    productos_tienda_Id = db.Column(db.BigInteger, primary_key=True)
    productos_prod_Nombre = db.Column(db.String(65))
    
    def __init__(self, suministro, tienda, producto,nombre_producto,tendero, productos_tienda):
        self.suministros_sum_Id = suministro
        self.suministros_tienda_Id = tienda
        self.productos_Id = producto
        self.productos_prod_Nombre = nombre_producto
        self.productos_tendero_Id = tendero
        self.productos_tienda_Id = productos_tienda

class Tenderos(db.Model):
    __tablename__ = 'tenderos'
    tendero_Id = db.Column(db.BigInteger, primary_key=True)
    tendero_Nombre = db.Column(db.String(70))
    tendero_Correo = db.Column(db.String(100))
    tendero_Celular = db.Column(db.String(12))
    tendero_Password = db.Column(db.String(100))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))

    def __init__(self, id, nombre, correo, celular, password, tienda):
         self.tendero_Id = id
         self.tendero_Nombre = nombre
         self.tendero_Correo = correo
         self.tendero_Celular = celular
         self.tendero_Password = password
         self.tienda_Id = tienda

class Tiendas(db.Model):
    __tablename__ = 'tiendas'
    tienda_Id = db.Column(db.BigInteger, primary_key=True)
    tienda_Nombre = db.Column(db.String(70))
    tienda_Correo = db.Column(db.String(100))
    tienda_Celular = db.Column(db.String(12))
    tienda_Ubicacion = db.Column(db.String(100))
    tienda_IMG = db.Column(db.LargeBinary)

    def __init__(self, id, nombre, correo, celular, ubicacion, imagen):
         self.tienda_Id = id
         self.tienda_Nombre = nombre
         self.tienda_Correo = correo
         self.tienda_Celular = celular
         self.tienda_Ubicacion = ubicacion
         self.tienda_IMG = imagen

class Ventas(db.Model):
    __tablename__ = 'ventas'
    venta_Id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    venta_Cantidad = db.Column(db.Integer)
    venta_Metodo = db.Column(db.String(45))
    venta_Datetime = db.Column(db.DateTime)
    venta_Total = db.Column(db.Float)
    tendero_Id = db.Column(db.BigInteger, db.ForeignKey('tenderos.tendero_Id'), nullable=False)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'), nullable=False)
    # Clave foránea que apunta a Factura
    factura_id = db.Column(db.BigInteger, db.ForeignKey('factura.fac_Id'))

    def __init__(self, venta_Cantidad, venta_Metodo, venta_Datetime, venta_Total, tendero_Id, tienda_Id,factura_id):
        self.venta_Cantidad = venta_Cantidad
        self.venta_Metodo = venta_Metodo
        self.venta_Datetime = venta_Datetime
        self.venta_Total = venta_Total
        self.tendero_Id = tendero_Id
        self.tienda_Id = tienda_Id
        self.factura_id = factura_id

class VentasHasProductos(db.Model):
    __tablename__ = 'ventas_has_productos'
    ventas_venta_Id = db.Column(db.BigInteger, db.ForeignKey('ventas.venta_Id'), primary_key=True)
    ventas_tendero_Id = db.Column(db.BigInteger, primary_key=True)
    ventas_tienda_Id = db.Column(db.BigInteger, primary_key=True)
    productos_Id = db.Column(db.BigInteger, db.ForeignKey('productos.Id'), primary_key=True)
    productos_tendero_Id = db.Column(db.BigInteger, primary_key=True)
    productos_tienda_Id = db.Column(db.BigInteger, primary_key=True)

    venta = db.relationship('Ventas', backref='ventas_has_productos', foreign_keys=[ventas_venta_Id, ventas_tendero_Id, ventas_tienda_Id])
    producto = db.relationship('Productos', backref='ventas_has_productos', foreign_keys=[productos_Id, productos_tendero_Id, productos_tienda_Id])

    def __init__(self, ventas_venta_Id, ventas_tendero_Id, ventas_tienda_Id, productos_Id, productos_tendero_Id, productos_tienda_Id):
        self.ventas_venta_Id = ventas_venta_Id
        self.ventas_tendero_Id = ventas_tendero_Id
        self.ventas_tienda_Id = ventas_tienda_Id
        self.productos_Id = productos_Id
        self.productos_tendero_Id = productos_tendero_Id
        self.productos_tienda_Id = productos_tienda_Id
