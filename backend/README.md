# Fritid Backend

Express.js backend for the Fritid e-commerce application using SQLite database.

## Features

- User authentication with JWT tokens
- Product management (CRUD operations)
- Order management with cart functionality
- SQLite database with automatic initialization
- RESTful API endpoints
- CORS enabled for frontend integration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/exists/email/:email` - Check if email exists
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/price-range?minPrice=X&maxPrice=Y` - Get products by price range
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get orders by user ID
- `POST /api/orders` - Create order (checkout)
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key_here
   DATABASE_PATH=./database/fritid.db
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Database

The application uses SQLite database with the following tables:
- `users` - User accounts and profiles
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Individual items within orders

The database is automatically initialized on first run, and sample data is seeded in development mode.

## Models

### User
- id, firstName, lastName, email, passwordHash
- address, postalCode, city, phoneNumber
- createdAt

### Product
- id, name, description, price, imageUrl
- colors (JSON array), category, stockQuantity, isActive
- createdAt

### Order
- id, userId, totalAmount, status
- shipping information (firstName, lastName, email, address, etc.)
- createdAt

### OrderItem
- id, orderId, productId, quantity, price

## Status Codes

Orders can have the following statuses:
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED
