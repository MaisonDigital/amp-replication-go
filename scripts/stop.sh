#!/bin/bash

echo "🛑 Stopping all services..."

# Stop development environment
if [ -f ".env.development" ]; then
    echo "Stopping development environment..."
    podman-compose -f compose.dev.yml --env-file .env.development down 2>/dev/null || true
fi

# Stop production environment
if [ -f ".env.production" ]; then
    echo "Stopping production environment..."
    podman-compose -f compose.prod.yml --env-file .env.production down 2>/dev/null || true
fi

# Fallback: stop any containers with listings_ prefix
echo "Cleaning up any remaining containers..."
CONTAINERS=$(podman ps -a --format "{{.Names}}" | grep "listings_" || true)
if [ ! -z "$CONTAINERS" ]; then
    podman stop $CONTAINERS 2>/dev/null || true
    podman rm $CONTAINERS 2>/dev/null || true
fi

echo "✅ All services stopped"