-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema marvy_shopmarket
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema marvy_shopmarket
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `marvy_shopmarket` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `marvy_shopmarket` ;

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`tiendas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`tiendas` (
  `tienda_Id` BIGINT NOT NULL,
  `tienda_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `tienda_Correo` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Celular` VARCHAR(12) NULL DEFAULT NULL,
  `tienda_Ubicacion` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Img` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`administrador` (
  `adm_Id` BIGINT NOT NULL,
  `adm_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `adm_Correo` VARCHAR(100) NULL DEFAULT NULL,
  `adm_Celular` VARCHAR(12) NULL DEFAULT NULL,
  `adm_Password` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`adm_Id`, `tienda_Id`),
  INDEX `tienda_Id` (`tienda_Id` ASC) VISIBLE,
  CONSTRAINT `administrador_ibfk_1`
    FOREIGN KEY (`tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


=======
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));
    
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98
-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`caja`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`caja` (
  `caja_Id` BIGINT NOT NULL,
  `caja_Ingresos` FLOAT NULL DEFAULT NULL,
  `caja_Egresos` FLOAT NULL DEFAULT NULL,
  `caja_Total` FLOAT NULL DEFAULT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`caja_Id`, `tienda_Id`),
  INDEX `tienda_Id` (`tienda_Id` ASC) VISIBLE,
  CONSTRAINT `caja_ibfk_1`
    FOREIGN KEY (`tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

=======
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`factura` (
  `fac_Id` BIGINT NOT NULL,
  `fac_Datetime` DATETIME NULL DEFAULT NULL,
  `fac_Tipo` VARCHAR(45) NULL DEFAULT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`fac_Id`, `tienda_Id`),
  INDEX `tienda_Id` (`tienda_Id` ASC) VISIBLE,
  CONSTRAINT `factura_ibfk_1`
    FOREIGN KEY (`tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

=======
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`gastos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`gastos` (
  `gastos_Id` BIGINT NOT NULL,
  `gastos_Descr` VARCHAR(100) NULL DEFAULT NULL,
  `gastos_Tipo` VARCHAR(45) NULL DEFAULT NULL,
  `gastos_Precio` FLOAT NULL DEFAULT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`gastos_Id`, `tienda_Id`),
  INDEX `tienda_Id` (`tienda_Id` ASC) VISIBLE,
  CONSTRAINT `gastos_ibfk_1`
    FOREIGN KEY (`tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

=======
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`informe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`informe` (
  `inf_Id` BIGINT NOT NULL,
  `inf_Datetime` DATETIME NULL DEFAULT NULL,
  `inf_Tipo` VARCHAR(45) NULL DEFAULT NULL,
  `inf_Doc` LONGBLOB NULL DEFAULT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`inf_Id`, `tienda_Id`),
  INDEX `tienda_Id` (`tienda_Id` ASC) VISIBLE,
  CONSTRAINT `informe_ibfk_1`
    FOREIGN KEY (`tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

=======
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`tenderos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`tenderos` (
  `tendero_Id` BIGINT NOT NULL,
  `tendero_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `tendero_Correo` VARCHAR(100) NULL DEFAULT NULL,
  `tendero_Celular` VARCHAR(12) NULL DEFAULT NULL,
  `tendero_Password` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`tendero_Id`, `tienda_Id`),
  INDEX `tienda_Id` (`tienda_Id` ASC) VISIBLE,
  CONSTRAINT `tenderos_ibfk_1`
    FOREIGN KEY (`tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

=======
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`productos` (
  `Id` BIGINT NOT NULL AUTO_INCREMENT,
  `prod_Id` BIGINT NULL DEFAULT NULL,
  `prod_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `prod_Precio` FLOAT NULL DEFAULT NULL,
  `prod_Ganancia` FLOAT NULL DEFAULT NULL,
  `prod_TotalPrecio` FLOAT GENERATED ALWAYS AS (((`prod_Precio` * (`prod_Ganancia` / 100)) + `prod_Precio`)) VIRTUAL,
  `prod_Cantidad` INT NULL DEFAULT NULL,
  `prod_Categoria` VARCHAR(45) NULL DEFAULT NULL,
  `prod_Total` FLOAT GENERATED ALWAYS AS ((`prod_Precio` * `prod_Cantidad`)) VIRTUAL,
  `prod_TotalGana` FLOAT GENERATED ALWAYS AS ((`prod_TotalPrecio` * `prod_Cantidad`)) VIRTUAL,
  `prod_Img` LONGBLOB NULL DEFAULT NULL,
  `tendero_Id` BIGINT NOT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`Id`, `tendero_Id`, `tienda_Id`),
  INDEX `tendero_Id` (`tendero_Id` ASC, `tienda_Id` ASC) VISIBLE,
  CONSTRAINT `productos_ibfk_1`
    FOREIGN KEY (`tendero_Id` , `tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tenderos` (`tendero_Id` , `tienda_Id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

=======
    REFERENCES `marvy_shopmarket`.`tenderos` (`tendero_Id` , `tienda_Id`));
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`proveedores` (
<<<<<<< HEAD
  `id` BIGINT NOT NULL AUTO_INCREMENT,
=======
  `id` BIGINT NOT NULL AUTO_INCREMENT ,
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98
  `prov_Id` VARCHAR(50) NULL DEFAULT NULL,
  `prov_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `prov_Ubicacion` VARCHAR(100) NULL DEFAULT NULL,
  `prov_Contacto` VARCHAR(50) NULL DEFAULT NULL,
<<<<<<< HEAD
  `prov_prod_nom` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


=======
  `prov_prod_nom` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));
DROP TABLE proveedores;
DROP TABLE suministros_has_proveedores;
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98
-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`suministros`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`suministros` (
  `sum_Id` BIGINT NOT NULL,
  `sum_prod_Nom` VARCHAR(50) NULL DEFAULT NULL,
  `sum_Cantidad` INT NULL DEFAULT NULL,
  `sum_Datetime` DATETIME NULL DEFAULT NULL,
  `sum_Metodo_pago` VARCHAR(45) NULL DEFAULT NULL,
  `sum_Total` FLOAT NULL DEFAULT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`sum_Id`, `tienda_Id`),
  INDEX `tienda_Id` (`tienda_Id` ASC) VISIBLE,
  CONSTRAINT `suministros_ibfk_1`
    FOREIGN KEY (`tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
alter table suministros change column  `sum_Id` sum_Id bigint auto_increment;
=======
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`suministros_has_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`suministros_has_productos` (
  `suministros_sum_Id` BIGINT NOT NULL,
  `suministros_tienda_Id` BIGINT NOT NULL,
  `productos_Id` BIGINT NOT NULL,
  `productos_tendero_Id` BIGINT NOT NULL,
  `productos_tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`suministros_sum_Id`, `suministros_tienda_Id`, `productos_Id`, `productos_tendero_Id`, `productos_tienda_Id`),
  INDEX `productos_Id` (`productos_Id` ASC, `productos_tendero_Id` ASC, `productos_tienda_Id` ASC) VISIBLE,
  CONSTRAINT `suministros_has_productos_ibfk_1`
    FOREIGN KEY (`suministros_sum_Id` , `suministros_tienda_Id`)
    REFERENCES `marvy_shopmarket`.`suministros` (`sum_Id` , `tienda_Id`),
  CONSTRAINT `suministros_has_productos_ibfk_2`
    FOREIGN KEY (`productos_Id` , `productos_tendero_Id` , `productos_tienda_Id`)
<<<<<<< HEAD
    REFERENCES `marvy_shopmarket`.`productos` (`Id` , `tendero_Id` , `tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

ALTER TABLE suministros_has_productos
DROP FOREIGN KEY suministros_has_productos_ibfk_1;

ALTER TABLE suministros
MODIFY COLUMN sum_Id bigint AUTO_INCREMENT;

ALTER TABLE suministros_has_productos
ADD CONSTRAINT fk_sum_Id
FOREIGN KEY (`suministros_sum_Id`) REFERENCES suministros(`sum_Id`);
-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`suministros_has_proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`suministros_has_proveedores` (
  `Id` BIGINT NOT NULL,
  `sum_Id` BIGINT NOT NULL,
  `tienda_Id` BIGINT NOT NULL,
  `prov_Id` BIGINT NOT NULL,
  PRIMARY KEY (`Id`, `sum_Id`, `tienda_Id`, `prov_Id`),
  INDEX `prov_Id` (`prov_Id` ASC) VISIBLE,
  CONSTRAINT `suministros_has_proveedores_ibfk_1`
    FOREIGN KEY (`prov_Id`)
    REFERENCES `marvy_shopmarket`.`proveedores` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


=======
    REFERENCES `marvy_shopmarket`.`productos` (`Id` , `tendero_Id` , `tienda_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98
-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`ventas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`ventas` (
  `venta_Id` BIGINT NOT NULL AUTO_INCREMENT,
  `venta_Cantidad` INT NULL DEFAULT NULL,
  `venta_Metodo` VARCHAR(45) NULL DEFAULT NULL,
  `venta_Datetime` DATETIME NULL DEFAULT NULL,
  `venta_Total` FLOAT NULL DEFAULT NULL,
  `venta_Pago` FLOAT NULL DEFAULT NULL,
  `venta_Vueltos` FLOAT NULL DEFAULT NULL,
  `tendero_Id` BIGINT NOT NULL,
  `tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`venta_Id`, `tendero_Id`, `tienda_Id`),
  INDEX `tendero_Id` (`tendero_Id` ASC, `tienda_Id` ASC) VISIBLE,
  CONSTRAINT `ventas_ibfk_1`
    FOREIGN KEY (`tendero_Id` , `tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tenderos` (`tendero_Id` , `tienda_Id`))
ENGINE = InnoDB
<<<<<<< HEAD
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

=======
DEFAULT CHARACTER SET = utf8mb4;
DELETE FROM productos WHERE Id>1;
DELETE FROM ventas_has_productos WHERE productos_Id>1;
SELECT * FROM productos;
SELECT * FROM ventas;
>>>>>>> 7b9b78b5c7202d8f0bf8f0434c7df3b58fddfa98

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`ventas_has_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`ventas_has_productos` (
  `ventas_venta_Id` BIGINT NOT NULL,
  `ventas_tendero_Id` BIGINT NOT NULL,
  `ventas_tienda_Id` BIGINT NOT NULL,
  `productos_Id` BIGINT NOT NULL,
  `productos_tendero_Id` BIGINT NOT NULL,
  `productos_tienda_Id` BIGINT NOT NULL,
  PRIMARY KEY (`ventas_venta_Id`, `ventas_tendero_Id`, `ventas_tienda_Id`, `productos_Id`, `productos_tendero_Id`, `productos_tienda_Id`),
  INDEX `productos_Id` (`productos_Id` ASC, `productos_tendero_Id` ASC, `productos_tienda_Id` ASC) VISIBLE,
  CONSTRAINT `ventas_has_productos_ibfk_1`
    FOREIGN KEY (`ventas_venta_Id` , `ventas_tendero_Id` , `ventas_tienda_Id`)
    REFERENCES `marvy_shopmarket`.`ventas` (`venta_Id` , `tendero_Id` , `tienda_Id`),
  CONSTRAINT `ventas_has_productos_ibfk_2`
    FOREIGN KEY (`productos_Id` , `productos_tendero_Id` , `productos_tienda_Id`)
    REFERENCES `marvy_shopmarket`.`productos` (`Id` , `tendero_Id` , `tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `marvy_shopmarket`;

DELIMITER $$
USE `marvy_shopmarket`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `marvy_shopmarket`.`eliminar_ventas_y_reiniciar_id`
AFTER DELETE ON `marvy_shopmarket`.`ventas`
FOR EACH ROW
BEGIN
    CALL eliminar_ventas_y_reiniciar_id();
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
