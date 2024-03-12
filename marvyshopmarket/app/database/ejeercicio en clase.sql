CREATE database if not exists ejercicio_consultas_basica;
use ejercicio_consultas_basica;
CREATE TABLE tblUsuarios (
idx INT PRIMARY KEY AUTO_INCREMENT,
usuario VARCHAR(20),
nombre VARCHAR(20),
sexo VARCHAR(1),
nivel TINYINT,
email VARCHAR(50),
telefono VARCHAR(20),
marca VARCHAR(20),
compañia VARCHAR(20),
saldo FLOAT,
activo BOOLEAN
);

INSERT INTO tblUsuarios
VALUES
('1','BRE2271','BRENDA', 'M','2','brenda@live.com', '655-330-5736', 'SAMSUNG', 'IUSACELL','100','1'),
('2','OSC4677','OSCAR','H', '3','oscar@gmail.com', '655-143-4181','LG','TELCEL','0','1'),
('3','JOS7086', 'JOSE', 'H', '3','francisco@gmail.com', '655-143-3922', 'NOKIA', 'MOVISTAR','150','1'),
('4','LUI6115', 'LUIS', 'H', '0','enrique@outlook.com', '655-137-1279','SAMSUNG', 'TELCEL','50','1'),
('5','LUI7072', 'LUIS', 'H', '1', 'luis@hotmail.com','655-100-8260','NOKIA','IUSACELL', '50', '0'),
('6','DAN2832','DANIEL','H','0','daniel@outlook.com', '655-145-2586','SONY', 'UNEFON','100','1'),
('7','JAQ5351', 'JAQUELINE', 'M', '0','jaqueline@outlook.com', '655-330-5514','BLACKBERRY','AXEL', '0','1'),
('8','ROM6520', 'ROMAN', 'H','2','roman@gmail.com', '655-330-3263','LG','IUSACELL', '50','1'),
('9','BLA9739','BLAS','H','0','blas@hotmail.com', '655-330-3871','LG', 'UNEFON','100','1'),
('10','JES4752', 'JESSICA', 'M', '1', 'jessica@hotmail.com', '655-143-6861','SAMSUNG', 'TELCEL','500','1'),
('11','DIA6570','DIANA', 'M', '1', 'diana@live.com', '655-143-3952', 'SONY', 'UNEFON','100','0'),
('12','RIC8283','RICARDO', 'H', '2', 'ricardo@hotmail.com','655-145-6049','MOTOROLA','IUSACELL','150','1'),
('13','VAL6882', 'VALENTINA', 'M','0', 'valentina@live.com', '655-137-4253','BLACKBERRY','AT&T','50','0'),
('14','BRE8106','BRENDA', 'M','3', 'brenda2@gmail.com','655-100-1351', 'MOTOROLA', 'NEXTEL','150','1'),
('15','LUC4982', 'LUCIA', 'M', '3','lucia@gmail.com', '655-145-4992','BLACKBERRY','IUSACELL', '0','1'),
('16','JUA2337','JUAN', 'H','0','juan@outlook.com','655-100-6517','SAMSUNG', 'AXEL', '0', '0'),
('17','ELP2984','ELPIDIO','H', '1','elpidio@outlook.com','655-145-9938', 'MOTOROLA', 'MOVISTAR', '500','1'),
('18','JES9640', 'JESSICA','M','3', 'jessica2@live.com', '655-330-5143','SONY','IUSACELL','200','1'),
('19','LET4015', 'LETICIA', 'M','2','leticia@yahoo.com', '655-143-4019','BLACKBERRY','UNEFON','100','1'),
('20','LUI 1076', 'LUIS', 'H', '3','luis2@live.com','655-100-5085','SONY', 'UNEFON','150','1'),
('21','HUG5441','HUGO','H','2','hugo@iive.com', '655-137-3935', 'MOTOROLA', 'AT&T','500','1');


-- LISTEN LOS NOMBRE DE LOS USARIOS 
SELECT NOMBRE FROM tblUsuarios; 
-- CALCULAR EL SALDO MAXIMO DEL SEXO MUJER 
select max(saldo) as saldo_maximo FROM tblUsuarios where SEXO ='M';
-- LISTAR NOMBRE Y TELEFONO DE LOS USUARIOS CON TELEFONO NOKIA BLACKBERRY O SONY
SELECT NOMBRE,TELEFONO  FROM tblUsuarios WHERE marca in ('NOKIA','BLACKBERRY','SONY');
-- contar los usuarios sin saldo o inactivos 
select count(nombre) usuario from tblUsuarios where saldo =0 or activo=0;
select count(nombre) usuario from tblUsuarios where saldo =0 or not activo;
-- listar el login de los usuarios con niveles 1 2 y 3 
SELECT usuario FROM tblUsuarios where nivel in (1,2,3);
SELECT usuario,nombre,nivel FROM tblUsuarios where nivel in (1,2,3) order by nivel desc;
-- liste 
-- listar los numeros de telefono con saldo menor o igual a 300
select count(nombre) usuario from tblUsuarios where saldo <300;
-- calcular la suma de los saldos de los usuarios de la compañia telefonica nextel 
select sum(saldo) as saldo_maximo FROM tblUsuarios where compañia ='NEXTEL';
-- contar el numero de usuarios por compañia telefonica 
select count(idx) as cont_usuario,compañia from tblUsuarios group by compañia;
select count(idx) as cont_usuario,compañia from tblUsuarios group by compañia having cont_usuario >4;
--  contar el numero de ususarios por nivel 
select nivel,count(idx) as cont_usuario from tblUsuarios group by nivel;
-- listar el numero de usarios con nivel 2 
select nivel,count(idx),compañia as cont_usuario from tblUsuarios group by nivel=2;
-- modificar para que me liste unicamente el ususario que tenga en su usario 5 
select nombre,usuario,nivel,count(idx),compañia as cont_usuario from tblUsuarios where usuario like '%_5_%' group by nivel=2; 
-- modificar para que me liste unicamente el ususario que tenga en su usario 5
select usuario from tblUsuarios where usuario like '%_5_%' and nivel=2; 
-- mostrar el email de los usuarios q usan gmail 
select nombre,usuario,email from tblUsuarios where email like '%_gmail_%';
-- modificar el correo de roman a riquelme2025@hotmail.com y listelo nuevamente con los listados anteriores 
update tblUsuarios set email= 'riquelme2025@hotmail.com' where idx=8;
select nombre,email from tblUsuarios where email like '%_gmail_%' or idx=8;
-- listar nombre y telefono de los usarios lg samsung o motorola 
select idx,nombre,telefono,marca from tblUsuarios where marca in ('LG','SAMSUNG','MOTOROLA')  order by marca; 
-- modificar ese ejercicio para que me liste si los nombres q empiezan por b y temrinen en a y agreguen la marca como primera columna alfabeticamente 

select marca,nombre from tblUsuarios where nombre not like 'b%a' and marca in ('LG','SAMSUNG','MOTOROLA');
select lower(marca),(nombre) from tblUsuarios where nombre not like '%a' and nombre not like 'b%' and marca in ('LG','SAMSUNG','MOTOROLA')order by marca;


-- SEGUNDA RONDA
-- listar nombre y telefono de los usuarios con telefono que no sea de la marga lg o samsung 
select marca,nombre,telefono from tblUsuarios where marca not in ('LG','SAMSUNG') order by marca;
-- listen el login y el telefono de los usuarios con compañia telefonica usacel, le ususario debe aparecer en minuscula 
select lower(nombre),telefono from tblUsuarios where compañia= ('IUSACELL');
select upper(nombre),telefono from tblUsuarios where compañia= ('IUSACELL');
-- listar el login y telefono de los usuarios con compañoia telefonica que no sea telcel y cuyo telefono no lleve el 145 
select idx as num_ususario ,marca,nombre,telefono from tblUsuarios where compañia not in ('telcel') and telefono not like '%_145_%'order by num_ususario;
select idx,marca,nombre,telefono from tblUsuarios where compañia not in ('telcel') and telefono not like '%_145_%';
select count(*), nombre, telefono, compañia from tblUsuarios where compañia not in ('telcel') and telefono not like '%_145_%' group by idx;
-- contador para lista 
set @Cont=0;
select (@Cont:=@Cont+1) as contador,nombre, telefono, compañia from tblUsuarios where compañia not in ('telcel') and telefono not like '%_145_%' group by idx;
-- liste el nombre y sexo correspondiente a los ususarios cuyos registros correspondan a la mayor cantidad segun el genero 
select nombre,sexo from tblUsuarios order by sexo;

Select count(nombre),sexo from tblUsuarios WHERE sexo  = 'H' or sexo = 'M' group by sexo;
Select count(nombre),nombre,sexo from tblUsuarios WHERE sexo  = 'H' group by sexo;
select count(nombre),nombre,sexo from tblUsuarios WHERE sexo  = 'H';
Select nombre,sexo from tblUsuarios WHERE sexo  = 'H';
-- 

 order by marca;


-- revisar
 or marca in ('LG','SAMSUNG','MOTOROLA');
 order by nombre;
  acend marca; 
or marca in ('LG','SAMSUNG','MOTOROLA')
update 

select usuario
from tblUsuarios
where usuario
like '%_5_%'
group by nivel=2;
 
 
where compañia in ('IUSACELL','NEXTEL','TELCEL','MOVISTAR','UNEFON','AT&T','AXEL') group by compañia;
-- los que tengan menor q 4 
select count(idx) usuario from tblUsuarios where compañia in ('IUSACELL','NEXTEL','TELCEL','MOVISTAR','UNEFON','AT&T','AXEL') group by compañia 4;



 select 
 
 select count(nombre) usuario from tblUsuarios where saldo =0 or activo=0;

