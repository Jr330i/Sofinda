#!/bin/bash

# Docker Setup Script for Property Management System

set -e

echo "🐳 Setting up Property Management System with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.docker .env
    echo "⚠️  Please edit .env file with your actual Supabase credentials before running the application."
    exit 1
fi

# Source environment variables
source .env

# Check if using Supabase or local database
if [[ "$DATABASE_URL" == *"supabase.co"* ]]; then
    echo "🔗 Detected Supabase configuration - using Supabase database"
    COMPOSE_FILE="docker-compose.supabase.yml"
    DB_TYPE="Supabase"
else
    echo "🗄️  Using local PostgreSQL database"
    COMPOSE_FILE="docker-compose.yml"
    DB_TYPE="Local PostgreSQL"
fi

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose -f $COMPOSE_FILE build

echo "🚀 Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Run database migrations
echo "🗄️  Running database migrations..."
if [[ "$COMPOSE_FILE" == "docker-compose.supabase.yml" ]]; then
    docker-compose -f $COMPOSE_FILE exec backend npx prisma db push
else
    # Wait for local database to be ready
    sleep 5
    docker-compose -f $COMPOSE_FILE exec backend npx prisma db push
fi

echo "✅ Setup complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  Database: $DB_TYPE"
echo ""
echo "To stop the services: docker-compose -f $COMPOSE_FILE down"
echo "To view logs: docker-compose -f $COMPOSE_FILE logs -f"