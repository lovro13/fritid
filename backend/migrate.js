// backend/migrate.js
const sqlite3 = require('sqlite3').verbose();
const { getPool } = require('./database/db');
const logger = require('./logger');
const dotenv = require('dotenv');

// Load environment variables for database connection
dotenv.config();

const sqliteDb = new sqlite3.Database('./database/fritid.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    logger.error('Error opening SQLite database for migration:', err);
    process.exit(1);
  }
  logger.info('Connected to SQLite database for migration.');
});

async function migrate() {
  let mysqlPool;
  try {
    // Ensure MySQL tables are created before migration
    const { initializeDatabase } = require('./database/db');
    await initializeDatabase();
    mysqlPool = getPool();

    logger.info('Starting data migration from SQLite to MySQL...');

    // Clear all existing data to prevent duplicates
    await mysqlPool.query('SET FOREIGN_KEY_CHECKS=0');
    await mysqlPool.query('DELETE FROM order_items');
    await mysqlPool.query('DELETE FROM orders');
    await mysqlPool.query('DELETE FROM products');
    await mysqlPool.query('DELETE FROM users');
    await mysqlPool.query('SET FOREIGN_KEY_CHECKS=1');
    logger.info('Cleared existing data from all tables.');

    // Migrate Users
    const users = await all(sqliteDb, 'SELECT * FROM users');
    if (users.length > 0) {
      const userQuery = 'INSERT INTO users (id, first_name, last_name, email, password_hash, address, postal_code, city, phone_number, role, created_at) VALUES ?';
      const userData = users.map(u => [u.id, u.first_name, u.last_name, u.email, u.password_hash, u.address, u.postal_code, u.city, u.phone_number, u.role, u.created_at]);
      await mysqlPool.query(userQuery, [userData]);
      logger.info(`Migrated ${users.length} users.`);
    }

    // Migrate Products
    const products = await all(sqliteDb, 'SELECT * FROM products');
    if (products.length > 0) {
      // Helper to clean/normalize colors field to valid JSON or null
      const cleanColors = (val) => {
        if (val === null || val === undefined) return null;
        if (Array.isArray(val)) return val;
        if (typeof val === 'object') return val;
        let s = String(val).trim();
        if (s === '' || s.toLowerCase() === 'null') return null;
        // Try parsing as JSON
        try {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // not valid JSON, fallthrough to attempts to normalize
        }
        // Common bad value like [deafult] or [default]
        const bracketMatch = s.match(/^\[(.*)\]$/);
        if (bracketMatch) {
          const inner = bracketMatch[1].trim();
          if (inner === '') return null;
          // split by comma if multiple
          const parts = inner.split(',').map(p => p.trim().replace(/^"|"$/g, ''))
            .filter(p => p !== '');
          if (parts.length === 0) return null;
          // fix common typos
          return parts.map(x => x.replace(/deafult/i, 'default'));
        }
        // If comma-separated values without brackets
        if (s.indexOf(',') !== -1) {
          return s.split(',').map(p => p.trim());
        }
        // Single word, return as single-element array
        return [s.replace(/deafult/i, 'default')];
      };

      let migratedCount = 0;
      for (const p of products) {
        try {
          const colorsObj = cleanColors(p.colors);
          const colorsValue = colorsObj ? JSON.stringify(colorsObj) : null;
          await mysqlPool.query(
            'INSERT INTO products (id, name, description, price, image_url, colors, category, stock_quantity, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [p.id, p.name, p.description, p.price, p.image_url, colorsValue, p.category, p.stock_quantity, p.is_active, p.created_at]
          );
          migratedCount++;
        } catch (err) {
          logger.error('Failed to migrate product id %s name %s: %o', p.id, p.name, err);
        }
      }

      logger.info(`Migrated ${migratedCount} products (attempted ${products.length}).`);
    }

    // Migrate Orders
    const orders = await all(sqliteDb, 'SELECT * FROM orders');
    if (orders.length > 0) {
      const orderQuery = 'INSERT INTO orders (id, user_id, total_amount, status, shipping_first_name, shipping_last_name, shipping_email, shipping_address, shipping_postal_code, shipping_city, shipping_phone_number, created_at) VALUES ?';
      const orderData = orders.map(o => [o.id, o.user_id, o.total_amount, o.status, o.shipping_first_name, o.shipping_last_name, o.shipping_email, o.shipping_address, o.shipping_postal_code, o.shipping_city, o.shipping_phone_number, o.created_at]);
      await mysqlPool.query(orderQuery, [orderData]);
      logger.info(`Migrated ${orders.length} orders.`);
    }

    // Migrate Order Items
    const orderItems = await all(sqliteDb, 'SELECT * FROM order_items');
    if (orderItems.length > 0) {
      // Temporarily disable foreign key checks for order items migration
      await mysqlPool.query('SET FOREIGN_KEY_CHECKS=0');
      const orderItemQuery = 'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES ?';
      const orderItemData = orderItems.map(oi => [oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price]);
      await mysqlPool.query(orderItemQuery, [orderItemData]);
      await mysqlPool.query('SET FOREIGN_KEY_CHECKS=1');
      logger.info(`Migrated ${orderItems.length} order items.`);
    }

    logger.info('Data migration completed successfully!');

  } catch (error) {
    logger.error('An error occurred during migration:', error);
  } finally {
    sqliteDb.close();
    if (mysqlPool) {
      mysqlPool.end();
    }
    process.exit();
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

migrate();
