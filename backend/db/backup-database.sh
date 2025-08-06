#!/bin/bash

# Fritid Database Backup Script
# Creates backups of the database schema and data

set -e

# Configuration
DB_NAME="fritid_db"
DB_USER="fritid_user"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Create backup directory
mkdir -p $BACKUP_DIR

echo "🗄️ Creating database backup..."

# Schema only backup (for version control)
print_info "Exporting schema..."
pg_dump -U $DB_USER -d $DB_NAME --schema-only --no-owner --no-privileges > "$BACKUP_DIR/schema_${DATE}.sql"
print_status "Schema exported to schema_${DATE}.sql"

# Data only backup (for development)
print_info "Exporting data..."
pg_dump -U $DB_USER -d $DB_NAME --data-only --no-owner --no-privileges > "$BACKUP_DIR/data_${DATE}.sql"
print_status "Data exported to data_${DATE}.sql"

# Full backup (compressed)
print_info "Creating full backup..."
pg_dump -U $DB_USER -d $DB_NAME -Fc > "$BACKUP_DIR/full_backup_${DATE}.dump"
print_status "Full backup created as full_backup_${DATE}.dump"

# Update latest schema for version control
cp "$BACKUP_DIR/schema_${DATE}.sql" "../db/migrations/current_schema.sql"
print_status "Updated current schema file"

echo ""
print_status "Backup complete!"
echo ""
echo "📁 Files created:"
echo "   Schema: $BACKUP_DIR/schema_${DATE}.sql"
echo "   Data: $BACKUP_DIR/data_${DATE}.sql" 
echo "   Full: $BACKUP_DIR/full_backup_${DATE}.dump"
echo ""
echo "🔄 To restore:"
echo "   Schema: psql -U $DB_USER -d $DB_NAME -f schema_${DATE}.sql"
echo "   Data: psql -U $DB_USER -d $DB_NAME -f data_${DATE}.sql"
echo "   Full: pg_restore -U $DB_USER -d $DB_NAME full_backup_${DATE}.dump"
