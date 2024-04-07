create database clientes_pedidos;
use clientes_pedidos;

Create table clientes(
Id_cliente bigint auto_increment primary key,
nombre varchar (100)
);

Create table pedidos(
Id_pedido bigint auto_increment primary key,
Nombre_pedido varchar (45),
Id_cliente_pedido bigint,
Foreign key (Id_cliente_pedido) references clientes (Id_cliente)
);

INSERT INTO clientes(Id_cliente,nombre) VALUES
(1001, 'Juan'),
(1002, 'Maria'),
(1003, 'Pedro');

INSERT INTO pedidos(Id_pedido,Nombre_pedido,Id_Cliente_pedido) VALUES
(1, 'casa',1001),
(2, 'tabla',1002),
(3, 'cobija',null);

select * from clientes as C inner join pedidos as p on C.Id_cliente = P.Id_cliente_pedido;
select * from clientes as C left join pedidos as p on C.Id_cliente = P.Id_cliente_pedido;
select * from clientes as C right join pedidos as p on C.Id_cliente = P.Id_cliente_pedido;
Describe bovino;