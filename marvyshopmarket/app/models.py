from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import LargeBinary, ForeignKey
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

class Productos(db.Model):
    __tablename__ = 'productos'
    Id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    prod_Id= db.Column(db.BigInteger)
    prod_Nombre = db.Column(db.String(70))
    prod_Precio = db.Column(db.Float)
    prod_Cantidad = db.Column(db.BigInteger)
    prod_Categoria = db.Column(db.String(45))
    prod_Total = db.Column(db.Float,db.Computed('(prod_Precio * prod_Cantidad)'))
    prod_Img= db.Column(db.LargeBinary)
    tendero_Id = db.Column(db.BigInteger,db.ForeignKey('tenderos.tendero_Id'))
    tienda_Id = db.Column(db.BigInteger,db.ForeignKey('tenderos.tienda_Id'))
class Proveedores(db.Model):
    __tablename__ = 'proveedores'
    prov_Id = db.Column(db.BigInteger, primary_key=True)
    prov_Nombre = db.Column(db.String(70))
    prov_Ubicacion = db.Column(db.String(100))
    prov_Contacto = db.Column(db.String(50))

class Suministros(db.Model):
    __tablename__ = 'suministros'
    sum_Id = db.Column(db.BigInteger, primary_key=True)
    sum_Cantidad = db.Column(db.BigInteger)
    sum_Datetime = db.Column(db.DateTime)
    sum_Metodo_pago = db.Column(db.String(45))
    sum_Total = db.Column(db.Float)
    sum_Pago = db.Column(db.Float)
    sum_Vueltos = db.Column(db.Float)
    tienda_Id = db.Column(db.BigInteger, db.ForeignKey('tiendas.tienda_Id'))

class SuministrosProveedores(db.Model):
    __tablename__ = 'suministros_proveedores'
    id = db.Column(db.BigInteger, primary_key=True)
    sum_Id = db.Column(db.BigInteger,db.ForeignKey('suministros.sum_Id'))
    tienda_Id = db.Column(db.BigInteger,db.ForeignKey('suministros.tienda_Id'))
    prov_Id = db.Column(db.BigInteger,db.ForeignKey('proveedores.prov_Id'))
    # Define foreign keys and relationships as needed
    __table_args__ = (
        db.ForeignKeyConstraint(['sum_Id', 'tienda_Id'], ['suministros.sum_Id', 'suministros.tienda_Id']),
        db.ForeignKeyConstraint(['prov_Id'], ['proveedores.prov_Id']),
    )

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
    tienda_IMG = db.Column(db.LargeBinary)



class Ventas(db.Model):
    __tablename__ = 'ventas'
    venta_Id =db.Column(db.BigInteger, primary_key=True)
    venta_Cantidad =db.Column(db.BigInteger)
    venta_Metodo =db.Column(db.String(45))
    venta_Datetime =db.Column(db.DateTime)
    venta_Total =db.Column(db.Float)
    venta_Pago =db.Column(db.Float)
    venta_Vueltos =db.Column(db.Float)
    tendero_Id =db.Column(db.BigInteger, ForeignKey('tenderos.tendero_Id'))
    tienda_Id =db.Column(db.BigInteger, ForeignKey('tiendas.tienda_Id'))

    # Definir la relación con la tabla Tenderos
    tendero = relationship("Tenderos", backref="ventas")

    # Definir la relación con la tabla Tiendas
    tienda = relationship("Tiendas", backref="ventas")