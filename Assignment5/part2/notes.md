# Part 2: Schema Mapping - User / Product

Diagram: `schema.png`

## Relational Schema

```
User (id PK, firstName, lastName, userName, phone, email, role, password)

Product (id PK, name, stock, price, isDeleted, userId FK -> User.id)
```

## Why it maps this way

The ERD has a **1:N relationship** ("Own") between User and Product — one user can own many products, but each product belongs to exactly one user.

For a 1:N binary relationship, the standard mapping rule is:
- We do **not** create a separate table for the relationship itself.
- Instead, we take the primary key of the entity on the "1" side (**User.id**) and add it as a foreign key on the entity on the "N" side (**Product**).

So `Product` ends up with a `userId` column that references `User.id`. That single FK column is what represents the "Own" relationship — no junction table needed, since this isn't a many-to-many relationship and "Own" itself doesn't carry any extra attributes.

## Example SQL (for reference)

```sql
CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  userName VARCHAR(50) UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(20),
  password VARCHAR(255)
);

CREATE TABLE Product (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  stock INT,
  price DECIMAL(10,2),
  isDeleted BOOLEAN DEFAULT FALSE,
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(id)
);
```
