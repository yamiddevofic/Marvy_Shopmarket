-- Taller_BDConceptos
-- Cree la base de datos Taller_BDConceptos
-- CREA BASE DE DATOS
CREATE database Taller_consultas_intro;
-- Usar la base de datos
Use Taller_consultas_intro;
create table departamento (
id_departamento int auto_increment primary key,
nombre varchar (100) not null,
presupuesto double unsigned not null,
gastos double unsigned not null,
fecha_creación date
);
drop database Taller_consultas_intro;
describe departamento;

create table empleado (
id_empleado int unsigned auto_increment primary key,
nif varchar (100) not null unique,
nombre varchar (100) not null,
apellido1 varchar (100) not null,
apellido2 varchar (100),
correo varchar (100),
telefono bigint,
sueldo bigint default 0,
id_departamento_empleado int,
foreign key (id_departamento_empleado) references departamento
(id_departamento)
);
-- Insertar valores departamento
insert into departamento (id_departamento,nombre,presupuesto,gastos,fecha_creación)
values (1,'desarrolo',120000,6000,'79-08-19');
 insert into departamento (id_departamento,nombre,presupuesto,gastos,fecha_creación)
values(2,'sistemas',150000,21000,'750818');
insert into departamento (id_departamento,nombre,presupuesto,gastos,fecha_creación)
values(3,'recursos humanos',120000,28000,'900821');
 insert into departamento (id_departamento,nombre,presupuesto,gastos,fecha_creación)
values(4,'contabilidad',280000,3000,'240818');
 insert into departamento (id_departamento,nombre,presupuesto,gastos,fecha_creación)
values(5,'I+D',37500,38000,'650818');
 insert into departamento (id_departamento,nombre,presupuesto,gastos,fecha_creación)
values(6,'Proyectos',0,0,'930818');
 insert into departamento (id_departamento,nombre,presupuesto,gastos,fecha_creación)
values(7,'Publicidad',0,1000,'750818');
-- insertar valores empleado
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values (1,'y5575632d','Aarón','rivero','gomez','aaron@outlook.com', 3145467621,1520000,1);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(4,'7770554se','adrian','suarez',null,'adrian@outlook.com',3145467624,1520000,4);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values (12,'32234234481596f','irene','rivero','gomez','irene@outlook.com', 3145467632,520000,null);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(2,'3223423481596f','mandela','rivero','gomez','adela@outlook.com', 3145467622,520000,2);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(3,'32242481596f','Adolfo','rivero','gomez','Adolfo@outlook.com', 3145467623,520000,3);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values( 5,'32281596f','adrian','rivero','gomez','marcos@outlook.com', 3145467625,520000,5);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(6,'3332481596f','adrian','rivero','gomez','maria@outlook.com', 3145467626,520000,1);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(7,'32331596f','pepe','rivero',null,'pilar@outlook.com', 3145467627,520000,2);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(8,'32481596f','pepe','rivero','gomez','pepe@outlook.com', 3145467628,1520000,3);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(9,'3242281596f','pepe','rivero','gomez','juan@outlook.com', 3145467629,520000,2);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(10,'32484321596f','irene','rivero','gomez','diego@outlook.com', 3145467630,520000,5);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(11,'32433281596f','irene','rivero','gomez','martha@outlook.com', 3145467631,1520000,1);
 insert into empleado
(id_empleado,nif,nombre,apellido1,apellido2,correo,telefono,sueldo,id_departamento_empleado)
values(13,'82631596f','juan antonio','rivero','gomez','juan antonio@outlook.com', 31454676233,520000,null); 

update empleado set correo='pepe@outlook.com' where id_empleado = 1;


describe empleado;


-- actualicen el correo del empleado cuyo mail inicia por pilar cambiandolo por el nombre del usuario 
select id_empleado from empleado where correo like 'mandela%';
update empleado set correo='pepe@outlook.com' where id_empleado =7;
update empleado set correo= concat(nombre,'@outlook.com') where id_empleado =2;

-- borrrar el registro de empleado que terminen en z en este caso le cambie a la d porque is registros no tienen q temrine en z 
delete  from empleado where nif like '%d';  

-- actualizar dos empleados con raya de piso 1 y 2 
update empleado set correo='pepe_gomez@outlook.com' where id_empleado =3;
update empleado set correo='diego_gomez@outlook.com' where id_empleado =4;
-- 
-- consulte de los empleados 1 y 2  para verificar la raya de piso _
select correo from empleado where correo like '%\_%';

-- hagan la cosnulta de la manera opuesta usar el not like 
select correo from empleado where correo not like '%\_%';

-- listen los empleados que pertenezcan a los departamentos de sistemas, plublicidad, i+d , 
select * from departamento where nombre in ('sistemas', 'plublicidad', 'i+d'); 
select * from empleado where id_departamento_empleado in ('sistemas', 'plublicidad', 'i+d');
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d','recursos humanos','contabilidad'));
-- revisar 
select empleado.nombre,departamento.nombre from empleado,departamento as dep where empleado.id_departamento_empleado=departamento.id and departamento.nombre in ('sistemas', 'plublicidad', 'i+d'); 

-- uso de group by, having order by 
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d','recursos humanos','contabilidad')) order by nombre;
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d','recursos humanos','contabilidad')) having 
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d','recursos humanos','contabilidad')) group by ;
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d','recursos humanos','contabilidad'));



-- listar cuantos empleados hay por cada departamento 
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d','recursos humanos','contabilidad')) group by id_empleado; 
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d','recursos humanos','contabilidad')) order by nombre; 

-- listar cuantos empleados hay por cada departamento 
select id_departamento_empleado, count(id_empleado) as total_empleados from empleado group by id_departamento_empleado;

-- mostrar y agrupar los empleados y cuantas coicidenias existen con respecto a cada nombre a expecion del empleado aron (adolfo)
select nombre, count(nombre) as total_empleados from empleado where nombre not like 'adolfo' group by nombre order by nombre; 

-- la del profe 
select nombre, count(id_empleado) as coincidencias from empleado group by nombre having nombre <>'adolfo' order by nombre desc;  

-- no hace nada where nombre=nombre and nombre
select nombre, count(nombre) as total_empleados from empleado where nombre=nombre and nombre not like 'adolfo' group by nombre order by nombre; 
-- revisar not like 

select * from empleado;


where id_departamento_empleado = id_empleado
 group by id_departamento;
select id_departamento, count(id_empleado) as Total_empleados from empleado  group by id_departamento;

-- fornaea de empleado id_departamento_empleado
-- ordene el campo de empleado 
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d')) order by id_empleado;
select * from empleado where id_departamento_empleado in (select id_departamento from departamento where nombre in ('sistemas', 'plublicidad', 'i+d')) order by nombre;
describe empleado;
describe departamento;
select * from empleado;
select * from departamento;




describe 

select * from empleado;


select (apellido1),(apellido2) from empleado where nombre like 'o%';
select fecha from departamento where nombre like 'a%'and apellido1 like '%o';
select (nombre),(apellido1) from empleado where apellido2 like 'adr%'and apellido1 like '%ro';
select (nombre) from empleado where nombre like 'a%';
select nombre from empleado where correo like 'pila%';
update tabla set estadio=('camilo daza') where id_equipo = 100;
update tabla set posicion='arquero' where id_jugador = 100;
update tabla set nombre = 'Diego' where dni = 122;
update tabla set aforo=('100000') where id_equipo = 100;
update tabla set dni = ('99') where dni=122;

alter table Equipo ADD Funadador varchar (100); 
alter table jugador ADD traspaso varchar (100); 
alter table presidente ADD gestion varchar (100);
alter table Equipo  rename club; 
alter table jugador rename atleta; 

alter table Modificación ADD CONSTRAINT  id_usuario_modificacion1 foreign key (id_usuario_modificacion1) references usuario(id_usuario);
alter table modificación ADD CONSTRAINT  id_usario_registro1 foreign key (id_usario_registro1) references registro(id_registro);
alter table Modificación ADD CONSTRAINT  bovino_id_bovino foreign key (bovino_id_bovino) references bovino(id_bovino);
drop database Sistema_de_Informacion_finca_el_Pino;

-- fatan las foraneas (Modificación)
-- id_usuario (clave foránea)
-- id_bovino (clave foránea)

select concat  from empleado; 
select concat (nombre,'  ',apellido1,'  ',apellido2) from empleado; 

-- revisar 
select count(id_empleado)total_registro, count(nombre)total_empleados,min(sueldo)minimo_sueldo,max(sueldo)maximo_sueldo,sum(sueldo)sumatoria_de_sueldo from empleado;


select (apellido1),(apellido2) from empleado where nombre like 'o%';
select fecha from departamento where nombre like 'a%'and apellido1 like '%o';
select (nombre),(apellido1) from empleado where apellido2 like 'adr%'and apellido1 like '%ro';
select (nombre) from empleado where nombre like 'a%';
select nombre from empleado where (apellido2)like '%0%'and(apellido1)like '%0%';
(apellido2)like 'adr%'and(apellido1)like '%ro';

select nombre from departamento  where 


-- liste los nombres de departamento que tienen la letra y en la cuarta posicion del nombre 
select concat (nombre,'  ',apellido1,'  ',apellido2) from empleado where id_empleado between 
select concat (nombre,'  ',apellido1,'  ',apellido2) from empleado where id_empleado between 
select (nombre)from departamento where nombre like 'y%';

select * from empleado where (apellido2,apellido1) like '0%';

select * from empleado where empleado where (apellido2,apellido1) like '%0%';
select (apellido2),(apellido1) from empleado where apellido2,apellido1like '%0%'and apellido1 like '%ro';

select (apellido1),(apellido2) from empleado where apellido1,apellido2 like '%0%';
-- calcule los sueldos de empleados registrados los cualentes tenga dentro de su apellido la vocal o 
apellido1,apellido2
(apellido2)
-- total registros
-- total empleados
-- sueldo minimo
-- sueldo maximo 
-- total del sueldo 
 
select (apellido2),(apellido1) from empleado where apellido1,apellido2 like 'adr%'and apellido1 like '%ro';

select * from empleado;

-- actualicen el correo del empleado cuyo mail inicia por pilar cambiandolo por el nombre del usuario 

describe empleado;
describe departamento;
DESCRIBE REGISTRO;
DESCRIBE USUARIO;
DESCRIBE BOVINO;