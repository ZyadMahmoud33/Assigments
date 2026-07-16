-- =====================================================
-- Assignment 6 - Part 3
-- Retail Store Database (Products, Suppliers, Sales)
-- =====================================================

CREATE DATABASE IF NOT EXISTS retail_store;
USE retail_store;

-- ---------------------------------------------------------------
-- 1. Create the required tables
-- ---------------------------------------------------------------
CREATE TABLE Suppliers (
  SupplierID INT PRIMARY KEY AUTO_INCREMENT,
  SupplierName VARCHAR(100),
  ContactNumber VARCHAR(20)
);

CREATE TABLE Products (
  ProductID INT PRIMARY KEY AUTO_INCREMENT,
  ProductName VARCHAR(100),
  Price DECIMAL(10,2),
  StockQuantity INT,
  SupplierID INT,
  FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE Sales (
  SaleID INT PRIMARY KEY AUTO_INCREMENT,
  ProductID INT,
  QuantitySold INT,
  SaleDate DATE,
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- ---------------------------------------------------------------
-- 2. Add a column "Category" to Products
-- ---------------------------------------------------------------
ALTER TABLE Products ADD COLUMN Category VARCHAR(50);

-- ---------------------------------------------------------------
-- 3. Remove the "Category" column from Products
-- ---------------------------------------------------------------
ALTER TABLE Products DROP COLUMN Category;

-- ---------------------------------------------------------------
-- 4. Change "ContactNumber" column in Suppliers to VARCHAR(15)
-- ---------------------------------------------------------------
ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15);

-- ---------------------------------------------------------------
-- 5. Add a NOT NULL constraint to ProductName
-- ---------------------------------------------------------------
ALTER TABLE Products MODIFY ProductName VARCHAR(100) NOT NULL;

-- ---------------------------------------------------------------
-- 6. Basic inserts
-- ---------------------------------------------------------------

-- 6a. Add supplier 'FreshFoods'
INSERT INTO Suppliers (SupplierName, ContactNumber)
VALUES ('FreshFoods', '01001234567');

-- 6b. Insert Milk, Bread, Eggs, all supplied by FreshFoods
INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
VALUES
  ('Milk',  15.00, 50, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods')),
  ('Bread', 10.00, 30, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods')),
  ('Eggs',  20.00, 40, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'));

-- 6c. Add a sale of 2 units of Milk on 2025-05-20
INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
VALUES ((SELECT ProductID FROM Products WHERE ProductName = 'Milk'), 2, '2025-05-20');

-- ---------------------------------------------------------------
-- 7. Update the price of 'Bread' to 25.00
-- ---------------------------------------------------------------
UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread';

-- ---------------------------------------------------------------
-- 8. Delete the product 'Eggs'
-- ---------------------------------------------------------------
DELETE FROM Products WHERE ProductName = 'Eggs';

-- ---------------------------------------------------------------
-- 9. Total quantity sold for each product
-- ---------------------------------------------------------------
SELECT p.ProductName, COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
FROM Products p
LEFT JOIN Sales s ON p.ProductID = s.ProductID
GROUP BY p.ProductID, p.ProductName;

-- ---------------------------------------------------------------
-- 10. Product with the highest stock
-- ---------------------------------------------------------------
SELECT * FROM Products
ORDER BY StockQuantity DESC
LIMIT 1;

-- ---------------------------------------------------------------
-- 11. Suppliers with names starting with 'F'
-- ---------------------------------------------------------------
SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%';

-- ---------------------------------------------------------------
-- 12. Products that have never been sold
-- ---------------------------------------------------------------
SELECT p.*
FROM Products p
LEFT JOIN Sales s ON p.ProductID = s.ProductID
WHERE s.SaleID IS NULL;

-- ---------------------------------------------------------------
-- 13. All sales along with product name and sale date
-- ---------------------------------------------------------------
SELECT s.SaleID, p.ProductName, s.SaleDate
FROM Sales s
JOIN Products p ON s.ProductID = p.ProductID;

-- ---------------------------------------------------------------
-- 14. Create user "store_manager" with SELECT, INSERT, UPDATE on all tables
-- ---------------------------------------------------------------
CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'localhost';

-- ---------------------------------------------------------------
-- 15. Revoke UPDATE permission from "store_manager"
-- ---------------------------------------------------------------
REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost';

-- ---------------------------------------------------------------
-- 16. Grant DELETE permission to "store_manager" only on Sales table
-- ---------------------------------------------------------------
GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost';

FLUSH PRIVILEGES;
