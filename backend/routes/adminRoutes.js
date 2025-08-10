const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

// Get all products (admin view with more details)
router.get('/products', adminAuth, async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product by ID
router.get('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create new product
router.post('/products', adminAuth, async (req, res) => {
    try {
        const { name, description, price, imageUrl, colors, category, stockQuantity } = req.body;
        
        if (!name || !price || !imageUrl) {
            return res.status(400).json({ error: 'Name, price, and image URL are required' });
        }

        const productData = {
            name,
            description: description || '',
            price: parseFloat(price),
            imageUrl,
            colors: Array.isArray(colors) ? JSON.stringify(colors) : colors || '[]',
            category: category || '',
            stockQuantity: parseInt(stockQuantity) || 0
        };

        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { name, description, price, imageUrl, colors, category, stockQuantity, isActive } = req.body;
        
        // Update product properties
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (imageUrl !== undefined) product.imageUrl = imageUrl;
        if (colors !== undefined) product.colors = Array.isArray(colors) ? JSON.stringify(colors) : colors;
        if (category !== undefined) product.category = category;
        if (stockQuantity !== undefined) product.stockQuantity = parseInt(stockQuantity);
        if (isActive !== undefined) product.isActive = Boolean(isActive);

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
    try {
        const deleted = await Product.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Toggle product active status
router.patch('/products/:id/toggle-active', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        product.isActive = !product.isActive;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error toggling product status:', error);
        res.status(500).json({ error: 'Failed to toggle product status' });
    }
});

module.exports = router;
