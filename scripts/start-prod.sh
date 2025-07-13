#!/bin/bash

echo "🚀 Starting production environment..."

# Start all services including nginx
podman-compose -f compose.yml --profile production up -d

echo "⏳ Waiting for services to be ready..."
sleep 15

echo "🎉 Production environment started!"
echo ""
echo "Services available:"
echo "🌐 Website: http://localhost (or your domain)"
echo "📡 API: http://localhost/api/v1"
echo "🗃️  Adminer: http://localhost:8080"