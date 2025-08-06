# Fritid Database Management

This directory contains database migration files and management scripts for the Fritid webstore project.

## 🏗️ Database Structure

The project uses a **hybrid approach** for user and order management:

- **Users Table**: Stores registered user accounts with default profile information
- **Orders Table**: Supports both registered users and guest checkout with flexible shipping details
- **Products Table**: Product catalog management
- **Order Items Table**: Individual items within orders

### Key Features

- **Guest Checkout**: Orders can be placed without user registration
- **Flexible Shipping**: Orders can override user default shipping information
- **Version Control**: Database schema is tracked using Flyway migrations
- **Backup System**: Automated backup and restore capabilities

## 🚀 Quick Start

### First Time Setup

1. **Run the setup script:**
   ```bash
   cd backend/db
   ./setup-database.sh
   ```

2. **Start your Spring Boot application:**
   ```bash
   cd ../
   mvn spring-boot:run
   ```
   
   Flyway will automatically run migrations on startup.

### Daily Development

1. **Start PostgreSQL:**
   ```bash
   sudo systemctl start postgresql
   ```

2. **Connect to database:**
   ```bash
   psql -U fritid_user -d fritid_db
   ```

3. **Start the application:**
   ```bash
   mvn spring-boot:run
   ```

## 📁 Directory Structure

```
db/
├── migrations/                 # Flyway migration files (version controlled)
│   └── V1__Create_initial_tables.sql
├── seeds/                      # Sample data files (optional)
├── backups/                    # Database backups (not version controlled)
├── setup-database.sh          # Initial database setup
└── backup-database.sh         # Database backup script
```

## 🔄 Database Migrations

### Creating a New Migration

1. **Create a new migration file:**
   ```bash
   # Format: V{version}__{description}.sql
   touch src/main/resources/db/migration/V2__Add_product_categories.sql
   ```

2. **Add your SQL changes:**
   ```sql
   -- Example migration
   ALTER TABLE products ADD COLUMN category_id INTEGER;
   CREATE TABLE categories (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL
   );
   ```

3. **Restart the application** - Flyway will automatically run new migrations

### Migration Best Practices

- **Never modify existing migration files** - create new ones instead
- **Use descriptive names** for migration files
- **Test migrations** on a copy of production data
- **Include rollback instructions** in comments

## 💾 Backup and Restore

### Create Backup

```bash
cd backend/db
./backup-database.sh
```

This creates:
- `schema_*.sql` - Database structure only
- `data_*.sql` - Data only
- `full_backup_*.dump` - Complete backup (compressed)

### Restore from Backup

```bash
# Restore schema
psql -U fritid_user -d fritid_db -f backups/schema_20250806_120000.sql

# Restore data
psql -U fritid_user -d fritid_db -f backups/data_20250806_120000.sql

# Restore full backup
pg_restore -U fritid_user -d fritid_db backups/full_backup_20250806_120000.dump
```

## 🌐 Project Migration to New Computer

### Sender (Current Computer)

1. **Commit database schema:**
   ```bash
   git add .
   git commit -m "Add database migration files"
   git push
   ```

2. **Create backup (optional):**
   ```bash
   cd backend/db
   ./backup-database.sh
   ```

### Receiver (New Computer)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lovro13/fritid.git
   cd fritid
   ```

2. **Install dependencies:**
   ```bash
   # PostgreSQL
   sudo apt update
   sudo apt install postgresql postgresql-contrib pgadmin4
   
   # Java
   sudo apt install openjdk-17-jdk maven
   ```

3. **Setup database:**
   ```bash
   cd backend/db
   ./setup-database.sh
   ```

4. **Start the application:**
   ```bash
   cd ../
   mvn spring-boot:run
   ```

## 🔧 Troubleshooting

### PostgreSQL Won't Start
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Auto-start on boot
```

### Connection Issues
```bash
# Check if PostgreSQL is accepting connections
sudo -u postgres psql -c "\l"

# Reset user password
sudo -u postgres psql -c "ALTER USER fritid_user PASSWORD 'fritid_secure_pass';"
```

### Flyway Migration Errors
```bash
# Check migration status
mvn flyway:info

# Repair migrations (if needed)
mvn flyway:repair

# Baseline existing database
mvn flyway:baseline
```

### Reset Development Database
```bash
# Drop and recreate (WARNING: This deletes all data!)
sudo -u postgres psql -c "DROP DATABASE fritid_db;"
sudo -u postgres psql -c "CREATE DATABASE fritid_db OWNER fritid_user;"

# Restart application to run migrations
mvn spring-boot:run
```

## 🔐 Security Notes

- Database credentials are stored in `application.properties` (not version controlled)
- Use environment variables for production credentials
- Regular backups are recommended
- Consider encryption for sensitive data

## 📝 Environment Variables (Production)

```bash
export DB_HOST=your-production-host
export DB_NAME=fritid_production
export DB_USER=fritid_prod_user
export DB_PASSWORD=your-secure-password
```

Update `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:5432/${DB_NAME:fritid_db}
spring.datasource.username=${DB_USER:fritid_user}
spring.datasource.password=${DB_PASSWORD:fritid_secure_pass}
```
