create database ejemplojoincross;
use ejemplojoincross;
create table items (
item_id int primary key,
item_name varchar (50),
item_unit varchar (50),
Company_id int 
);

create table companies (
company_id int primary key,
company_name varchar (50),
company_city varchar (50)
);

INSERT INTO Items (ITEM_ID, ITEM_NAME, ITEM_UNIT, COMPANY_ID) VALUES
(1, 'Chex Mix', 'Pcs', 16),
(6, 'Cheez-It', 'Pcs', 15),
(2, 'BN Biscuit', 'Pcs', 15),
(3, 'Mighty Munch', 'Pcs', 17),
(4, 'Pot Rice', 'Pcs', 15),
(5, 'Jaffa Cakes', 'Pcs', 18),
(7, 'Salt n Shake', 'Pcs', NULL);

INSERT INTO Companies (COMPANY_ID, COMPANY_NAME, COMPANY_CITY) VALUES
(18, 'Order All', 'Boston'),
(15, 'Jack Hill Ltd', 'London'),
(16, 'Akas Foods', 'Delhi'),
(17, 'Foodies.', 'London'),
(19, 'sip-n-Bite.', 'New York');

select*from items;
select*from companies;

SELECT items.item_name,items.item_unit,
companies.company_name,companies.company_city 
FROM items
CROSS JOIN Companies order by company_city asc;
-- segunda opción--
SELECT items.item_name,items.item_unit,
companies.company_name,companies.company_city 
FROM items,companies;

