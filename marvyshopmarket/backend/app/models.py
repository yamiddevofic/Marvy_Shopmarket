# backend/app/models.py
"""Modelos SQLAlchemy (MySQL).

Se usa el constructor por defecto de SQLAlchemy, que recibe los nombres de
columna como argumentos con nombre, p. ej. ``Tiendas(tienda_Id=1, ...)``.
"""
from .extensions import db


class Administrador(db.Model):
    __tablename__ = 'administrador'
    adm_Id = db.Column(db.BigInteger, primary_key=True)
    adm_Nombre = db.Column(db.String(70))
    adm_Correo = db.Column(db.String(100))
    adm_Celular = db.Column(db.String(100))
    adm_Password = db.Column(db.String(100))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))


class Caja(db.Model):
    __tablename__ = 'caja'
    caja_Id = db.Column(db.BigInteger, primary_key=True)
    caja_Ingresos = db.Column(db.Float)
    caja_Egresos = db.Column(db.Float)
    caja_Total = db.Column(db.Float)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))


class Factura(db.Model):
    __tablename__ = 'factura'
    fac_Id = db.Column(db.BigInteger, primary_key=True)
    fac_Datetime = db.Column(db.DateTime)
    fac_Tipo = db.Column(db.String(45))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))


class Gastos(db.Model):
    __tablename__ = 'gastos'
    gastos_Id = db.Column(db.BigInteger, primary_key=True)
    gastos_Descr = db.Column(db.String(100))
    gastos_Tipo = db.Column(db.String(45))
    gastos_Precio = db.Column(db.Float)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))


class Informe(db.Model):
    __tablename__ = 'informe'
    inf_Id = db.Column(db.BigInteger, primary_key=True)
    inf_Datetime = db.Column(db.DateTime)
    inf_Tipo = db.Column(db.String(45))
    inf_Doc = db.Column(db.LargeBinary)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))


class Proveedores(db.Model):
    __tablename__ = 'proveedores'
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    prov_Id = db.Column(db.String(50))
    prov_Nombre = db.Column(db.String(70))
    prov_Ubicacion = db.Column(db.String(100))
    prov_Contacto = db.Column(db.String(50))
    prov_prod_nom = db.Column(db.String(500))


class Suministros(db.Model):
    __tablename__ = 'suministros'
    sum_Id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    sum_Cantidad = db.Column(db.BigInteger)
    sum_Datetime = db.Column(db.DateTime)
    sum_Metodo_pago = db.Column(db.String(100))
    sum_Total = db.Column(db.Float)
    sum_prod_Nom = db.Column(db.String(65))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))


class SuministrosHasProductos(db.Model):
    __tablename__ = 'suministros_has_productos'
    suministros_sum_Id = db.Column(db.BigInteger, primary_key=True)
    suministros_tienda_Id = db.Column(db.BigInteger, primary_key=True)
    productos_Id = db.Column(db.BigInteger, primary_key=True)
    productos_tendero_Id = db.Column(db.BigInteger, primary_key=True)
    productos_tienda_Id = db.Column(db.BigInteger, primary_key=True)


class Tenderos(db.Model):
    __tablename__ = 'tenderos'
    tendero_Id = db.Column(db.BigInteger, primary_key=True)
    tendero_Nombre = db.Column(db.String(70))
    tendero_Correo = db.Column(db.String(100))
    tendero_Celular = db.Column(db.String(12))
    tendero_Password = db.Column(db.String(100))
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))


class Tiendas(db.Model):
    __tablename__ = 'tiendas'
    tienda_Id = db.Column(db.BigInteger, primary_key=True)
    tienda_Nombre = db.Column(db.String(70))
    tienda_Correo = db.Column(db.String(100))
    tienda_Celular = db.Column(db.String(12))
    tienda_Ubicacion = db.Column(db.String(100))
    # Guarda la URL relativa del logo (p. ej. b'/uploads/tienda_1.png'), no la imagen.
    tienda_IMG = db.Column(db.LargeBinary)


class Usuario(db.Model):
    __tablename__ = 'usuario'
    usuario_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    rol_id = db.Column(db.BigInteger, nullable=False)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id', ondelete='SET NULL'), nullable=True)
    activo = db.Column(db.Boolean, default=True)
    documento = db.Column(db.Integer, unique=True, nullable=True)


class Ventas(db.Model):
    __tablename__ = 'ventas'
    venta_Id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    venta_Metodo = db.Column(db.String(45))
    venta_Datetime = db.Column(db.DateTime)
    venta_Pago_Tot = db.Column(db.Float)
    usuario_id = db.Column(db.BigInteger, db.ForeignKey('usuario.usuario_id', ondelete='CASCADE'), nullable=False)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id', ondelete='CASCADE'), nullable=False)


class VentasHasProductos(db.Model):
    __tablename__ = 'ventas_has_productos'
    venta_Id = db.Column(db.BigInteger, db.ForeignKey('ventas.venta_Id', ondelete='CASCADE'), primary_key=True)
    producto_id_mongo = db.Column(db.String(50), primary_key=True)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Numeric(10, 2), nullable=False)
