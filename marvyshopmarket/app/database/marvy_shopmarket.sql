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
-- Table structure for table `informes`
--

DROP TABLE IF EXISTS `informes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `informes` (
  `inf_Id` int NOT NULL,
  `inf_Dateime` datetime DEFAULT NULL,
  `inf_Tipo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`inf_Id`)
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
  `prod_Nombre` varchar(65) DEFAULT NULL,
  `prod_Precio` float DEFAULT NULL,
  `prod_Cantidad` int DEFAULT NULL,
  `prod_Total` float GENERATED ALWAYS AS ((`prod_Precio` * `prod_Cantidad`)) VIRTUAL,
  `prod_Img` longblob,
  PRIMARY KEY (`prod_Id`)
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
-- Table structure for table `suministros`
--

DROP TABLE IF EXISTS `suministros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suministros` (
  `sum_Id` int NOT NULL,
  `sum_Cantidad` int DEFAULT NULL,
  `sum_Datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`sum_Id`)
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
-- Table structure for table `tiendas`
--

DROP TABLE IF EXISTS `tiendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiendas` (
  `tienda_Id` int NOT NULL,
  `tienda_Nombre` varchar(45) DEFAULT NULL,
  `tienda_Tel` varchar(20) DEFAULT NULL,
  `tienda_Ubicacion` varchar(100) DEFAULT NULL,
  `tienda_total_dia` float DEFAULT NULL,
  `suministros_sum_Id` int DEFAULT NULL,
  `productos_prod_Id` int DEFAULT NULL,
  `ventas_venta_Id` int DEFAULT NULL,
  `informes_inf_Id` int DEFAULT NULL,
  PRIMARY KEY (`tienda_Id`),
  KEY `suministros_sum_Id` (`suministros_sum_Id`),
  KEY `productos_prod_Id` (`productos_prod_Id`),
  KEY `ventas_venta_Id` (`ventas_venta_Id`),
  KEY `informes_inf_Id` (`informes_inf_Id`),
  CONSTRAINT `tiendas_ibfk_1` FOREIGN KEY (`suministros_sum_Id`) REFERENCES `suministros` (`sum_Id`),
  CONSTRAINT `tiendas_ibfk_2` FOREIGN KEY (`productos_prod_Id`) REFERENCES `productos` (`prod_Id`),
  CONSTRAINT `tiendas_ibfk_3` FOREIGN KEY (`ventas_venta_Id`) REFERENCES `ventas` (`venta_Id`),
  CONSTRAINT `tiendas_ibfk_4` FOREIGN KEY (`informes_inf_Id`) REFERENCES `informes` (`inf_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiendas`
--

LOCK TABLES `tiendas` WRITE;
/*!40000 ALTER TABLE `tiendas` DISABLE KEYS */;
INSERT INTO `tiendas` VALUES (1005060791,'Marvy Shopmarket','3202808299','Pamplona',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tiendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `user_Id` int NOT NULL AUTO_INCREMENT,
  `user_Nombre` varchar(45) DEFAULT NULL,
  `user_Correo` varchar(50) DEFAULT NULL,
  `user_Password` varchar(12) DEFAULT NULL,
  `tiendas_tienda_Id` int DEFAULT NULL,
  PRIMARY KEY (`user_Id`),
  KEY `tiendas_tienda_Id` (`tiendas_tienda_Id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`tiendas_tienda_Id`) REFERENCES `tiendas` (`tienda_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (2,'yamidtarot','horaciohabbos@gmail.com','$2b$12$d9Vdj',1005060791);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `venta_Id` int NOT NULL,
  `venta_Cantidad` int DEFAULT NULL,
  `venta_Metodo` varchar(45) DEFAULT NULL,
  `venta_Datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`venta_Id`)
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

-- Dump completed on 2024-02-23  2:29:00
