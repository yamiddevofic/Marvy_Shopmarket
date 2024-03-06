
SELECT * FROM tiendas;
SELECT * FROM tenderos;
SELECT * FROM productos;
SELECT * FROM administrador;

DELETE FROM administrador WHERE adm_Id>1;
DELETE FROM tenderos WHERE tendero_Id>1 ;
DELETE FROM tiendas WHERE tienda_Id>1 ;
DELETE FROM productos WHERE tendero_Id > 100;
CREATE DATABASE marvy_shopmarket;
DROP DATABASE marvy_shopmarket;
CREATE TABLE `administrador` (
  `adm_Id` BIGINT NOT NULL,
  `adm_Nombre` varchar(70) DEFAULT NULL,
  `adm_Correo` varchar(100) DEFAULT NULL,
  `adm_Celular` varchar(12) DEFAULT NULL,
  `adm_Password` varchar(100) DEFAULT NULL,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`adm_Id`,`tienda_Id`),
  KEY `fk_tenderos_tiendas1_idx` (`tienda_Id`),
  CONSTRAINT `fk_tenderos_tiendas1` FOREIGN KEY (`tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
);

CREATE TABLE `caja` (
  `caja_Id` BIGINT NOT NULL,
  `caja_Ingresos` float,
  `caja_Egresos` float,
  `caja_Total` float,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`caja_Id`,`tienda_Id`),
  KEY `fk_Caja_tiendas1_idx` (`tienda_Id`),
  CONSTRAINT `fk_Caja_tiendas1` FOREIGN KEY (`tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
);

CREATE TABLE `factura` (
  `fac_Id` BIGINT NOT NULL,
  `fac_Datetime` datetime,
  `fac_Tipo` varchar(45),
  `tienda_Id` BIGINT,
  PRIMARY KEY (`fac_Id`,`tienda_Id`),
  KEY `fk_factura_tiendas1_idx` (`tienda_Id`),
  CONSTRAINT `fk_factura_tiendas1` FOREIGN KEY (`tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
);

CREATE TABLE `gastos` (
  `gastos_Id` BIGINT NOT NULL,
  `gastos_Descr` varchar(100),
  `gastos_Tipo` varchar(45),
  `gastos_Precio` float,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`gastos_Id`,`tienda_Id`),
  KEY `fk_gastos_tiendas1_idx` (`tienda_Id`),
  CONSTRAINT `fk_gastos_tiendas1` FOREIGN KEY (`tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
);

CREATE TABLE `informe` (
  `inf_Id` BIGINT NOT NULL,
  `inf_Datetime` datetime,
  `inf_Tipo` varchar(45),
  `inf_Doc` longblob,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`inf_Id`,`tienda_Id`),
  KEY `fk_Informe_tiendas1_idx` (`tienda_Id`),
  CONSTRAINT `fk_Informe_tiendas1` FOREIGN KEY (`tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
);

CREATE TABLE `productos` (
  `Id` BIGINT NOT NULL auto_increment,
  `prod_Id` BIGINT,
  `prod_Nombre` varchar(70),
  `prod_Precio` float,
  `prod_Cantidad` int,
  `prod_Categoria` varchar(45),
  `prod_Total` float,
  `prod_Img` longblob,
  `tendero_Id` BIGINT,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`Id`,`tendero_Id`,`tienda_Id`),
  KEY `fk_productos_tenderos1_idx` (`tendero_Id`,`tienda_Id`),
  CONSTRAINT `fk_productos_tenderos1` FOREIGN KEY (`tendero_Id`, `tienda_Id`) REFERENCES `tenderos` (`tendero_Id`, `tienda_Id`)
);

CREATE TABLE `proveedores` (
  `prov_Id` BIGINT NOT NULL,
  `prov_Nombre` varchar(70),
  `prov_Ubicacion` varchar(100),
  `prov_Contacto` varchar(50),
  PRIMARY KEY (`prov_Id`)
);

CREATE TABLE `suministros` (
  `sum_Id` BIGINT NOT NULL,
  `sum_Cantidad` int,
  `sum_Datetime` datetime,
  `sum_Metodo_pago` varchar(45),
  `sum_Total` float,
  `sum_Pago` float,
  `sum_Vueltos` float,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`sum_Id`,`tienda_Id`),
  KEY `fk_suministros_tiendas1_idx` (`tienda_Id`),
  CONSTRAINT `fk_suministros_tiendas1` FOREIGN KEY (`tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
);

CREATE TABLE `suministros_has_proveedores` (
  `Id` BIGINT  NOT NULL,
  `sum_Id` BIGINT,
  `tienda_Id` BIGINT,
  `prov_Id` BIGINT,
  PRIMARY KEY (`Id`,`sum_Id`,`tienda_Id`,`prov_Id`),
  KEY `fk_suministros_has_proveedores1_proveedores1_idx` (`prov_Id`),
  KEY `fk_suministros_has_proveedores1_suministros1_idx` (`sum_Id`,`tienda_Id`),
  CONSTRAINT `fk_suministros_has_proveedores1_proveedores1` FOREIGN KEY (`prov_Id`) REFERENCES `proveedores` (`prov_Id`),
  CONSTRAINT `fk_suministros_has_proveedores1_suministros1` FOREIGN KEY (`sum_Id`, `tienda_Id`) REFERENCES `suministros` (`sum_Id`, `tienda_Id`)
);

ALTER TABLE suministros_has_proveedores1 RENAME suministros_has_proveedores;

CREATE TABLE `tiendas` (
  `tienda_Id` BIGINT NOT NULL,
  `tienda_Nombre` varchar(70),
  `tienda_Correo` varchar(100) DEFAULT NULL,
  `tienda_Celular` varchar(12) DEFAULT NULL,
  `tienda_Ubicacion` varchar(100),
  `tienda_Img` longblob,
  PRIMARY KEY (`tienda_Id`)
);


CREATE TABLE `tenderos` (
  `tendero_Id` BIGINT NOT NULL,
  `tendero_Nombre` varchar(70) DEFAULT NULL,
  `tendero_Correo` varchar(100) DEFAULT NULL,
  `tendero_Celular` varchar(12) DEFAULT NULL,
  `tendero_Password` varchar(100) DEFAULT NULL,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`tendero_Id`,`tienda_Id`),
  KEY `fk_tenderos_tiendas2_idx` (`tienda_Id`),
  CONSTRAINT `fk_tenderos_tiendas2` FOREIGN KEY (`tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
);

CREATE TABLE `ventas` (
  `venta_Id` BIGINT NOT NULL,
  `venta_Cantidad` int,
  `venta_Metodo` varchar(45),
  `venta_Datetime` datetime,
  `venta_Total` float,
  `venta_Pago` float,
  `ventas_Vueltos` float,
  `tendero_Id` BIGINT,
  `tienda_Id` BIGINT,
  PRIMARY KEY (`venta_Id`,`tendero_Id`,`tienda_Id`),
  KEY `fk_ventas_tenderos1_idx` (`tendero_Id`,`tienda_Id`),
  CONSTRAINT `fk_ventas_tenderos1` FOREIGN KEY (`tendero_Id`, `tienda_Id`) REFERENCES `tenderos` (`tendero_Id`, `tienda_Id`)
);
