#!/bin/bash

# Supabase Database Setup Script

set -e

echo "🗄️  Setting up Supabase database schema..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it first with your Supabase credentials."
    echo "   Run: cp .env.docker .env"
    echo "   Then edit .env with your actual Supabase values."
    exit 1
fi

# Source environment variables
source .env

# Check if required variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env file"
    exit 1
fi

echo "📋 Generating Prisma client..."
cd backend
npm install
npx prisma generate

echo "🚀 Pushing database schema to Supabase..."
npx prisma db push

echo "✅ Database schema setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Check your Supabase dashboard to verify tables were created"
echo "2. Set up Row Level Security policies if needed"
echo "3. Create a storage bucket for file uploads"
echo "4. Start your application with: ./scripts/docker-setup.sh"