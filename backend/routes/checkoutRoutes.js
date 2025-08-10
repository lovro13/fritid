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
        const orderItemsPromises = cartItems.map(item => {
            return OrderItem.create({
                orderId: order.id,
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
                color: item.selectedColor,
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
