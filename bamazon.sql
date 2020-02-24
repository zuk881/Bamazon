DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT(10) NULL,
  PRIMARY KEY (id)
  );
  
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("nyan_cat", "toys", 200, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("meme_cat", "toys", 150, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("hat_cat", "clothing", 75, 11);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("pencil_cat", "office_supplies", 2, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("stuffed_cat", "toys", 22, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("shirt_cat", "clothing", 12, 18);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("shoe_cat", "clothing", 35, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("coffee_cat", "kitchen", 5, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("tie_cat", "clothing", 7, 1500);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("eraser_cat", "office_supplies", 1, 150);

SELECT * FROM products;