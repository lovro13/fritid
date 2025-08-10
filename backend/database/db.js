const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'fritid.db');

// Create a connection to the SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Initialize database tables
const initializeDatabase = () => {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            address TEXT,
            postal_code VARCHAR(20),
            city VARCHAR(100),
            phone_number VARCHAR(20),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        }
    });

    // Create products table
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            colors TEXT, -- JSON string for array of colors
            category VARCHAR(100),
            stock_quantity INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating products table:', err.message);
        }
    });

    // Create orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
            shipping_first_name VARCHAR(255) NOT NULL,
            shipping_last_name VARCHAR(255) NOT NULL,
            shipping_email VARCHAR(255) NOT NULL,
            shipping_address TEXT NOT NULL,
            shipping_postal_code VARCHAR(20) NOT NULL,
            shipping_city VARCHAR(100) NOT NULL,
            shipping_phone_number VARCHAR(20) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating orders table:', err.message);
        }
    });

    // Create order_items table
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating order_items table:', err.message);
        } else {
            // Seed database after tables are created
            if (process.env.NODE_ENV !== 'production') {
                const { seedDatabase } = require('./seed');
                setTimeout(() => {
                    seedDatabase();
                }, 1000); // Delay to ensure tables are fully created
            }
        }
    });

    console.log('Database tables initialized');
};

module.exports = { db, initializeDatabase };
