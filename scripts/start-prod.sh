#!/bin/bash

echo "🚀 Starting Production Environment"
echo "================================="

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "❌ .env.prod not found!"
    echo "Create it with your production settings"
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
podman-compose -f docker-compose.prod.yml --env-file .env.prod down 2>/dev/null || true

# Start production environment
echo "🚀 Starting production services..."
podman-compose -f docker-compose.prod.yml --env-file .env.prod up -d

echo "⏳ Waiting for services to start..."
sleep 20

echo ""
echo "✅ Production environment started!"
echo ""
echo "🌐 Services running on:"
echo "   API: http://localhost:8000"
echo ""
echo "📜 Management commands:"
echo "   podman-compose -f docker-compose.prod.yml --env-file .env.prod ps"
echo "   podman-compose -f docker-compose.prod.yml --env-file .env.prod logs -f"
echo "   podman-compose -f docker-compose.prod.yml --env-file .env.prod down"