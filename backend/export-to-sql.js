const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const sqliteDb = new sqlite3.Database('./database/fritid.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database for export.');
});

async function exportToSQL() {
  try {
    let sqlOutput = '';
    
    // Add header with database setup
    sqlOutput += '-- Fritid Database Export\n';
    sqlOutput += '-- Generated on: ' + new Date().toISOString() + '\n\n';
    sqlOutput += 'SET FOREIGN_KEY_CHECKS=0;\n\n';
    
    // Create tables
    sqlOutput += '-- Create tables\n';
    sqlOutput += `CREATE TABLE IF NOT EXISTS users (
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

`;

    sqlOutput += `CREATE TABLE IF NOT EXISTS products (
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

`;

    sqlOutput += `CREATE TABLE IF NOT EXISTS orders (
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

`;

    sqlOutput += `CREATE TABLE IF NOT EXISTS order_items (
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

`;
    
    // Helper function to escape SQL values
    const escapeValue = (val) => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        return "'" + val.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
      }
      return "'" + String(val).replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
    };

    // Helper to clean colors field
    const cleanColors = (val) => {
      if (val === null || val === undefined) return null;
      let s = String(val).trim();
      if (s === '' || s.toLowerCase() === 'null') return null;
      
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return JSON.stringify(parsed);
      } catch (e) {
        // Handle malformed data
        const bracketMatch = s.match(/^\[(.*)\]$/);
        if (bracketMatch) {
          const inner = bracketMatch[1].trim();
          if (inner === '') return null;
          const parts = inner.split(',').map(p => p.trim().replace(/^"|"$/g, ''))
            .filter(p => p !== '');
          if (parts.length === 0) return null;
          return JSON.stringify(parts.map(x => x.replace(/deafult/i, 'default')));
        }
        return JSON.stringify([s.replace(/deafult/i, 'default')]);
      }
      return s;
    };

    // Clear existing data
    sqlOutput += '-- Clear existing data\n';
    sqlOutput += 'DELETE FROM order_items;\n';
    sqlOutput += 'DELETE FROM orders;\n';
    sqlOutput += 'DELETE FROM products;\n';
    sqlOutput += 'DELETE FROM users;\n\n';

    // Export Users
    const users = await all(sqliteDb, 'SELECT * FROM users');
    if (users.length > 0) {
      sqlOutput += `-- Export ${users.length} users\n`;
      for (const user of users) {
        const values = [
          user.id,
          escapeValue(user.first_name),
          escapeValue(user.last_name),
          escapeValue(user.email),
          escapeValue(user.password_hash),
          escapeValue(user.address),
          escapeValue(user.postal_code),
          escapeValue(user.city),
          escapeValue(user.phone_number),
          escapeValue(user.role),
          escapeValue(user.created_at)
        ].join(', ');
        
        sqlOutput += `INSERT INTO users (id, first_name, last_name, email, password_hash, address, postal_code, city, phone_number, role, created_at) VALUES (${values});\n`;
      }
      sqlOutput += '\n';
    }

    // Export Products
    const products = await all(sqliteDb, 'SELECT * FROM products');
    if (products.length > 0) {
      sqlOutput += `-- Export ${products.length} products\n`;
      for (const product of products) {
        const cleanedColors = cleanColors(product.colors);
        const values = [
          product.id,
          escapeValue(product.name),
          escapeValue(product.description),
          product.price,
          escapeValue(product.image_url),
          escapeValue(cleanedColors),
          escapeValue(product.category),
          product.stock_quantity || 0,
          product.is_active || 1,
          escapeValue(product.created_at)
        ].join(', ');
        
        sqlOutput += `INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (${values});\n`;
      }
      sqlOutput += '\n';
    }

    // Export Orders
    const orders = await all(sqliteDb, 'SELECT * FROM orders');
    if (orders.length > 0) {
      sqlOutput += `-- Export ${orders.length} orders\n`;
      for (const order of orders) {
        const values = [
          order.id,
          order.user_id || 'NULL',
          order.total_amount,
          escapeValue(order.status),
          escapeValue(order.shipping_first_name),
          escapeValue(order.shipping_last_name),
          escapeValue(order.shipping_email),
          escapeValue(order.shipping_address),
          escapeValue(order.shipping_postal_code),
          escapeValue(order.shipping_city),
          escapeValue(order.shipping_phone_number),
          escapeValue(order.created_at)
        ].join(', ');
        
        sqlOutput += `INSERT INTO orders (id, user_id, total_amount, status, shipping_first_name, shipping_last_name, shipping_email, shipping_address, shipping_postal_code, shipping_city, shipping_phone_number, created_at) VALUES (${values});\n`;
      }
      sqlOutput += '\n';
    }

    // Export Order Items
    const orderItems = await all(sqliteDb, 'SELECT * FROM order_items');
    if (orderItems.length > 0) {
      sqlOutput += `-- Export ${orderItems.length} order items\n`;
      for (const item of orderItems) {
        const values = [
          item.id,
          item.order_id,
          item.product_id,
          item.quantity,
          item.price
        ].join(', ');
        
        sqlOutput += `INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (${values});\n`;
      }
      sqlOutput += '\n';
    }

    // Re-enable foreign key checks
    sqlOutput += 'SET FOREIGN_KEY_CHECKS=1;\n';

    // Write to file
    const outputPath = path.join(__dirname, 'fritid_data_export.sql');
    fs.writeFileSync(outputPath, sqlOutput);
    
    console.log(`✅ Data exported successfully to: ${outputPath}`);
    console.log(`📊 Exported: ${users.length} users, ${products.length} products, ${orders.length} orders, ${orderItems.length} order items`);
    console.log('\n📋 Next steps:');
    console.log('1. Upload fritid_data_export.sql to your cPanel File Manager');
    console.log('2. In cPanel → phpMyAdmin → select your database');
    console.log('3. Go to Import tab → Choose File → select fritid_data_export.sql');
    console.log('4. Click "Go" to import all your data');

  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    sqliteDb.close();
  }
}

// Helper function to promisify db.all
function all(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

exportToSQL();
