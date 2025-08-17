const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

// POST /api/checkout
router.post('/', async (req, res) => {
    console.log(req.body)
    const { personInfo, cartItems, userId } = req.body;
    if (!personInfo || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: 'Invalid checkout data' });
    }

    try {
        // Calculate total amount
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // Create order
        const order = await Order.create({
            userId: userId || null, // Handle guest checkout
            totalAmount: totalAmount.toFixed(2),
            status: 'Pending',
            shippingFirstName: personInfo.firstName,
            shippingLastName: personInfo.lastName,
            shippingAddress: personInfo.address,
            shippingEmail: personInfo.email,
            shippingPhoneNumber: personInfo.phone,
            shippingCity: personInfo.city,
            shippingPostalCode: personInfo.postalCode,
        });

        if (!order) {
            throw new Error('Failed to create order.');
        }

        // Create order items
        console.log('Creating order items for order ID:', order.id);
        
        // Validate that all products exist before creating order items
        const Product = require('../models/Product');
        
        // First, let's see what products exist in the database
        const allProducts = await Product.findAll();
        console.log('Available products in database:');
        allProducts.forEach(p => {
            console.log(`- Product ID: ${p.id}, Name: ${p.name}`);
        });
        
        // Then validate each cart item
        for (const item of cartItems) {
            console.log(`Checking if product ID ${item.product.id} exists...`);
            const product = await Product.findById(item.product.id);
            if (!product) {
                console.log(`❌ Product with ID ${item.product.id} not found in database`);
                console.log('Available product IDs:', allProducts.map(p => p.id));
                throw new Error(`Product with ID ${item.product.id} not found in database`);
            }
            console.log(`✅ Product ${item.product.id} exists in database`);
        }
        
        const orderItemsPromises = cartItems.map(async (item) => {
            console.log('Processing cart item:', {
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                selectedColor: item.selectedColor
            });
            
            return OrderItem.create({
                orderId: order.id,
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            });
        });

        await Promise.all(orderItemsPromises);

        res.status(201).json({ success: true, message: 'Checkout successful', orderId: order.id });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Failed to process checkout' });
    }
});

module.exports = router;
