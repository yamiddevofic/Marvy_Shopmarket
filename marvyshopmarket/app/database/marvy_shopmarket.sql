-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema marvy_shopmarket
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema marvy_shopmarket
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `marvy_shopmarket` DEFAULT CHARACTER SET utf8mb4 ;
USE `marvy_shopmarket` ;
DROP DATABASE marvy_shopmarket;

-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`tiendas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`tiendas` (
  `tienda_Id` BIGINT(20) NOT NULL,
  `tienda_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `tienda_Correo` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Celular` VARCHAR(12) NULL DEFAULT NULL,
  `tienda_Ubicacion` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Img` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`administrador` (
  `adm_Id` BIGINT(20) NOT NULL,
  `adm_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `adm_Correo` VARCHAR(100) NULL DEFAULT NULL,
  `adm_Celular` VARCHAR(12) NULL DEFAULT NULL,
  `adm_Password` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`adm_Id`, `tienda_Id`),
    FOREIGN KEY (`tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`));


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`caja`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`caja` (
  `caja_Id` BIGINT(20) NOT NULL,
  `caja_Ingresos` FLOAT NULL DEFAULT NULL,
  `caja_Egresos` FLOAT NULL DEFAULT NULL,
  `caja_Total` FLOAT NULL DEFAULT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`caja_Id`, `tienda_Id`),
    FOREIGN KEY (`tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`factura` (
  `fac_Id` BIGINT(20) NOT NULL,
  `fac_Datetime` DATETIME NULL DEFAULT NULL,
  `fac_Tipo` VARCHAR(45) NULL DEFAULT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`fac_Id`, `tienda_Id`),
    FOREIGN KEY (`tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`gastos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`gastos` (
  `gastos_Id` BIGINT(20) NOT NULL,
  `gastos_Descr` VARCHAR(100) NULL DEFAULT NULL,
  `gastos_Tipo` VARCHAR(45) NULL DEFAULT NULL,
  `gastos_Precio` FLOAT NULL DEFAULT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`gastos_Id`, `tienda_Id`),
    FOREIGN KEY (`tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`informe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`informe` (
  `inf_Id` BIGINT(20) NOT NULL,
  `inf_Datetime` DATETIME NULL DEFAULT NULL,
  `inf_Tipo` VARCHAR(45) NULL DEFAULT NULL,
  `inf_Doc` LONGBLOB NULL DEFAULT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`inf_Id`, `tienda_Id`),
    FOREIGN KEY (`tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`tenderos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`tenderos` (
  `tendero_Id` BIGINT(20) NOT NULL,
  `tendero_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `tendero_Correo` VARCHAR(100) NULL DEFAULT NULL,
  `tendero_Celular` VARCHAR(12) NULL DEFAULT NULL,
  `tendero_Password` VARCHAR(100) NULL DEFAULT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`tendero_Id`, `tienda_Id`),
    FOREIGN KEY (`tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`productos` (
  `Id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `prod_Id` BIGINT(20) NULL DEFAULT NULL,
  `prod_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `prod_Precio` FLOAT NULL DEFAULT NULL,
  `prod_Ganancia` FLOAT NULL DEFAULT NULL,
  `prod_TotalPrecio` FLOAT GENERATED ALWAYS AS (prod_Precio * (prod_Ganancia / 100) + prod_Precio) VIRTUAL,
  `prod_Cantidad` INT(11) NULL DEFAULT NULL,
  `prod_Categoria` VARCHAR(45) NULL DEFAULT NULL,
  `prod_Total` FLOAT GENERATED ALWAYS AS (prod_Precio * prod_Cantidad) VIRTUAL,
  `prod_TotalGana` FLOAT GENERATED ALWAYS AS (prod_TotalPrecio * prod_Cantidad) VIRTUAL,
  `prod_Img` LONGBLOB NULL DEFAULT NULL,
  `tendero_Id` BIGINT(20) NOT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`Id`, `tendero_Id`, `tienda_Id`),
    FOREIGN KEY (`tendero_Id` , `tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tenderos` (`tendero_Id` , `tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`proveedores` (
  `prov_Id` BIGINT(20) NOT NULL,
  `prov_Nombre` VARCHAR(70) NULL DEFAULT NULL,
  `prov_Ubicacion` VARCHAR(100) NULL DEFAULT NULL,
  `prov_Contacto` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`prov_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`suministros`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`suministros` (
  `sum_Id` BIGINT(20) NOT NULL,
  `sum_Cantidad` INT(11) NULL DEFAULT NULL,
  `sum_Datetime` DATETIME NULL DEFAULT NULL,
  `sum_Metodo_pago` VARCHAR(45) NULL DEFAULT NULL,
  `sum_Total` FLOAT NULL DEFAULT NULL,
  `sum_Pago` FLOAT NULL DEFAULT NULL,
  `sum_Vueltos` FLOAT NULL DEFAULT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`sum_Id`, `tienda_Id`),
    FOREIGN KEY (`tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tiendas` (`tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`suministros_has_proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`suministros_has_proveedores` (
  `Id` BIGINT(20) NOT NULL,
  `sum_Id` BIGINT(20) NOT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  `prov_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`Id`, `sum_Id`, `tienda_Id`, `prov_Id`),
    FOREIGN KEY (`prov_Id`)
    REFERENCES `marvy_shopmarket`.`proveedores` (`prov_Id`),
    FOREIGN KEY (`sum_Id` , `tienda_Id`)
    REFERENCES `marvy_shopmarket`.`suministros` (`sum_Id` , `tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`ventas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`ventas` (
  `venta_Id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `venta_Cantidad` INT(11) NULL DEFAULT NULL,
  `venta_Metodo` VARCHAR(45) NULL DEFAULT NULL,
  `venta_Datetime` DATETIME NULL DEFAULT NULL,
  `venta_Total` FLOAT NULL DEFAULT NULL,
  `venta_Pago` FLOAT NULL DEFAULT NULL,
  `venta_Vueltos` FLOAT NULL DEFAULT NULL,
  `tendero_Id` BIGINT(20) NOT NULL,
  `tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`venta_Id`, `tendero_Id`, `tienda_Id`),
    FOREIGN KEY (`tendero_Id` , `tienda_Id`)
    REFERENCES `marvy_shopmarket`.`tenderos` (`tendero_Id` , `tienda_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`ventas_has_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`ventas_has_productos` (
  `ventas_venta_Id` BIGINT(20) NOT NULL,
  `ventas_tendero_Id` BIGINT(20) NOT NULL,
  `ventas_tienda_Id` BIGINT(20) NOT NULL,
  `productos_Id` BIGINT(20) NOT NULL,
  `productos_tendero_Id` BIGINT(20) NOT NULL,
  `productos_tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`ventas_venta_Id`, `ventas_tendero_Id`, `ventas_tienda_Id`, `productos_Id`, `productos_tendero_Id`, `productos_tienda_Id`),
    FOREIGN KEY (`ventas_venta_Id` , `ventas_tendero_Id` , `ventas_tienda_Id`)
    REFERENCES `marvy_shopmarket`.`ventas` (`venta_Id` , `tendero_Id` , `tienda_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`productos_Id` , `productos_tendero_Id` , `productos_tienda_Id`)
    REFERENCES `marvy_shopmarket`.`productos` (`Id` , `tendero_Id` , `tienda_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `marvy_shopmarket`.`suministros_has_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marvy_shopmarket`.`suministros_has_productos` (
  `suministros_sum_Id` BIGINT(20) NOT NULL,
  `suministros_tienda_Id` BIGINT(20) NOT NULL,
  `productos_Id` BIGINT(20) NOT NULL,
  `productos_tendero_Id` BIGINT(20) NOT NULL,
  `productos_tienda_Id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`suministros_sum_Id`, `suministros_tienda_Id`, `productos_Id`, `productos_tendero_Id`, `productos_tienda_Id`),
    FOREIGN KEY (`suministros_sum_Id` , `suministros_tienda_Id`)
    REFERENCES `marvy_shopmarket`.`suministros` (`sum_Id` , `tienda_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`productos_Id` , `productos_tendero_Id` , `productos_tienda_Id`)
    REFERENCES `marvy_shopmarket`.`productos` (`Id` , `tendero_Id` , `tienda_Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

USE `marvy_shopmarket` ;

-- -----------------------------------------------------
-- procedure eliminar_ventas_y_reiniciar_id
-- -----------------------------------------------------

DELIMITER $$
USE `marvy_shopmarket`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `eliminar_ventas_y_reiniciar_id`()
BEGIN
    DELETE FROM ventas;
    ALTER TABLE clientes AUTO_INCREMENT = 1;
END$$

DELIMITER ;
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
