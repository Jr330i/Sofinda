#!/bin/bash

# Setup Validation Script

set -e

echo "🔍 Validating Property Management System setup..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "   Run: cp .env.docker .env"
    echo "   Then edit .env with your actual values"
    exit 1
fi

# Source environment variables
source .env

echo "📋 Environment Variables Check:"

# Required variables
required_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "DATABASE_URL" "JWT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
        echo "   ❌ $var: Missing"
    elif [[ "${!var}" == *"your_"* ]] || [[ "${!var}" == *"[password]"* ]]; then
        missing_vars+=("$var")
        echo "   ⚠️  $var: Still contains placeholder value"
    else
        echo "   ✅ $var: Set"
    fi
done

# Optional but recommended variables
optional_vars=("SUPABASE_SERVICE_ROLE_KEY" "VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY")

for var in "${optional_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "   ⚠️  $var: Missing (optional but recommended)"
    elif [[ "${!var}" == *"your_"* ]]; then
        echo "   ⚠️  $var: Still contains placeholder value"
    else
        echo "   ✅ $var: Set"
    fi
done

echo ""

# Check if there are missing required variables
if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "❌ Setup validation failed!"
    echo "   Missing or incomplete variables: ${missing_vars[*]}"
    echo ""
    echo "📝 Next steps:"
    echo "1. Edit your .env file with actual values"
    echo "2. Get credentials from your Supabase dashboard:"
    echo "   - Settings → API for URL and keys"
    echo "   - Settings → Database for connection string"
    echo "3. Generate a secure JWT_SECRET (at least 32 characters)"
    exit 1
fi

# Detect database type
if [[ "$DATABASE_URL" == *"supabase.co"* ]]; then
    echo "🔗 Database: Supabase (recommended)"
    DB_MODE="supabase"
else
    echo "🗄️  Database: Local PostgreSQL"
    DB_MODE="local"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    exit 1
else
    echo "✅ Docker: Available"
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not installed"
    exit 1
else
    echo "✅ Docker Compose: Available"
fi

echo ""
echo "✅ Setup validation passed!"
echo ""
echo "🎯 Ready to start:"
if [ "$DB_MODE" = "supabase" ]; then
    echo "   ./scripts/setup-supabase-db.sh  # Setup database schema"
    echo "   ./scripts/docker-setup.sh       # Start application"
else
    echo "   ./scripts/docker-setup.sh       # Start application with local DB"
fi
echo ""
echo "🧪 Optional tests:"
echo "   node scripts/test-supabase-connection.js  # Test Supabase connection"
echo "   ./scripts/health-check.sh                 # Check running services"