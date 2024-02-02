CREATE DATABASE Marvy_Shopmarket;
USE Marvy_Shopmarket;

CREATE TABLE Tienda(
tien_Id INT PRIMARY KEY,
tien_Ubi VARCHAR(100),
tien_Nombre VARCHAR(50),
tien_Contacto INT,
tien_Dueño VARCHAR(100),
tien_Logo LONGBLOB
);

CREATE TABLE Tendero(
ten_Id INT PRIMARY KEY AUTO_INCREMENT,
ten_Nombre VARCHAR(100),
ten_Apellido VARCHAR(100),
ten_Correo VARCHAR(100),
ten_Usuario VARCHAR(45),
ten_Contraseña VARCHAR(15),
ten_Foto LONGBLOB,
Tienda_tien_Id INT,
FOREIGN KEY (Tienda_tien_Id) REFERENCES Tienda(tien_Id)
);

CREATE TABLE Proveedor(
prov_Id INT PRIMARY KEY,
prov_Encargado VARCHAR(100),
prov_Cargo VARCHAR(45),
prov_Empresa VARCHAR(45),
prov_Contacto INT
);

CREATE TABLE Producto(
pro_Id INT PRIMARY KEY,
pro_Nombre VARCHAR(45),
pro_Precio INT,
pro_FechaCad DATETIME,
pro_Descrip	VARCHAR(500),
Proveedor_prov_Id INT,
FOREIGN KEY (Proveedor_prov_Id) REFERENCES Proveedor(prov_Id)
);

CREATE TABLE Suministro(
Tienda_tien_Id INT,
Proveedor_prov_Id INT,
sumin_Fecha DATETIME,
sumin_Cantidad INT,
FOREIGN KEY (Tienda_tien_Id) REFERENCES Tienda(tien_Id),
FOREIGN KEY (Proveedor_prov_Id) REFERENCES Proveedor(prov_Id)
);

CREATE TABLE Existencia(
Producto_pro_Id INT,
Tienda_tien_ID INT,
FOREIGN KEY (Producto_pro_Id) REFERENCES Producto(pro_Id),
FOREIGN KEY (Tienda_tien_Id) REFERENCES Tienda(tien_Id)
);

CREATE TABLE Cliente(
client_Id INT PRIMARY KEY AUTO_INCREMENT,
Tendero_ten_Id INT,
client_Tipo VARCHAR(45),
client_Nombre VARCHAR(100),
client_Contacto INT,
FOREIGN KEY (Tendero_ten_Id) REFERENCES Tendero(ten_Id)
);

CREATE TABLE Compra(
Producto_pro_Id INT,
Cliente_client_Id INT,
compra_Fecha DATETIME,
compra_Cantidad INT,
FOREIGN KEY (Producto_pro_Id) REFERENCES Producto(pro_Id),
FOREIGN KEY (Cliente_client_Id) REFERENCES Cliente(client_Id)
);

CREATE TABLE Recibo(
rec_Id INT PRIMARY KEY AUTO_INCREMENT,
rec_Tipo VARCHAR(45),
rec_Fechali DATE,
rec_Precio INT,
rec_Descrip VARCHAR(300),
Tendero_ten_Id INT,
FOREIGN KEY (Tendero_ten_Id) REFERENCES Tendero(ten_Id)
);
CREATE TABLE Informe(
inf_Id INT PRIMARY KEY AUTO_INCREMENT,
inf_Tipo VARCHAR(45),
inf_Fecha DATETIME,
inf_Content VARCHAR(500),
Tendero_ten_Id INT,
FOREIGN KEY (Tendero_ten_Id) REFERENCES Tendero(ten_Id)
);


SELECT * FROM Tienda;
SELECT * FROM Tendero;
SELECT * FROM Producto;
SELECT * FROM Proveedor;
SELECT * FROM Cliente;
SELECT * FROM Recibo;
SELECT * FROM Informe;
SELECT * FROM Compra;
SELECT * FROM Suministro;
SELECT * FROM Existencia;


DROP TABLE Tienda;
DROP TABLE Tendero;
DROP TABLE Producto;
DROP TABLE Proveedor;
DROP TABLE Cliente;
DROP TABLE Recibo;
DROP TABLE Informe;
DROP TABLE Compra;
DROP TABLE Suministro;
DROP TABLE Existencia;