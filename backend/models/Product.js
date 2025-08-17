const { getPool } = require('../database/db');

class Product {
    constructor(productData) {
        this.id = productData.id;
        this.name = productData.name;
        this.description = productData.description;
        this.price = parseFloat(productData.price);
        this.image_url = productData.image_url; // Keep as image_url for consistency
        console.log('About to parse colors:', productData.colors, 'Type:', typeof productData.colors);
        try {
            if (!productData.colors || productData.colors === null || productData.colors === '') {
                this.colors = [];
            } else if (productData.colors === '[deafult]' || productData.colors === '[default]') {
                // Handle the specific case where colors are stored as "[deafult]"
                this.colors = ['Default'];
            } else if (typeof productData.colors === 'string') {
                // Try to parse as JSON
                this.colors = JSON.parse(productData.colors);
            } else if (Array.isArray(productData.colors)) {
                this.colors = productData.colors;
            } else {
                this.colors = [];
            }
        } catch (error) {
            console.warn('Failed to parse colors for product', productData.id, ':', productData.colors);
            // If it's the problematic "[deafult]" text, convert it to a proper array
            if (productData.colors === '[deafult]' || productData.colors === '[default]') {
                this.colors = ['Default'];
            } else {
                this.colors = [];
            }
        }
        console.log('Parsed colors:', this.colors);
        this.category = productData.category;
        this.stock_quantity = productData.stock_quantity;
        this.is_active = Boolean(productData.is_active);
        this.created_at = productData.created_at;
    }

    static async findAll() {
        const [rows] = await getPool().query(
            'SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await getPool().query(
            'SELECT * FROM products WHERE id = ? LIMIT 1', [id]
        );
        return rows[0] || null;
    }

    static async search(q) {
        const like = `%${q}%`;
        const [rows] = await getPool().query(
            'SELECT * FROM products WHERE is_active = 1 AND (name LIKE ? OR description LIKE ?) ORDER BY id DESC',
            [like, like]
        );
        return rows;
    }

    static async findByPriceRange(minPrice, maxPrice) {
        const [rows] = await getPool().query(
            'SELECT * FROM products WHERE is_active = 1 AND price BETWEEN ? AND ? ORDER BY price ASC',
            [minPrice, maxPrice]
        );
        return rows;
    }

    static async create(data) {
        const { name, description, price, image_url, colors, category, stock_quantity, is_active } = data;
        const [res] = await getPool().query(
            `INSERT INTO products
             (name, description, price, image_url, colors, category, stock_quantity, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                description ?? null,
                price ?? 0,
                image_url ?? null,
                colors ? JSON.stringify(colors) : null,
                category ?? null,
                stock_quantity ?? 0,
                is_active ?? 1
            ]
        );
        return this.findById(res.insertId);
    }

    static async delete(id) {
        const [res] = await getPool().query('DELETE FROM products WHERE id = ?', [id]);
        return res.affectedRows > 0;
    }
}

module.exports = Product;
