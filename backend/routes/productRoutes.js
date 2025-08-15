const express = require('express');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Search products (must come before /:id route)
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const products = await Product.search(q);
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});

// Get products by price range (must come before /:id route)
router.get('/price-range', async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        if (!minPrice || !maxPrice) {
            return res.status(400).json({ error: 'minPrice and maxPrice are required' });
        }
        const products = await Product.findByPriceRange(parseFloat(minPrice), parseFloat(maxPrice));
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by price range:', error);
        res.status(500).json({ error: 'Failed to fetch products by price range' });
    }
});

// Get all products
router.get('/', async (req, res) => {
    console.log("trying to get products")
    try {
        const products = await Product.findAll();
        return res.json(products);

    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
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

// Create product (admin only)
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product (admin only)
router.put('/admin/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update product properties
        const {
            name, description, price, imageUrl, colors,
            category, stockQuantity, isActive
        } = req.body;

        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (imageUrl !== undefined) product.imageUrl = imageUrl;
        if (colors !== undefined) product.colors = colors;
        if (category !== undefined) product.category = category;
        if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
        if (isActive !== undefined) product.isActive = isActive;

        await product.save();
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;
