#!/bin/bash

echo "🔨 Force rebuilding API container (no cache)..."

# Stop all services
echo "🛑 Stopping all services..."
podman-compose down

# Remove the API container manually
echo "🗑️  Removing API container manually..."
podman rm -f listings_api_dev 2>/dev/null || true

# Remove the API image to force complete rebuild
echo "🗑️  Removing API image..."
podman rmi maisondigitalampreplicationgo_listings-api:latest 2>/dev/null || true

# Build API with no cache (this will pick up code changes)
echo "🏗️  Building API with no cache..."
podman-compose build --no-cache listings-api

# Start everything back up
echo "🚀 Starting all services..."
podman-compose up -d

echo "⏳ Waiting for API to start..."
sleep 15

echo "🏥 Testing health check (should now use new code)..."
curl -s http://localhost:8000/health | python3 -m json.tool

echo ""
echo "📜 Recent logs:"
podman-compose logs --tail=5 listings-api