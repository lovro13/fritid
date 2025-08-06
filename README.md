# 🛒 Fritid Webstore

A modern e-commerce platform built with **Spring Boot** (backend) and **Angular** (frontend), featuring a hybrid user system that supports both registered users and guest checkout.

## 🌟 Features

- **Hybrid User System**: Supports both registered users and guest checkout
- **Flexible Shipping**: Users can use default addresses or specify custom shipping details per order
- **Product Management**: Complete product catalog with categories and inventory tracking
- **Order Management**: Full order lifecycle from creation to delivery
- **Database Migrations**: Version-controlled database schema using Flyway
- **Modern UI**: Responsive Angular frontend with SCSS styling
- **RESTful API**: Well-documented Spring Boot REST API

## 🚀 Quick Start

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **PostgreSQL 12+**
- **Maven 3.8+**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lovro13/fritid.git
   cd fritid
   ```

2. **Run the setup script:**
   ```bash
   ./setup-project.sh
   ```

3. **Start development servers:**
   ```bash
   ./start-dev.sh
   ```

4. **Open your browser:**
   - Frontend: http://localhost:4200
   - API: http://localhost:8080

## 🏗️ Project Structure

```
fritid/
├── 📂 backend/           # Spring Boot API
│   ├── 📂 src/main/java/  # Java source code
│   ├── 📂 src/main/resources/  # Configuration files
│   ├── 📂 db/            # Database scripts and migrations
│   └── 📄 pom.xml        # Maven configuration
├── 📂 frontend/          # Angular application
│   ├── 📂 src/app/       # Angular components and services
│   ├── 📂 src/assets/    # Static assets (images, etc.)
│   └── 📄 package.json   # NPM configuration
└── 📄 setup-project.sh   # One-click development setup
```

## 🗄️ Database Architecture

The project uses a **hybrid approach** for user and order management:

### Core Tables
- **`users`** - Registered user accounts with default profile information
- **`orders`** - Supports both user and guest orders with flexible shipping
- **`order_items`** - Individual items within each order
- **`products`** - Product catalog with inventory management

### Key Features
- **Guest Checkout**: Orders can be placed without registration
- **Shipping Flexibility**: Override default user shipping addresses per order
- **Version Control**: Database schema tracked with Flyway migrations
- **Data Integrity**: Comprehensive constraints and relationships

## 🔧 Development

### Backend (Spring Boot)

```bash
cd backend

# Start the API server
mvn spring-boot:run

# Run tests
mvn test

# Create database backup
./db/backup-database.sh
```

**Key Endpoints:**
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/orders` - List orders
- `POST /api/orders` - Create new order
- `GET /api/products` - List products

### Frontend (Angular)

```bash
cd frontend

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Database Management

```bash
cd backend/db

# Setup database (first time)
./setup-database.sh

# Create backup
./backup-database.sh

# Connect to database
psql -U fritid_user -d fritid_db
```

## 📦 API Documentation

The API follows RESTful conventions with JSON responses:

### User Management
```http
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "passwordHash": "hashed_password",
  "name": "John Doe",
  "address": "123 Main St",
  "postalCode": "12345",
  "city": "New York",
  "country": "USA"
}
```

### Order Creation (Registered User)
```http
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "orderItems": [
    {
      "productName": "Sample Product",
      "price": 29.99,
      "quantity": 2
    }
  ]
}
```

### Guest Order
```http
POST /api/orders
Content-Type: application/json

{
  "guestEmail": "guest@example.com",
  "guestName": "Guest Customer",
  "orderItems": [...],
  "shippingDetails": {
    "name": "Guest Customer",
    "address": "456 Guest St",
    "postalCode": "67890",
    "city": "Guest City",
    "country": "USA"
  }
}
```

## 🚀 Deployment

### Environment Variables

For production, set these environment variables:

```bash
export DB_HOST=your-production-host
export DB_NAME=fritid_production
export DB_USER=fritid_prod_user
export DB_PASSWORD=your-secure-password
export CORS_ORIGINS=https://yourdomain.com
```

### Docker Support (Optional)

```dockerfile
# Dockerfile for backend
FROM openjdk:17-jdk-slim
COPY target/fritid-backend.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test                    # Run all tests
mvn test -Dtest=UserTest    # Run specific test
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run unit tests
npm run e2e                 # Run end-to-end tests
```

## 📝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**: `mvn test && npm test`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Database Changes

When making database changes:

1. **Create a new migration**: `V{version}__{description}.sql`
2. **Never modify existing migrations**
3. **Test on sample data**
4. **Include rollback instructions in comments**

## 🔐 Security

- **Password Hashing**: Uses bcrypt for secure password storage
- **Environment Variables**: Sensitive configuration kept in environment variables
- **SQL Injection Protection**: Uses JPA/Hibernate with prepared statements
- **CORS Configuration**: Configurable cross-origin resource sharing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lovro** - Lead Developer ([lovro13](https://github.com/lovro13))

## 🆘 Support

If you encounter any issues:

1. **Check the logs**: Backend logs show detailed error information
2. **Database issues**: See `backend/db/README.md` for troubleshooting
3. **Create an issue**: Use GitHub issues for bug reports
4. **Contact**: Reach out to the development team

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with user and order management
- Guest checkout functionality
- Database migration system
- Angular frontend with responsive design
- RESTful API with comprehensive endpoints

---

**Happy coding! 🎉**
