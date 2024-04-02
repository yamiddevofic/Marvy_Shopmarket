-- crear tabla 
create database tienda_online_D;
-- usar base de datos 
use tienda_online_D;
-- crear tablas 
create table cliente (
Id_cliente int primary key auto_increment,
nombre varchar (100),
email varchar (100),
telefono varchar (20)
);

create table producto (
Id_producto int primary key auto_increment,
nombre varchar (100),
descripcion text,
precio float (10,2),
cantidad_stock int
);

Create table categoria(
Id_categoria int primary key auto_increment,
nombre varchar (100)
);

create table producto_categoria(
Id_producto int not null,
Id_categoria int not null,
foreign key (Id_producto) references producto(Id_producto),
foreign key (Id_categoria) references categoria (Id_categoria)
);

Create table pedido (
Id_pedido int primary key auto_increment,
id_cliente int not null,
fecha_pedido date,
total_pedido float (10,2),
foreign key (Id_cliente) references Cliente(Id_cliente)
);

create table detalle_pedido(
Id_detalle int primary key auto_increment,
Id_pedido int not null,
Id_producto int not null,
cantidad int,
precio_unitario float (10,2),
subtotal float (10,2),
foreign key (Id_pedido) references pedido (Id_pedido),
foreign key (Id_producto) references producto(Id_producto)
);

Create table comentario (
Id_comentario int primary key auto_increment,
Id_producto int not null,
Id_cliente int not null,
comentario text,
fecha_comentario timestamp default now(),
Foreign key (Id_producto) references Producto (Id_producto),
foreign key (Id_cliente) references Cliente(Id_cliente)
);

-- Inserción de datos en la tabla de productos
INSERT INTO producto (nombre, descripcion, precio, cantidad_stock) VALUES
('Camiseta de algodón', 'Camiseta básica de algodón para hombre', 15.99, 100),
('Pantalones vaqueros', 'Pantalones vaqueros ajustados para mujer', 29.99, 75),
('Zapatos deportivos', 'Zapatos deportivos ligeros para correr', 49.99, 50),
('Teléfono móvil', 'Teléfono inteligente con pantalla táctil', 399.99, 30),
('Reloj de pulsera', 'Reloj de pulsera analógico resistente al agua', 79.99, 20),
('Portátil', 'Ordenador portátil de última generación', 899.99, 15),
('Tableta', 'Tableta con pantalla táctil de alta resolución', 299.99, 25),
('Gafas de sol', 'Gafas de sol polarizadas con montura de metal', 39.99, 40),
('Mochila', 'Mochila resistente con múltiples compartimentos', 49.99, 60),
('Silla de oficina', 'Silla ergonómica de oficina con respaldo ajustable', 129.99, 10);
delete from productos;
-- Inserción de datos en la tabla de clientes
INSERT INTO cliente (nombre, email, telefono) VALUES
('Juan Perez', 'juan@example.com', '123456789'),
('María García', 'maria@example.com', '987654321'),
('Pedro Rodriguez', 'pedro@example.com', '456123789'),
('Laura Martínez', 'laura@example.com', '789123456'),
('Ana Sánchez', 'ana@example.com', '321654987'),
('Carlos López', 'carlos@example.com', '654987321'),
('Sofía Ramirez', 'sofia@example.com', '987321654'),
('Miguel Torres', 'miguel@example.com', '654321987'),
('Elena Gómez', 'elena@example.com', '321987654'),
('David Ruiz', 'david@example.com', '456789123'),
('Carmen Vazquez', 'carmen@example.com', '987123456'),
('Daniel Castro', 'daniel@example.com', '123987654'),
('Isabel Fernandez', 'isabel@example.com', '654123987'),
('Francisco Morales', 'francisco@example.com', '789654123'),
('Patricia Diaz', 'patricia@example.com', '321789654');
delete from clientes;
-- Inserción de datos en la tabla de pedidos
INSERT INTO pedido (id_cliente, fecha_pedido, total_pedido) VALUES
(1, '2024-03-22', 150.75),
(2, '2024-03-21', 278.40),
(3, '2024-03-20', 95.25),
(4, '2024-03-19', 180.50),
(5, '2024-03-18', 75.30),
(6, '2024-03-17', 320.90),
(7, '2024-03-16', 150.25),
(8, '2024-03-15', 220.60),
(9, '2024-03-14', 88.75),
(10, '2024-03-13', 410.25),
(11, '2024-03-12', 130.40),
(12, '2024-03-11', 270.80),
(13, '2024-03-10', 115.20),
(14, '2024-03-09', 198.75),
(15, '2024-03-08', 325.40);
delete from pedidos;
-- Inserción de datos en la tabla de detalles de pedido
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 2, 15.99, 31.98),
(1, 3, 1, 49.99, 49.99),
(2, 2, 1, 29.99, 29.99),
(2, 5, 3, 79.99, 239.97),
(3, 4, 10, 399.99, 399.99),
(4, 6, 7, 899.99, 1799.98),
(5, 7, 9, 299.99, 299.99),
(6, 8, 7, 39.99, 39.99),
(6, 9, 4, 49.99, 99.98),
(7, 10, 5, 129.99, 129.99),
(8, 2, 5, 15.99, 31.98),
(8, 2, 2, 49.99, 49.99),
(9, 3, 6, 29.99, 29.99),
(9, 4, 8, 79.99, 239.97),
(10,5, 9, 399.99, 399.99);
delete from detalles_pedido;
-- Inserción de datos en la tabla de categorías
INSERT INTO categoria (nombre) VALUES
('Ropa'),
('Electrónica'),
('Calzado'),
('Accesorios'),
('Hogar');
delete from categrias;
-- Inserción de datos en la tabla de productos_categorias
INSERT INTO producto_categoria (id_producto, id_categoria) VALUES
(1, 1),
(2, 1),
(3, 3),
(4, 2),
(5, 4),
(6, 2),
(7, 2),
(8, 4),
(9, 4),
(10, 5);
delete from productos_categorias;
-- Inserción de datos en la tabla de comentarios
INSERT INTO comentario (id_producto, id_cliente, comentario) VALUES
(1, 1, 'Me encanta esta camiseta!'),
(2, 2, 'Los pantalones me quedan genial, gracias!'),
(3, 3, 'Los zapatos son muy cómodos para correr.'),
(4, 4, 'El teléfono móvil tiene una pantalla increíble.'),
(5, 5, 'El reloj es elegante y funcional.'),
(6, 6, 'El portátil es rápido y tiene buena batería.'),
(7, 7, 'La tableta es perfecta para ver películas.'),
(8, 8, 'Las gafas de sol tienen un diseño genial.'),
(9, 9, 'La mochila tiene mucho espacio para llevar todo.'),
(1, 10, 'La silla de oficina es muy cómoda para largas horas.'),
(1, 11, 'La camiseta es de buena calidad.'),
(2, 12, 'Los pantalones son muy cómodos para el día a día.'),
(3, 13, 'Me encanta esta camiseta!'),
(4, 14, 'Los zapatos son elegantes y cómodos.'),
(5, 15, 'La silla de oficina es perfecta para trabajar en casa.');
select * from comentario ;

delete from comentaselect * from 
drop database tienda_online_D;
select * from comentario ;
select * from detalle_pedido;
select * from producto_categoria;
select * from comentario;
select * from producto;
select * from cliente;



-- 1. actualice el precio de camisetas de algodon a 19.99
update producto set precio= '19.99' where nombre='Camiseta de algodón';
-- 2. obterner todos los nombres y productos en la categoria ropa 
select p.nombre, p.precio from producto p
inner join producto_categoria pc on p. id_producto= pc. id_producto 
inner join categoria c on pc. id_categoria =c.id_categoria
where c.nombre = 'ropa';

-- calcular el total de ventas realizadas por cada cliente 
select C.nombre as cliente,sum(p.total_pedido) as total_venta
from cliente C
left join pedido p on c.id_cliente= p.id_cliente
group by c.nombre;

-- mostrar los productos junto con la cantidad vendida
select producto.nombre as producto,count(detalle_pedido.cantidad) as cantidad
from producto,detalle_pedido 
inner join pedido  on id_producto= Id_detalle
group by producto.nombre;

-- mostrar todos los productos que tienen un precio mayor que cualquier producto en la categoria electronica 
SELECT producto,precio FROM producto inner join producto_categoria ON p.ID_PRODUCTO = pr.ID_PRODUCTO
SELECT,
SELECT PRODUCTO,PRECIO FROM PRODUCTO  LEFT JOIN PRODUCTO pr ON p.ID_PRODUCTO = Id_categoria;
WHERE 
select ;

ALL REVISAR ;

SELECT NOMBRE,PRECIO 
FROM PRODUCTO
WHERE PRECIO > ANY(
   SELECT MAX(precio)
    FROM producto pr
    INNER JOIN producto_categoria pc ON pr.Id_producto = pc.Id_producto
    INNER JOIN categoria c ON pc.Id_categoria = c.Id_categoria
    WHERE c.nombre = 'Electrónica'
);
SELECT NOMBRE,PRECIO 
FROM PRODUCTO
WHERE PRECIO > ANY(
   SELECT MAX(precio)
    FROM producto pr
    INNER JOIN producto_categoria pc INNER JOIN categoria c ON pr.Id_producto = pc.Id_producto
    WHERE c.nombre = 'Electrónica');


Id_producto WHERE ci.CIUDAD = 'Cali';