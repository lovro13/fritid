-- Initial database schema for Fritid webstore
-- Version: 1.0
-- Created: 2025-08-06

-- Users table with profile information for hybrid approach
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Default profile fields (nullable for flexibility)
    name VARCHAR(255),
    address TEXT,
    postal_code VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100),
    phone_number VARCHAR(20)
);

-- Orders table with hybrid approach (user + guest + shipping override)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Guest order information (only populated for guest orders)
    guest_email VARCHAR(255),
    guest_name VARCHAR(255),
    guest_phone VARCHAR(20),
    is_guest_order BOOLEAN DEFAULT FALSE,
    
    -- Shipping details (can override user defaults or store guest shipping)
    shipping_name VARCHAR(255),
    shipping_address TEXT,
    shipping_postal_code VARCHAR(20),
    shipping_city VARCHAR(100),
    shipping_country VARCHAR(100),
    shipping_phone_number VARCHAR(20),
    use_different_shipping BOOLEAN DEFAULT FALSE,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Products table (basic structure)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Constraints to ensure data integrity
ALTER TABLE orders ADD CONSTRAINT check_customer_info
CHECK (
    (user_id IS NOT NULL) OR 
    (guest_email IS NOT NULL AND guest_name IS NOT NULL)
);

ALTER TABLE orders ADD CONSTRAINT check_order_status
CHECK (status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'));

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_guest_email ON orders(guest_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Initial data (optional)
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Sample Product 1', 'A sample product for testing', 29.99, 100, 'Electronics', '/assets/sample1.jpg'),
('Sample Product 2', 'Another sample product', 19.99, 50, 'Books', '/assets/sample2.jpg');
