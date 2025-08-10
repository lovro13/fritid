const { db } = require('../database/db');

class Product {
    constructor(productData) {
        this.id = productData.id;
        this.name = productData.name;
        this.description = productData.description;
        this.price = parseFloat(productData.price);
        this.imageUrl = productData.image_url;
        this.colors = productData.colors ? JSON.parse(productData.colors) : [];
        this.category = productData.category;
        this.stockQuantity = productData.stock_quantity;
        this.isActive = Boolean(productData.is_active);
        this.createdAt = productData.created_at;
    }

    static async findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM products WHERE is_active = 1', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => new Product(row)));
                }
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new Product(row));
                } else {
                    resolve(null);
                }
            });
        });
    }

    static async search(query) {
        return new Promise((resolve, reject) => {
            const searchTerm = `%${query}%`;
            db.all(
                'SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?) AND is_active = 1',
                [searchTerm, searchTerm],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.map(row => new Product(row)));
                    }
                }
            );
        });
    }

    static async findByPriceRange(minPrice, maxPrice) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM products WHERE price BETWEEN ? AND ? AND is_active = 1',
                [minPrice, maxPrice],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.map(row => new Product(row)));
                    }
                }
            );
        });
    }

    static async create(productData) {
        return new Promise((resolve, reject) => {
            const {
                name, description, price, imageUrl, colors = [],
                category, stockQuantity = 0, isActive = true
            } = productData;

            db.run(
                `INSERT INTO products 
                 (name, description, price, image_url, colors, category, stock_quantity, is_active) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, description, price, imageUrl, JSON.stringify(colors), 
                 category, stockQuantity, isActive ? 1 : 0],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        Product.findById(this.lastID).then(resolve).catch(reject);
                    }
                }
            );
        });
    }

    async save() {
        return new Promise((resolve, reject) => {
            if (this.id) {
                // Update existing product
                db.run(
                    `UPDATE products SET 
                     name = ?, description = ?, price = ?, image_url = ?, 
                     colors = ?, category = ?, stock_quantity = ?, is_active = ?
                     WHERE id = ?`,
                    [this.name, this.description, this.price, this.imageUrl,
                     JSON.stringify(this.colors), this.category, this.stockQuantity, 
                     this.isActive ? 1 : 0, this.id],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this);
                        }
                    }
                );
            } else {
                reject(new Error('Cannot save product without ID'));
            }
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    static async updateStock(id, quantity) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
                [quantity, id, quantity],
                function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) {
                        reject(new Error('Insufficient stock'));
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }
}

module.exports = Product;
