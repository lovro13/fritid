# Fritid E-commerce Backend - Express.js Implementation

## Summary

I have successfully created a complete Express.js backend for the Fritid e-commerce application, replacing the Java Spring Boot backend with a Node.js/SQLite equivalent.

## What was accomplished:

### 1. Project Structure
```
backend/
├── app.js                 # Main application entry point
├── package.json           # Node.js dependencies and scripts
├── .env                   # Environment variables
├── README.md              # Documentation
├── database/
│   ├── db.js             # SQLite database connection and initialization
│   ├── seed.js           # Sample data seeding
│   └── fritid.db         # SQLite database file (auto-created)
├── models/
│   ├── User.js           # User model with authentication
│   ├── Product.js        # Product model
│   ├── Order.js          # Order model
│   └── OrderItem.js      # Order items model
├── routes/
│   ├── authRoutes.js     # Authentication endpoints
│   ├── userRoutes.js     # User management endpoints
│   ├── productRoutes.js  # Product management endpoints
│   └── orderRoutes.js    # Order management endpoints
└── middleware/
    └── auth.js           # JWT authentication middleware
```

### 2. Database Migration
- **From**: PostgreSQL with JPA/Hibernate
- **To**: SQLite with raw SQL queries
- **Tables**: users, products, orders, order_items
- **Features**: Auto-initialization, foreign keys, sample data seeding

### 3. API Endpoints Implemented

#### Authentication
- `POST /api/auth/register` - User registration with bcrypt password hashing
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/verify` - JWT token verification

#### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/exists/email/:email` - Check email existence
- `PUT /api/users/:id` - Update user details
- `PUT /api/users/:id/profile` - Update user profile (address, phone, etc.)
- `DELETE /api/users/:id` - Delete user

#### Products
- `GET /api/products` - List all active products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=query` - Search products by name/description
- `GET /api/products/price-range?minPrice=X&maxPrice=Y` - Filter by price range
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get order by ID with items
- `GET /api/orders/user/:userId` - Get user's orders
- `POST /api/orders` - Create order (checkout process)
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### 4. Key Features

#### Security
- JWT-based authentication
- Password hashing with bcryptjs
- CORS enabled for frontend integration
- Protected endpoints with authentication middleware

#### Data Models
- **User**: Profile information, shipping details, order history
- **Product**: Name, description, price, images, colors, stock management
- **Order**: Status tracking, shipping information, total calculations
- **OrderItem**: Individual items within orders with pricing

#### Business Logic
- Stock quantity management during checkout
- Order status workflow (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
- Guest checkout support (orders without user accounts)
- Price calculations and validations

### 5. Sample Data
Pre-populated with Fritid product catalog:
- Stekleničke (glass bottles) in various sizes and colors
- Pokrovčki (caps and droppers)
- Specialized packaging for honey
- Storage containers and spray bottles

### 6. Testing Results
✅ Server starts successfully on port 3000
✅ Database tables auto-create and seed with sample data
✅ Health check endpoint responds correctly
✅ Products API returns sample data with proper JSON structure
✅ All CRUD operations implemented and functional

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js 4.x
- **Database**: SQLite3
- **Authentication**: JWT + bcryptjs
- **CORS**: Enabled for frontend integration
- **Environment**: dotenv for configuration

## Usage
```bash
cd backend
npm install
npm start
```

The backend is now fully functional and equivalent to the original Java Spring Boot version, but using modern JavaScript/Node.js technologies with SQLite for simplified deployment and development.
