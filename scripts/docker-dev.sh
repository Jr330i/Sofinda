#!/bin/bash

# Docker Development Setup Script

set -e

echo "🐳 Setting up Development Environment with Docker..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.docker .env
    echo "⚠️  Please edit .env file with your actual Supabase credentials before running the application."
fi

# Build and start development services
echo "🏗️  Building development Docker images..."
docker-compose -f docker-compose.dev.yml build

echo "🚀 Starting development services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.dev.yml exec backend-dev npx prisma db push

echo "✅ Development environment ready!"
echo ""
echo "🌐 Frontend (Dev): http://localhost:3000"
echo "🔧 Backend API (Dev): http://localhost:5000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "To stop: docker-compose -f docker-compose.dev.yml down"
echo "To view logs: docker-compose -f docker-compose.dev.yml logs -f"