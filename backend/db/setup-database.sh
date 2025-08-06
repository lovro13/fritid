#!/bin/bash

# Fritid Database Setup Script
# This script sets up the PostgreSQL database for the Fritid project

set -e  # Exit on any error

echo "🚀 Setting up Fritid Database..."

# Configuration
DB_NAME="fritid_db"
DB_USER="fritid_user"
DB_PASSWORD="fritid_secure_pass"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if PostgreSQL is running
echo "Checking PostgreSQL status..."
if ! sudo systemctl is-active --quiet postgresql; then
    print_warning "PostgreSQL is not running. Starting it now..."
    sudo systemctl start postgresql
    print_status "PostgreSQL started"
else
    print_status "PostgreSQL is already running"
fi

# Create database user
echo "Creating database user..."
sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
print_status "Database user '${DB_USER}' ready"

# Create database
echo "Creating database..."
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
print_status "Database '${DB_NAME}' ready"

# Grant privileges
echo "Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -d ${DB_NAME} -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"
print_status "Privileges granted"

# Create application.properties if it doesn't exist
PROPS_FILE="../src/main/resources/application.properties"
if [ ! -f "$PROPS_FILE" ]; then
    echo "Creating application.properties..."
    cp ../src/main/resources/application.properties.template "$PROPS_FILE"
    
    # Update the template with actual values
    sed -i "s/your_database_name/${DB_NAME}/g" "$PROPS_FILE"
    sed -i "s/your_username/${DB_USER}/g" "$PROPS_FILE"
    sed -i "s/your_password/${DB_PASSWORD}/g" "$PROPS_FILE"
    
    print_status "application.properties created"
else
    print_warning "application.properties already exists, skipping..."
fi

echo ""
print_status "Database setup complete!"
echo ""
echo "📋 Database Details:"
echo "   Database: ${DB_NAME}"
echo "   Username: ${DB_USER}"
echo "   Password: ${DB_PASSWORD}"
echo "   URL: jdbc:postgresql://localhost:5432/${DB_NAME}"
echo ""
echo "🎯 Next steps:"
echo "   1. Run 'mvn spring-boot:run' to start the application"
echo "   2. Flyway will automatically run migrations on startup"
echo "   3. Check http://localhost:8080 to verify the application is running"
echo ""
echo "🛠 Useful commands:"
echo "   Connect to database: psql -U ${DB_USER} -d ${DB_NAME}"
echo "   View tables: \\dt"
echo "   Exit psql: \\q"
