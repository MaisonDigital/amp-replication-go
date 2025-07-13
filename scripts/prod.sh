#!/bin/bash

set -e

echo "🚀 Starting Production Environment"
echo "================================="

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production not found!"
    echo "Create it from .env.example and configure with production values"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.production | xargs)

# Stop any existing containers
echo "🛑 Stopping existing containers..."
podman-compose -f compose.prod.yml --env-file .env.production down 2>/dev/null || true

# Start production services
echo "🚀 Starting production services..."
podman-compose -f compose.prod.yml --env-file .env.production up -d

echo "⏳ Waiting for services to be ready..."
sleep 15

echo ""
echo "🎉 Production environment started!"
echo ""
echo "🌐 Services:"
echo "   Website: https://yourdomain.com"
echo "   API:     https://yourdomain.com/api/v1"
echo "   Health:  https://yourdomain.com/health"
echo ""