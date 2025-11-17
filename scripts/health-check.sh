#!/bin/bash

# Health Check Script for Docker Services

echo "🏥 Checking service health..."

# Check if services are running
required_services=("property-management-frontend" "property-management-backend")
optional_services=("property-management-db")

echo "🔍 Checking required services..."
for service in "${required_services[@]}"; do
    if docker ps --format "table {{.Names}}" | grep -q "$service"; then
        echo "✅ $service is running"
        
        # Check health status
        health=$(docker inspect --format='{{.State.Health.Status}}' "$service" 2>/dev/null)
        if [ "$health" = "healthy" ]; then
            echo "   💚 Health status: healthy"
        elif [ "$health" = "unhealthy" ]; then
            echo "   ❤️  Health status: unhealthy"
        else
            echo "   💛 Health status: unknown"
        fi
    else
        echo "❌ $service is not running"
    fi
done

echo ""
echo "🔍 Checking optional services..."
for service in "${optional_services[@]}"; do
    if docker ps --format "table {{.Names}}" | grep -q "$service"; then
        echo "✅ $service is running (local database)"
        
        # Check health status
        health=$(docker inspect --format='{{.State.Health.Status}}' "$service" 2>/dev/null)
        if [ "$health" = "healthy" ]; then
            echo "   💚 Health status: healthy"
        elif [ "$health" = "unhealthy" ]; then
            echo "   ❤️  Health status: unhealthy"
        else
            echo "   💛 Health status: unknown"
        fi
    else
        echo "ℹ️  $service not running (likely using Supabase)"
    fi
done

echo ""
echo "🌐 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo "   Backend Health: http://localhost:5000/health"