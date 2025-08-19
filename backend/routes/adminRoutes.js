const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');
const logger = require('../logger');

// Get all products (admin view with more details)
router.get('/products', adminAuth, async (req, res) => {
    try {
        const products = await Product.findAll();
        logger.info('Admin fetched all products successfully');
        res.json(products);
    } catch (error) {
        logger.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product by ID
router.get('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            logger.warn(`Product with ID ${req.params.id} not found`);
            return res.status(404).json({ error: 'Product not found' });
        }
        logger.info(`Admin fetched product ${req.params.id}`);
        res.json(product);
    } catch (error) {
        logger.error(`Error fetching product ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create new product
router.post('/products', adminAuth, async (req, res) => {
    try {
        const { name, description, price, image_url, colors, category, stock_quantity } = req.body;
        
        if (!name || !price || !image_url) {
            logger.warn('Attempted to create product with missing required fields');
            return res.status(400).json({ error: 'Name, price, and image URL are required' });
        }

        const productData = {
            name,
            description: description || '',
            price: parseFloat(price),
            image_url,
            colors: Array.isArray(colors) ? JSON.stringify(colors) : colors || '[]',
            category: category || '',
            stock_quantity: parseInt(stock_quantity) || 0
        };

        const product = await Product.create(productData);
        logger.info(`Admin created new product: ${name} (ID: ${product.id})`);
        res.status(201).json(product);
    } catch (error) {
        logger.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            logger.warn(`Attempted to update non-existent product ${req.params.id}`);
            return res.status(404).json({ error: 'Product not found' });
        }

        const { name, description, price, image_url, colors, category, stock_quantity, is_active } = req.body;
        
        // Create updated product data
        const productData = {
            name: name !== undefined ? name : product.name,
            description: description !== undefined ? description : product.description,
            price: price !== undefined ? parseFloat(price) : product.price,
            image_url: image_url !== undefined ? image_url : product.image_url,
            colors: colors !== undefined ? colors : product.colors,
            category: category !== undefined ? category : product.category,
            stock_quantity: stock_quantity !== undefined ? parseInt(stock_quantity) : product.stock_quantity,
            is_active: is_active !== undefined ? Boolean(is_active) : product.is_active
        };

        const updatedProduct = await Product.update(req.params.id, productData);
        logger.info(`Admin updated product ${req.params.id}`);
        res.json(updatedProduct);
    } catch (error) {
        logger.error(`Error updating product ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
    try {
        const deleted = await Product.delete(req.params.id);
        if (!deleted) {
            logger.warn(`Attempted to delete non-existent product ${req.params.id}`);
            return res.status(404).json({ error: 'Product not found' });
        }
        logger.info(`Admin deleted product ${req.params.id}`);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting product ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Toggle product active status
router.patch('/products/:id/toggle-active', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            logger.warn(`Attempted to toggle status of non-existent product ${req.params.id}`);
            return res.status(404).json({ error: 'Product not found' });
        }

        product.is_active = !product.is_active;
        const updatedProduct = await product.save();
        logger.info(`Admin toggled product ${req.params.id} active status to ${product.is_active}`);
        res.json(updatedProduct);
    } catch (error) {
        logger.error(`Error toggling product ${req.params.id} status:`, error);
        res.status(500).json({ error: 'Failed to toggle product status' });
    }
});

module.exports = router;
