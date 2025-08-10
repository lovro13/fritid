-- Sample data for Fritid webstore development
-- This file contains test data for development and testing purposes

-- Sample users (passwords are hashed versions of 'password123')
INSERT INTO users (username, email, password_hash, name, address, postal_code, city, country, phone_number) VALUES
('tets_user1', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', '123 Main St', '10001', 'New York', 'USA', '+1-555-0123'),
('test_user2', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', '456 Oak Ave', '90210', 'Beverly Hills', 'USA', '+1-555-0456'),
('test_user3', 'bob.wilson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Wilson', '789 Pine Rd', 'SW1A 1AA', 'London', 'UK', '+44-20-7946-0958');

-- Sample products based on your assets
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Steklenica za kapljice 10ml - rjava', 'Rjava steklenica za kapljice, volumen 10ml, idealna za eterična olja', 2.99, 100, 'Steklenice', '/assets/steklenicka-kapljevine-10ml-rjava.jpeg'),
('Steklenica za kapljice 15ml - rjava', 'Rjava steklenica za kapljice, volumen 15ml', 3.49, 80, 'Steklenice', '/assets/steklenicka-kapljevine-15ml-rjava.jpeg'),
('Steklenica za kapljice 20ml - kobalt modra', 'Kobalt modra steklenica za kapljice, volumen 20ml', 3.99, 75, 'Steklenice', '/assets/steklenicka-kapljevine-20ml-kobalt-modra.jpeg'),
('Steklenica za kapljice 30ml - rjava', 'Rjava steklenica za kapljice, volumen 30ml', 4.49, 60, 'Steklenice', '/assets/steklenicka-kapljevine-30ml-rjava.jpeg'),
('Steklenica za kapljice 50ml - kobalt modra', 'Kobalt modra steklenica za kapljice, volumen 50ml', 5.99, 45, 'Steklenice', '/assets/steklenicka-kapljevine-50ml-kobalt-modra.jpeg'),
('Steklenica za kapljice 100ml - rjava', 'Rjava steklenica za kapljice, volumen 100ml', 7.99, 30, 'Steklenice', '/assets/steklenicka-kapljevine-100ml-rjava.jpeg'),
('Pokrovček s stekleno pipeto 10ml', 'Pokrovček z integrirano stekleno pipeto za 10ml steklenice', 1.99, 120, 'Pokrovčki', '/assets/pokrovcek-stekleno-pipeto-10ml.jpeg'),
('Pokrovček s stekleno pipeto 20ml', 'Pokrovček z integrirano stekleno pipeto za 20ml steklenice', 2.29, 100, 'Pokrovčki', '/assets/pokrovcek-stekleno-pipeto-20ml.jpeg'),
('Pokrovček s stekleno pipeto 50ml', 'Pokrovček z integrirano stekleno pipeto za 50ml steklenice', 2.99, 80, 'Pokrovčki', '/assets/pokrovcek-stekleno-pipeto-50ml.jpeg'),
('Pokrovček s kapaljko', 'Univerzalni pokrovček s kapaljko', 1.49, 150, 'Pokrovčki', '/assets/pokrovcek-s-kapalko.jpeg'),
('Prševalka univerzalna', 'Univerzalna prševalka za različne namene', 3.99, 40, 'Dodatki', '/assets/prsilka-univerzalna.jpeg'),
('Čebelica embalaža za med 150ml', 'Posebna embalaža za med v obliki čebelice, 150ml', 4.99, 25, 'Embalaža', '/assets/cebelica-embalaza-med-150ml.jpeg'),
('Doza za shranjevanje živil 200ml', 'Praktična doza za shranjevanje živil, volumen 200ml', 6.49, 35, 'Embalaža', '/assets/doza-shranjevanje-zivil-200ml.jpeg');

-- Sample orders (both user and guest orders)
INSERT INTO orders (user_id, total_amount, status, guest_email, guest_name, is_guest_order, shipping_name, shipping_address, shipping_postal_code, shipping_city, shipping_country) VALUES
-- User orders
(1, 15.97, 'DELIVERED', NULL, NULL, false, NULL, NULL, NULL, NULL, NULL),
(2, 8.48, 'SHIPPED', NULL, NULL, false, 'Jane Smith', '789 Different St', '90211', 'Los Angeles', 'USA'),
(3, 23.96, 'PROCESSING', NULL, NULL, false, NULL, NULL, NULL, NULL, NULL),
-- Guest orders
(NULL, 12.47, 'CONFIRMED', 'guest1@example.com', 'Guest Customer', true, 'Guest Customer', '321 Guest Ave', '12345', 'Guest City', 'USA'),
(NULL, 19.95, 'PENDING', 'guest2@example.com', 'Another Guest', true, 'Another Guest', '654 Visitor Blvd', '67890', 'Visitor Town', 'Canada');

-- Sample order items
INSERT INTO order_items (order_id, product_name, price, quantity) VALUES
-- Order 1 items
(1, 'Steklenica za kapljice 10ml - rjava', 2.99, 2),
(1, 'Steklenica za kapljice 20ml - kobalt modra', 3.99, 1),
(1, 'Pokrovček s stekleno pipeto 10ml', 1.99, 3),
-- Order 2 items  
(2, 'Steklenica za kapljice 15ml - rjava', 3.49, 1),
(2, 'Pokrovček s stekleno pipeto 20ml', 2.29, 1),
(2, 'Pokrovček s kapaljko', 1.49, 2),
-- Order 3 items
(3, 'Steklenica za kapljice 50ml - kobalt modra', 5.99, 2),
(3, 'Steklenica za kapljice 100ml - rjava', 7.99, 1),
(3, 'Prševalka univerzalna', 3.99, 1),
-- Guest order 1 items
(4, 'Steklenica za kapljice 30ml - rjava', 4.49, 1),
(4, 'Pokrovček s stekleno pipeto 50ml', 2.99, 1),
(4, 'Čebelica embalaža za med 150ml', 4.99, 1),
-- Guest order 2 items
(5, 'Doza za shranjevanje živil 200ml', 6.49, 2),
(5, 'Steklenica za kapljice 20ml - kobalt modra', 3.99, 1),
(5, 'Pokrovček s kapaljko', 1.49, 4);

-- Update stock quantities based on orders
UPDATE products SET stock_quantity = stock_quantity - 2 WHERE name = 'Steklenica za kapljice 10ml - rjava';
UPDATE products SET stock_quantity = stock_quantity - 2 WHERE name = 'Steklenica za kapljice 20ml - kobalt modra';
UPDATE products SET stock_quantity = stock_quantity - 3 WHERE name = 'Pokrovček s stekleno pipeto 10ml';
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE name = 'Steklenica za kapljice 15ml - rjava';
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE name = 'Pokrovček s stekleno pipeto 20ml';
UPDATE products SET stock_quantity = stock_quantity - 6 WHERE name = 'Pokrovček s kapaljko';
UPDATE products SET stock_quantity = stock_quantity - 2 WHERE name = 'Steklenica za kapljice 50ml - kobalt modra';
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE name = 'Steklenica za kapljice 100ml - rjava';
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE name = 'Prševalka univerzalna';
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE name = 'Steklenica za kapljice 30ml - rjava';
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE name = 'Pokrovček s stekleno pipeto 50ml';
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE name = 'Čebelica embalaža za med 150ml';
UPDATE products SET stock_quantity = stock_quantity - 2 WHERE name = 'Doza za shranjevanje živil 200ml';
