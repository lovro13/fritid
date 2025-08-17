const { getPool } = require('../database/db');

class OrderItem {
    constructor(orderItemData) {
        this.id = orderItemData.id;
        this.orderId = orderItemData.order_id;
        this.productId = orderItemData.product_id;
        this.quantity = orderItemData.quantity;
        this.price = parseFloat(orderItemData.price);
    }

    static async findByOrderId(orderId) {
        const pool = getPool();
        const [rows] = await pool.execute(
            'SELECT * FROM order_items WHERE order_id = ?',
            [orderId]
        );
        return rows.map(row => new OrderItem(row));
    }

    static async create(orderItemData) {
        const pool = getPool();
        const { orderId, productId, quantity, price } = orderItemData;

        const [result] = await pool.execute(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderId, productId, quantity, price]
        );

        return new OrderItem({
            id: result.insertId,
            order_id: orderId,
            product_id: productId,
            quantity,
            price
        });
    }

    static async createMultiple(orderItems) {
        const pool = getPool();
        const createdItems = [];
        
        for (const item of orderItems) {
            const [result] = await pool.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [item.orderId, item.productId, item.quantity, item.price]
            );
            
            createdItems.push(new OrderItem({
                id: result.insertId,
                order_id: item.orderId,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price
            }));
        }
        
        return createdItems;
    }

    static async deleteByOrderId(orderId) {
        const pool = getPool();
        const [result] = await pool.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
        return result.affectedRows;
    }
}

module.exports = OrderItem;
