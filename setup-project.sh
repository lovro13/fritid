#!/bin/bash

# Fritid Project Setup Script
# Sets up the complete development environment for the Fritid webstore project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}🚀 $1${NC}"
    echo "=================================================="
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header "Fritid Development Environment Setup"

# Check if we're in the right directory
if [ ! -f "backend/pom.xml" ] || [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# 1. Check Java installation
print_header "Checking Java Installation"
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    print_status "Java found: $JAVA_VERSION"
else
    print_warning "Java not found. Installing OpenJDK 17..."
    sudo apt update
    sudo apt install -y openjdk-17-jdk maven
    print_status "Java 17 installed"
fi

# 2. Check Node.js installation
print_header "Checking Node.js Installation"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_warning "Node.js not found. Please install Node.js 18+ manually"
    echo "Visit: https://nodejs.org/"
fi

# 3. Check PostgreSQL installation
print_header "Checking PostgreSQL Installation"
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version | cut -d' ' -f3)
    print_status "PostgreSQL found: $PG_VERSION"
else
    print_warning "PostgreSQL not found. Installing..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    print_status "PostgreSQL installed"
fi

# 4. Setup Database
print_header "Setting up Database"
cd backend/db
./setup-database.sh
cd ../..
print_status "Database setup completed"

# 5. Install Backend Dependencies
print_header "Installing Backend Dependencies"
cd backend
mvn clean install -DskipTests
print_status "Backend dependencies installed"
cd ..

# 6. Install Frontend Dependencies
print_header "Installing Frontend Dependencies"
if command -v npm &> /dev/null; then
    cd frontend
    npm install
    print_status "Frontend dependencies installed"
    cd ..
else
    print_warning "npm not found. Skipping frontend setup"
fi

# 7. Run initial tests
print_header "Running Initial Tests"
cd backend
mvn test
if [ $? -eq 0 ]; then
    print_status "All tests passed"
else
    print_warning "Some tests failed - this might be expected for initial setup"
fi
cd ..

# 8. Create environment setup script
print_header "Creating Environment Scripts"
cat > start-dev.sh << 'EOF'
#!/bin/bash

# Start development servers for Fritid

echo "🚀 Starting Fritid Development Environment..."

# Start PostgreSQL if not running
if ! sudo systemctl is-active --quiet postgresql; then
    echo "Starting PostgreSQL..."
    sudo systemctl start postgresql
fi

# Start backend in background
echo "Starting backend server..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start frontend
echo "Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development servers started!"
echo "📍 Backend: http://localhost:8080"
echo "📍 Frontend: http://localhost:4200"
echo "📍 Database: localhost:5432"
echo ""
echo "To stop servers:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
EOF

chmod +x start-dev.sh
print_status "Development startup script created"

# 9. Final instructions
print_header "Setup Complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start development: ./start-dev.sh"
echo "   2. Open browser: http://localhost:4200"
echo "   3. API docs: http://localhost:8080"
echo ""
echo "📖 Useful commands:"
echo "   Database console: psql -U ${DB_USER:-lovrozs} -d ${DB_NAME:-webstore_db}"
echo "   Backend only: cd backend && mvn spring-boot:run"
echo "   Frontend only: cd frontend && npm start"
echo "   Run tests: cd backend && mvn test"
echo ""
echo "📁 Project structure:"
echo "   📂 backend/     - Spring Boot API"
echo "   📂 frontend/    - Angular application"
echo "   📂 backend/db/  - Database migrations and scripts"
echo ""
print_status "Development environment ready! 🎉"
