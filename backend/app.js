const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet'); // Import helmet

// Load environment variables
const envPath = process.env.DOTENV_CONFIG_PATH || '.env';
dotenv.config({ path: envPath });
console.log(`Loading environment from: ${envPath}`);

// Import database initialization
console.log(process.env.NODE_ENV)
const { initializeDatabase } = require('./database/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const adminRoutes = require('./routes/adminRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// --- Production Configuration ---
const isProduction = process.env.NODE_ENV === 'production';
// IMPORTANT: Set FRONTEND_URL in your .env file for production
const allowedOrigins = isProduction 
  ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []) // e.g., 'https://your-frontend-app.com'
  : ['http://localhost:4200', 'http://127.0.0.1:4200']; // Angular dev server

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 && !isProduction) { 
        // Allow all origins in dev if FRONTEND_URL is not set
        return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions)); // Use configured CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images with CORS headers
app.use('/api/images', cors(corsOptions), express.static(path.join(__dirname, 'uploads/images/products')));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/account', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
// The static middleware above handles GET requests, imageRoutes can handle other methods if needed.
app.use('/api/images', imageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Fritid Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
