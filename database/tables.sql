CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  user_role varchar(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hashed_password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE items (
  item_id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL
  price DECIMAL(10, 2) NOT NULL,
  photo_path VARCHAR(255)
);

CREATE TABLE order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);

CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);

INSERT INTO items (item_name, price, photo_path) VALUES
('JBL רמקול אלחוטי FLIP 6 שחור', 299.00, src\assets\item_example.jpg);

ALTER TABLE items
ADD COLUMN price DECIMAL(10, 2) NOT NULL;