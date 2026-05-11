#!/bin/bash

# Database seeding script for SOC Academy
# Loads initial data into PostgreSQL

set -e

echo "🌱 SOC Academy Database Seeding"
echo "================================"

# Check if running in Docker
if command -v docker-compose &> /dev/null; then
    echo "Detected Docker environment"
    DB_CONTAINER="soc-postgres"
    DB_USER="soc_user"
    DB_NAME="soc_platform"
    
    echo "Waiting for database to be ready..."
    sleep 5
    
    echo "Loading initial seed data..."
    docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" < database/seeds/001_initial_seed.sql
    
    echo "✓ Seed data loaded successfully"
    
    # Display summary
    echo ""
    echo "📊 Database Summary:"
    docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 'Courses' as entity, COUNT(*) as count FROM courses
    UNION ALL
    SELECT 'Labs', COUNT(*) FROM labs
    UNION ALL
    SELECT 'Users', COUNT(*) FROM users
    UNION ALL
    SELECT 'Certificates', COUNT(*) FROM certificates
    UNION ALL
    SELECT 'Lab Submissions', COUNT(*) FROM lab_submissions;"
    
else
    echo "Running locally (not in Docker)"
    echo "Please make sure PostgreSQL is running and .env is configured"
    
    # Source environment variables
    if [ -f .env ]; then
        export $(cat .env | grep -v '#' | xargs)
    fi
    
    # Extract connection details
    DB_USER="${DATABASE_USER:-soc_user}"
    DB_NAME="${DATABASE_NAME:-soc_platform}"
    DB_HOST="${DATABASE_HOST:-localhost}"
    
    echo "Connecting to: $DB_HOST/$DB_NAME as $DB_USER"
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" < database/seeds/001_initial_seed.sql
    
    echo "✓ Seed data loaded successfully"
fi

echo ""
echo "🎉 Database seeding complete!"
echo "You can now log in with:"
echo "  Email: alice@example.com"
echo "  Password: student123"
