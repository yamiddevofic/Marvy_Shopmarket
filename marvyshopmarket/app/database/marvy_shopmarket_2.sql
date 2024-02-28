CREATE DATABASE  IF NOT EXISTS `marvy_shopmarket` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `marvy_shopmarket`;
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
-- Table structure for table `caja`
--

DROP TABLE IF EXISTS `caja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caja` (
  `caja_ID` int DEFAULT NULL,
  `caja_Ingresos` float DEFAULT NULL,
  `caja_Egresos` float DEFAULT NULL,
  `caja_Total` float DEFAULT NULL,
  `tendero_Id` int DEFAULT NULL,
  KEY `tendero_Id` (`tendero_Id`),
  CONSTRAINT `caja_ibfk_1` FOREIGN KEY (`tendero_Id`) REFERENCES `tenderos` (`tendero_ID`)
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
-- Table structure for table `facturas`
--

DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
  `fac_Id` int DEFAULT NULL,
  `fac_Datetime` datetime DEFAULT NULL,
  `fac_Tipo` varchar(45) DEFAULT NULL,
  `tendero_Id` int DEFAULT NULL,
  KEY `tendero_Id` (`tendero_Id`),
  CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`tendero_Id`) REFERENCES `tenderos` (`tendero_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas`
--

LOCK TABLES `facturas` WRITE;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos`
--

DROP TABLE IF EXISTS `gastos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos` (
  `gastos_Id` int NOT NULL,
  `gastos_Descr` varchar(100) DEFAULT NULL,
  `gastos_Tipo` varchar(45) DEFAULT NULL,
  `gastos_Precio` float DEFAULT NULL,
  `tendero_ID` int DEFAULT NULL,
  PRIMARY KEY (`gastos_Id`),
  KEY `tendero_ID` (`tendero_ID`),
  CONSTRAINT `gastos_ibfk_1` FOREIGN KEY (`tendero_ID`) REFERENCES `tenderos` (`tendero_ID`)
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
-- Table structure for table `informes`
--

DROP TABLE IF EXISTS `informes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `informes` (
  `inf_Id` int NOT NULL,
  `inf_Datetime` datetime DEFAULT NULL,
  `inf_Tipo` varchar(45) DEFAULT NULL,
  `inf_Doc` longblob,
  `tendero_Id` int DEFAULT NULL,
  PRIMARY KEY (`inf_Id`),
  KEY `tendero_Id` (`tendero_Id`),
  CONSTRAINT `informes_ibfk_1` FOREIGN KEY (`tendero_Id`) REFERENCES `tenderos` (`tendero_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informes`
--

LOCK TABLES `informes` WRITE;
/*!40000 ALTER TABLE `informes` DISABLE KEYS */;
/*!40000 ALTER TABLE `informes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `prod_Id` int NOT NULL,
  `prod_Nombre` varchar(70) DEFAULT NULL,
  `prod_Precio` float DEFAULT NULL,
  `prod_Cantidad` int DEFAULT NULL,
  `prod_Categoria` varchar(45) DEFAULT NULL,
  `prod_Total` float GENERATED ALWAYS AS ((`prod_Precio` * `prod_Cantidad`)) VIRTUAL,
  `prod_Img` longblob,
  PRIMARY KEY (`prod_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `prov_Id` int DEFAULT NULL,
  `prov_Nombre` varchar(70) DEFAULT NULL,
  `prov_Ubicacion` varchar(100) DEFAULT NULL,
  `prov_Contacto` varchar(50) DEFAULT NULL,
  KEY `idx_prov_Id` (`prov_Id`)
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
-- Table structure for table `suministro_proveedor`
--

DROP TABLE IF EXISTS `suministro_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suministro_proveedor` (
  `sum_ID` int DEFAULT NULL,
  `prov_ID` int DEFAULT NULL,
  KEY `sum_ID` (`sum_ID`),
  KEY `prov_ID` (`prov_ID`),
  CONSTRAINT `suministro_proveedor_ibfk_1` FOREIGN KEY (`sum_ID`) REFERENCES `suministros` (`sum_ID`),
  CONSTRAINT `suministro_proveedor_ibfk_2` FOREIGN KEY (`prov_ID`) REFERENCES `proveedores` (`prov_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suministro_proveedor`
--

LOCK TABLES `suministro_proveedor` WRITE;
/*!40000 ALTER TABLE `suministro_proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `suministro_proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suministros`
--

DROP TABLE IF EXISTS `suministros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suministros` (
  `sum_ID` int NOT NULL,
  `sum_Cantidad` int DEFAULT NULL,
  `sum_Datetime` datetime DEFAULT NULL,
  `sum_Metodo_pago` varchar(45) DEFAULT NULL,
  `sum_Total` float DEFAULT NULL,
  `sum_Pago` float DEFAULT NULL,
  `sum_Vueltos` float DEFAULT NULL,
  PRIMARY KEY (`sum_ID`)
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
-- Table structure for table `tenderos`
--

DROP TABLE IF EXISTS `tenderos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenderos` (
  `tendero_ID` int NOT NULL,
  `tendero_Password` varchar(255) DEFAULT NULL,
  `tendero_Nombre` varchar(70) DEFAULT NULL,
  `tendero_Contacto` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`tendero_ID`)
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
  `tienda_Password` varchar(255) NOT NULL,
  `tienda_Nombre` varchar(70) NOT NULL,
  `tienda_Contacto` varchar(50) NOT NULL,
  `tienda_Ubicacion` varchar(100) NOT NULL,
  `tienda_IMG` longblob,
  `tendero_Id` int DEFAULT NULL,
  `prod_Id` int DEFAULT NULL,
  `sum_Id` int DEFAULT NULL,
  PRIMARY KEY (`tienda_Id`),
  KEY `tendero_Id` (`tendero_Id`),
  KEY `prod_Id` (`prod_Id`),
  KEY `sum_Id` (`sum_Id`),
  CONSTRAINT `tiendas_ibfk_1` FOREIGN KEY (`tendero_Id`) REFERENCES `tenderos` (`tendero_ID`),
  CONSTRAINT `tiendas_ibfk_2` FOREIGN KEY (`prod_Id`) REFERENCES `productos` (`prod_Id`),
  CONSTRAINT `tiendas_ibfk_3` FOREIGN KEY (`sum_Id`) REFERENCES `suministros` (`sum_ID`)
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
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `venta_Id` int DEFAULT NULL,
  `venta_Cantidad` int DEFAULT NULL,
  `venta_Metodo` varchar(45) DEFAULT NULL,
  `venta_Datetime` datetime DEFAULT NULL,
  `venta_Total` float DEFAULT NULL,
  `venta_Pago` float DEFAULT NULL,
  `venta_Vueltos` float DEFAULT NULL,
  `tendero_Id` int DEFAULT NULL,
  KEY `tendero_Id` (`tendero_Id`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`tendero_Id`) REFERENCES `tenderos` (`tendero_ID`)
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

-- Dump completed on 2024-02-25  0:10:27
