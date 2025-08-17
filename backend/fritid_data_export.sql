-- Fritid Database Export
-- Generated on: 2025-08-16T11:58:28.113Z

SET FOREIGN_KEY_CHECKS=0;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      address TEXT,
      postal_code VARCHAR(20),
      city VARCHAR(100),
      phone_number VARCHAR(20),
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      image_url VARCHAR(512),
      colors JSON NULL,
      category VARCHAR(100),
      stock_quantity INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_products_active (is_active),
      INDEX idx_products_price (price)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
      shipping_first_name VARCHAR(255) NOT NULL,
      shipping_last_name VARCHAR(255) NOT NULL,
      shipping_email VARCHAR(255) NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_postal_code VARCHAR(20) NOT NULL,
      shipping_city VARCHAR(100) NOT NULL,
      shipping_phone_number VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
      INDEX idx_orders_user_id (user_id),
      INDEX idx_orders_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL,
      INDEX idx_order_items_order_id (order_id),
      INDEX idx_order_items_product_id (product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM users;

-- Export 4 users
INSERT INTO users (id, first_name, last_name, email, password_hash, address, postal_code, city, phone_number, role, created_at) VALUES (33, 'TEST', 'USER1', 'test1@example.com', '$2b$10$OUhwBrH7785KTh6XXHNel.EeuZdEe/qC8Klksr097j34omH1g9jhu', NULL, NULL, NULL, NULL, 'user', '2025-08-10 17:23:31');
INSERT INTO users (id, first_name, last_name, email, password_hash, address, postal_code, city, phone_number, role, created_at) VALUES (34, 'TEST', 'USER2', 'test2@example.com', '$2b$10$YdREmrHr2zT7tHkeNvsjwOgLPlBo/R2SYpv0HkrBuRJSalFKcrBn.', NULL, NULL, NULL, NULL, 'user', '2025-08-10 17:24:52');
INSERT INTO users (id, first_name, last_name, email, password_hash, address, postal_code, city, phone_number, role, created_at) VALUES (65, 'TEST', 'TEST', 'test3@example.com', '$2b$10$xteZD5CKhc2q86n4w/KOu.003zDNe77cneZor6lcW8G5pqSOa2HvS', NULL, NULL, NULL, NULL, 'user', '2025-08-12 18:32:56');
INSERT INTO users (id, first_name, last_name, email, password_hash, address, postal_code, city, phone_number, role, created_at) VALUES (66, 'Admin', 'Fritid', 'admin@fritid.com', '$2b$10$zxjeAIJqZagflNycHm9rJ.nUUeJEqrP5Oo.Ayq3NbDVb5nF9CYbHG', NULL, NULL, NULL, NULL, 'admin', '2025-08-16 07:29:07');

-- Export 22 products
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (302, 'Pokrovček s kapalko', '', 0.14, '/images/pokrovcek-s-kapalko.jpeg', '"[\\"Default\\"]"', '', 1000, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (303, 'Pokrovček s stekleno pipeto 100 ml', NULL, 0.43, '/images/pokrovcek-stekleno-pipeto-100ml.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (304, 'Pokrovček s stekleno pipeto 10 ml', NULL, 0.37, '/images/pokrovcek-stekleno-pipeto-10ml.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (305, 'Pokrovček s stekleno pipeto 15 ml', NULL, 0.37, '/images/pokrovcek-stekleno-pipeto-15ml.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (306, 'Pokrovček s stekleno pipeto 20 ml', NULL, 0.38, '/images/pokrovcek-stekleno-pipeto-20ml.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (307, 'Pokrovček s stekleno pipeto 30 ml', NULL, 0.39, '/images/pokrovcek-stekleno-pipeto-30ml.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (308, 'Pokrovček s stekleno pipeto 50 ml', NULL, 0.41, '/images/pokrovcek-stekleno-pipeto-50ml.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (309, 'Pršilka univerzalna', NULL, 0.68, '/images/prsilka-univerzalna.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (310, 'Steklenička za kapljevine 5 ml - rjava', NULL, 0.15, '/images/steklenicka-kapljevine-5ml-rjava.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (311, 'Steklenička za kapljevine 20 ml - kobalt modra', NULL, 0.22, '/images/steklenicka-kapljevine-20ml-kobalt-modra.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (312, 'Steklenička za kapljevine 30 ml - kobalt modra', NULL, 0.3, '/images/steklenicka-kapljevine-30ml-kobalt-modra.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (313, 'Steklenička za kapljevine 10 ml - kobalt modra', NULL, 0.18, '/images/steklenicka-kapljevine-10ml-kobalt-modra.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (314, 'Steklenička za kapljevine 50 ml - kobalt modra', NULL, 0.39, '/images/steklenicka-kapljevine-50ml-kobalt-modra.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (315, 'Steklenička za kapljevine 100 ml - kobalt modra', NULL, 0.49, '/images/steklenicka-kapljevine-100ml-kobalt-modra.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (316, 'Steklenička za kapljevine 10 ml - rjava', NULL, 0.16, '/images/steklenicka-kapljevine-10ml-rjava.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (317, 'Steklenička za kapljevine 15 ml - rjava', NULL, 0.18, '/images/steklenicka-kapljevine-15ml-rjava.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (318, 'Steklenička za kapljevine 20 ml - rjava', NULL, 0.19, '/images/steklenicka-kapljevine-20ml-rjava.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (319, 'Steklenička za kapljevine 30 ml - rjava', NULL, 0.27, '/images/steklenicka-kapljevine-30ml-rjava.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (320, 'Steklenička za kapljevine 50 ml - rjava', NULL, 0.29, '/images/steklenicka-kapljevine-50ml-rjava.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (321, 'Steklenička za kapljevine 100 ml - rjava', NULL, 0.39, '/images/steklenicka-kapljevine-100ml-rjava.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (322, 'Doza za shranjevanje živil 200 m', '', 0.6, '/images/product-1755023281295-797651226.jpeg', '"[]"', '', 0, 1, '2025-08-12 14:19:43');
INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (323, 'ČEBELICA - embalaža za med 150 ml', NULL, 0.19, '/images/cebelica-embalaza-med-150ml.jpeg', '["default"]', NULL, 0, 1, '2025-08-12 14:19:43');

-- Export 3 orders
INSERT INTO orders (id, user_id, total_amount, status, shipping_first_name, shipping_last_name, shipping_email, shipping_address, shipping_postal_code, shipping_city, shipping_phone_number, created_at) VALUES (1, 34, 19.78, 'Pending', 'TEST', 'USER2', 'test2@example.com', 'Trstenik 134', '4204', 'Golnik', '+38664226603', '2025-08-10 17:34:50');
INSERT INTO orders (id, user_id, total_amount, status, shipping_first_name, shipping_last_name, shipping_email, shipping_address, shipping_postal_code, shipping_city, shipping_phone_number, created_at) VALUES (2, 65, 21.83, 'Pending', 'TEST', 'TEST', 'test3@example.com', 'Trstenik 134', '4204', 'Golnik', '+38664226603', '2025-08-12 18:52:57');
INSERT INTO orders (id, user_id, total_amount, status, shipping_first_name, shipping_last_name, shipping_email, shipping_address, shipping_postal_code, shipping_city, shipping_phone_number, created_at) VALUES (3, NULL, 19.78, 'Pending', 'Lovro', 'Škrlj', 'lovro.zskrlj@gmail.com', 'Trstenik 134', '4204', 'Golnik', '+38664226603', '2025-08-15 10:14:49');

-- Export 14 order items
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (1, 1, 5, 6, 0.38);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (2, 1, 22, 5, 0.19);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (3, 1, 3, 35, 0.37);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (4, 1, 7, 4, 0.41);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (5, 1, 1, 14, 0.14);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (6, 2, 22, 17, 0.19);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (7, 2, 1, 30, 0.14);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (8, 2, 12, 30, 0.18);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (9, 2, 21, 15, 0.6);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (10, 3, 5, 6, 0.38);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (11, 3, 22, 5, 0.19);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (12, 3, 3, 35, 0.37);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (13, 3, 7, 4, 0.41);
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (14, 3, 1, 14, 0.14);

SET FOREIGN_KEY_CHECKS=1;
