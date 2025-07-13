#!/bin/bash

FORCE=${1:-""}

if [ "$FORCE" != "-y" ]; then
    echo "🧹 This will remove all containers, volumes, and data"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cleanup cancelled"
        exit 1
    fi
fi

echo "🧹 Cleaning up all resources..."

# Stop and remove all compose services
for env in development production; do
    if [ -f ".env.$env" ]; then
        compose_file="compose.dev.yml"
        if [ "$env" = "production" ]; then
            compose_file="compose.prod.yml"
        fi
        
        echo "Cleaning $env environment..."
        podman-compose -f $compose_file --env-file .env.$env down -v --remove-orphans 2>/dev/null || true
    fi
done

# Remove any remaining listings containers
CONTAINERS=$(podman ps -a --format "{{.Names}}" | grep "listings_" || true)
if [ ! -z "$CONTAINERS" ]; then
    echo "Removing remaining containers..."
    podman stop $CONTAINERS 2>/dev/null || true
    podman rm $CONTAINERS 2>/dev/null || true
fi

# Clean up volumes
echo "Removing volumes..."
podman volume ls -q | grep listings | xargs -r podman volume rm 2>/dev/null || true

# Clean up system
echo "Cleaning up system..."
podman system prune -f

echo "✅ Cleanup complete"