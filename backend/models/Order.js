const { getPool } = require('../database/db');

class Order {
    constructor(orderData) {
        this.id = orderData.id;
        this.userId = orderData.user_id;
        this.totalAmount = parseFloat(orderData.total_amount);
        this.status = orderData.status;
        this.shippingFirstName = orderData.shipping_first_name;
        this.shippingLastName = orderData.shipping_last_name;
        this.shippingEmail = orderData.shipping_email;
        this.shippingAddress = orderData.shipping_address;
        this.shippingPostalCode = orderData.shipping_postal_code;
        this.shippingCity = orderData.shipping_city;
        this.shippingPhoneNumber = orderData.shipping_phone_number;
        this.createdAt = orderData.created_at;
        this.orderItems = [];
    }

    static get STATUS() {
        return {
            PENDING: 'PENDING',
            CONFIRMED: 'CONFIRMED',
            PROCESSING: 'PROCESSING',
            SHIPPED: 'SHIPPED',
            DELIVERED: 'DELIVERED',
            CANCELLED: 'CANCELLED'
        };
    }

    static async findAll() {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
        return rows.map(row => new Order(row));
    }

    static async findById(id) {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return rows.length > 0 ? new Order(rows[0]) : null;
    }

    static async findByUserId(userId) {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows.map(row => new Order(row));
    }

    static async create(orderData) {
        const pool = getPool();
        const {
            userId, totalAmount, status = Order.STATUS.PENDING,
            shippingFirstName, shippingLastName, shippingEmail,
            shippingAddress, shippingPostalCode, shippingCity, shippingPhoneNumber
        } = orderData;

        const [result] = await pool.execute(
            `INSERT INTO orders 
             (user_id, total_amount, status, shipping_first_name, shipping_last_name, 
              shipping_email, shipping_address, shipping_postal_code, shipping_city, shipping_phone_number) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, totalAmount, status, shippingFirstName, shippingLastName,
             shippingEmail, shippingAddress, shippingPostalCode, shippingCity, shippingPhoneNumber]
        );

        return Order.findById(result.insertId);
    }

    async updateStatus(newStatus) {
        const pool = getPool();
        await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [newStatus, this.id]
        );
        this.status = newStatus;
        return this;
    }

    async loadOrderItems() {
        const pool = getPool();
        const [rows] = await pool.execute(
            `SELECT oi.*, p.name as product_name, p.image_url as product_image_url 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [this.id]
        );
        
        this.orderItems = rows.map(row => ({
            id: row.id,
            productId: row.product_id,
            productName: row.product_name,
            productImageUrl: row.product_image_url,
            quantity: row.quantity,
            price: parseFloat(row.price)
        }));
        
        return this;
    }

    static async delete(id) {
        const pool = getPool();
        
        // First delete order items
        await pool.execute('DELETE FROM order_items WHERE order_id = ?', [id]);
        
        // Then delete the order
        const [result] = await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Order;
