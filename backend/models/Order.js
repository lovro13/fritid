const { db } = require('../database/db');

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
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => new Order(row)));
                }
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new Order(row));
                } else {
                    resolve(null);
                }
            });
        });
    }

    static async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => new Order(row)));
                }
            });
        });
    }

    static async create(orderData) {
        return new Promise((resolve, reject) => {
            const {
                userId, totalAmount, status = Order.STATUS.PENDING,
                shippingFirstName, shippingLastName, shippingEmail,
                shippingAddress, shippingPostalCode, shippingCity, shippingPhoneNumber
            } = orderData;

            db.run(
                `INSERT INTO orders 
                 (user_id, total_amount, status, shipping_first_name, shipping_last_name, 
                  shipping_email, shipping_address, shipping_postal_code, shipping_city, shipping_phone_number) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, totalAmount, status, shippingFirstName, shippingLastName,
                 shippingEmail, shippingAddress, shippingPostalCode, shippingCity, shippingPhoneNumber],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        Order.findById(this.lastID).then(resolve).catch(reject);
                    }
                }
            );
        });
    }

    async updateStatus(newStatus) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE orders SET status = ? WHERE id = ?',
                [newStatus, this.id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.status = newStatus;
                        resolve(this);
                    }
                }
            );
        });
    }

    async loadOrderItems() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT oi.*, p.name as product_name, p.image_url as product_image_url 
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id = ?`,
                [this.id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.orderItems = rows.map(row => ({
                            id: row.id,
                            productId: row.product_id,
                            productName: row.product_name,
                            productImageUrl: row.product_image_url,
                            quantity: row.quantity,
                            price: parseFloat(row.price)
                        }));
                        resolve(this);
                    }
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            // First delete order items
            db.run('DELETE FROM order_items WHERE order_id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    // Then delete the order
                    db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this.changes > 0);
                        }
                    });
                }
            });
        });
    }
}

module.exports = Order;
