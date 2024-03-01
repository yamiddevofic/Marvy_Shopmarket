-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: marvy_shopmarket
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `adm_Id` int NOT NULL,
  `adm_Nombre` varchar(70) DEFAULT NULL,
  `adm_Correo` varchar(12) DEFAULT NULL,
  `adm_Celular` varchar(100) DEFAULT NULL,
  `adm_Password` varchar(100) DEFAULT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`adm_Id`,`tiendas_tienda_Id`),
  KEY `fk_tenderos_tiendas1_idx` (`tiendas_tienda_Id`),
  CONSTRAINT `fk_tenderos_tiendas1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `caja`
--

DROP TABLE IF EXISTS `caja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caja` (
  `caja_Id` int NOT NULL,
  `caja_Ingresos` float NOT NULL,
  `caja_Egresos` float NOT NULL,
  `caja_Total` float NOT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`caja_Id`,`tiendas_tienda_Id`),
  KEY `fk_Caja_tiendas1_idx` (`tiendas_tienda_Id`),
  CONSTRAINT `fk_Caja_tiendas1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caja`
--

LOCK TABLES `caja` WRITE;
/*!40000 ALTER TABLE `caja` DISABLE KEYS */;
/*!40000 ALTER TABLE `caja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `fac_Id` int NOT NULL,
  `fac_Datetime` datetime NOT NULL,
  `fac_Tipo` varchar(45) NOT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`fac_Id`,`tiendas_tienda_Id`),
  KEY `fk_factura_tiendas1_idx` (`tiendas_tienda_Id`),
  CONSTRAINT `fk_factura_tiendas1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos`
--

DROP TABLE IF EXISTS `gastos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos` (
  `gastos_Id` int NOT NULL,
  `gastos_Descr` varchar(100) NOT NULL,
  `gastos_Tipo` varchar(45) NOT NULL,
  `gastos_Precio` float NOT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`gastos_Id`,`tiendas_tienda_Id`),
  KEY `fk_gastos_tiendas1_idx` (`tiendas_tienda_Id`),
  CONSTRAINT `fk_gastos_tiendas1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos`
--

LOCK TABLES `gastos` WRITE;
/*!40000 ALTER TABLE `gastos` DISABLE KEYS */;
/*!40000 ALTER TABLE `gastos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `informe`
--

DROP TABLE IF EXISTS `informe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `informe` (
  `inf_Id` int NOT NULL,
  `inf_Datetime` datetime NOT NULL,
  `inf_Tipo` varchar(45) NOT NULL,
  `inf_Doc` longblob NOT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`inf_Id`,`tiendas_tienda_Id`),
  KEY `fk_Informe_tiendas1_idx` (`tiendas_tienda_Id`),
  CONSTRAINT `fk_Informe_tiendas1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informe`
--

LOCK TABLES `informe` WRITE;
/*!40000 ALTER TABLE `informe` DISABLE KEYS */;
/*!40000 ALTER TABLE `informe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `prod_Id` int NOT NULL,
  `prod_Nombre` varchar(70) NOT NULL,
  `prod_Precio` float NOT NULL,
  `prod_Cantidad` int NOT NULL,
  `prod_Categoria` varchar(45) NOT NULL,
  `prod_Total` float NOT NULL,
  `prod_Img` longblob,
  `tenderos_tendero_Id` int NOT NULL,
  `tenderos_tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`prod_Id`,`tenderos_tendero_Id`,`tenderos_tiendas_tienda_Id`),
  KEY `fk_productos_tenderos1_idx` (`tenderos_tendero_Id`,`tenderos_tiendas_tienda_Id`),
  CONSTRAINT `fk_productos_tenderos1` FOREIGN KEY (`tenderos_tendero_Id`, `tenderos_tiendas_tienda_Id`) REFERENCES `tenderos` (`tendero_Id`, `tiendas_tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `prov_Id` int NOT NULL,
  `prov_Nombre` varchar(70) NOT NULL,
  `prov_Ubicacion` varchar(100) NOT NULL,
  `prov_Contacto` varchar(50) NOT NULL,
  PRIMARY KEY (`prov_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suministros`
--

DROP TABLE IF EXISTS `suministros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suministros` (
  `sum_Id` int NOT NULL,
  `sum_Cantidad` int NOT NULL,
  `sum_Datetime` datetime NOT NULL,
  `sum_Metodo_pago` varchar(45) NOT NULL,
  `sum_Total` float NOT NULL,
  `sum_Pago` float NOT NULL,
  `sum_Vueltos` float NOT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`sum_Id`,`tiendas_tienda_Id`),
  KEY `fk_suministros_tiendas1_idx` (`tiendas_tienda_Id`),
  CONSTRAINT `fk_suministros_tiendas1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suministros`
--

LOCK TABLES `suministros` WRITE;
/*!40000 ALTER TABLE `suministros` DISABLE KEYS */;
/*!40000 ALTER TABLE `suministros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suministros_has_proveedores1`
--

DROP TABLE IF EXISTS `suministros_has_proveedores1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suministros_has_proveedores1` (
  `suministros_sum_Id` int NOT NULL,
  `suministros_tiendas_tienda_Id` int NOT NULL,
  `proveedores_prov_Id` int NOT NULL,
  PRIMARY KEY (`suministros_sum_Id`,`suministros_tiendas_tienda_Id`,`proveedores_prov_Id`),
  KEY `fk_suministros_has_proveedores1_proveedores1_idx` (`proveedores_prov_Id`),
  KEY `fk_suministros_has_proveedores1_suministros1_idx` (`suministros_sum_Id`,`suministros_tiendas_tienda_Id`),
  CONSTRAINT `fk_suministros_has_proveedores1_proveedores1` FOREIGN KEY (`proveedores_prov_Id`) REFERENCES `proveedores` (`prov_Id`),
  CONSTRAINT `fk_suministros_has_proveedores1_suministros1` FOREIGN KEY (`suministros_sum_Id`, `suministros_tiendas_tienda_Id`) REFERENCES `suministros` (`sum_Id`, `tiendas_tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suministros_has_proveedores1`
--

LOCK TABLES `suministros_has_proveedores1` WRITE;
/*!40000 ALTER TABLE `suministros_has_proveedores1` DISABLE KEYS */;
/*!40000 ALTER TABLE `suministros_has_proveedores1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenderos`
--

DROP TABLE IF EXISTS `tenderos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenderos` (
  `tendero_Id` int NOT NULL,
  `tendero_Nombre` varchar(70) DEFAULT NULL,
  `tendero_Correo` varchar(12) DEFAULT NULL,
  `tendero_Celular` varchar(100) DEFAULT NULL,
  `tendero_Password` varchar(100) DEFAULT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`tendero_Id`,`tiendas_tienda_Id`),
  KEY `fk_tenderos_tiendas2_idx` (`tiendas_tienda_Id`),
  CONSTRAINT `fk_tenderos_tiendas2` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenderos`
--

LOCK TABLES `tenderos` WRITE;
/*!40000 ALTER TABLE `tenderos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tenderos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiendas`
--

DROP TABLE IF EXISTS `tiendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiendas` (
  `tienda_Id` int NOT NULL,
  `tienda_Nombre` varchar(70) NOT NULL,
  `tienda_Contacto` varchar(50) NOT NULL,
  `tienda_Ubicacion` varchar(100) NOT NULL,
  `tienda_Img` longblob,
  `tienda_Adm` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiendas`
--

LOCK TABLES `tiendas` WRITE;
/*!40000 ALTER TABLE `tiendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tiendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `productos_prod_Id` int NOT NULL,
  `tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`productos_prod_Id`,`tiendas_tienda_Id`),
  KEY `fk_productos_has_tiendas_tiendas1_idx` (`tiendas_tienda_Id`),
  KEY `fk_productos_has_tiendas_productos1_idx` (`productos_prod_Id`),
  CONSTRAINT `fk_productos_has_tiendas_productos1` FOREIGN KEY (`productos_prod_Id`) REFERENCES `productos` (`prod_Id`),
  CONSTRAINT `fk_productos_has_tiendas_tiendas1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `venta_Id` int NOT NULL,
  `venta_Cantidad` int NOT NULL,
  `venta_Metodo` varchar(45) NOT NULL,
  `venta_Datetime` datetime NOT NULL,
  `venta_Total` float NOT NULL,
  `venta_Pago` float NOT NULL,
  `ventas_Vueltos` float NOT NULL,
  `tenderos_tendero_Id` int NOT NULL,
  `tenderos_tiendas_tienda_Id` int NOT NULL,
  PRIMARY KEY (`venta_Id`,`tenderos_tendero_Id`,`tenderos_tiendas_tienda_Id`),
  KEY `fk_ventas_tenderos1_idx` (`tenderos_tendero_Id`,`tenderos_tiendas_tienda_Id`),
  CONSTRAINT `fk_ventas_tenderos1` FOREIGN KEY (`tenderos_tendero_Id`, `tenderos_tiendas_tienda_Id`) REFERENCES `tenderos` (`tendero_Id`, `tiendas_tienda_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-29 14:28:46
