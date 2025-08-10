const { db } = require('../database/db');

class OrderItem {
    constructor(orderItemData) {
        this.id = orderItemData.id;
        this.orderId = orderItemData.order_id;
        this.productId = orderItemData.product_id;
        this.quantity = orderItemData.quantity;
        this.price = parseFloat(orderItemData.price);
    }

    static async findByOrderId(orderId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM order_items WHERE order_id = ?',
                [orderId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.map(row => new OrderItem(row)));
                    }
                }
            );
        });
    }

    static async create(orderItemData) {
        return new Promise((resolve, reject) => {
            const { orderId, productId, quantity, price } = orderItemData;

            db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, productId, quantity, price],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new OrderItem({
                            id: this.lastID,
                            order_id: orderId,
                            product_id: productId,
                            quantity,
                            price
                        }));
                    }
                }
            );
        });
    }

    static async createMultiple(orderItems) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
            
            const createdItems = [];
            let completed = 0;
            
            orderItems.forEach((item) => {
                stmt.run([item.orderId, item.productId, item.quantity, item.price], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    createdItems.push(new OrderItem({
                        id: this.lastID,
                        order_id: item.orderId,
                        product_id: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }));
                    
                    completed++;
                    if (completed === orderItems.length) {
                        stmt.finalize();
                        resolve(createdItems);
                    }
                });
            });
        });
    }

    static async deleteByOrderId(orderId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM order_items WHERE order_id = ?', [orderId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }
}

module.exports = OrderItem;
