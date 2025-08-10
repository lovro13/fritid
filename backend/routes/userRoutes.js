const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users.map(user => user.toJSON()));
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.toJSON());
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
    try {
        const user = await User.findByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.toJSON());
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Check if email exists
router.get('/exists/email/:email', async (req, res) => {
    try {
        const exists = await User.emailExists(req.params.email);
        res.json(exists);
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Failed to check email' });
    }
});

// Create user
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = await User.create({ firstName, lastName, email, password });
        res.status(201).json(user.toJSON());
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user properties
        const { firstName, lastName, email } = req.body;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        await user.save();
        res.json(user.toJSON());
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Update user profile
router.put('/:id/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update profile fields
        const { address, postalCode, city, phoneNumber } = req.body;
        if (address !== undefined) user.address = address;
        if (postalCode !== undefined) user.postalCode = postalCode;
        if (city !== undefined) user.city = city;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

        await user.save();
        res.json(user.toJSON());
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

// Delete user
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await User.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
