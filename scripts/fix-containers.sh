#!/bin/bash

echo "🔧 Fixing existing container conflicts..."

# Stop all containers with "listings_" in the name
echo "Stopping existing listings containers..."
if podman ps -a --format "{{.Names}}" | grep -q "listings_"; then
    CONTAINERS=$(podman ps -a --format "{{.Names}}" | grep "listings_")
    echo "Found containers: $CONTAINERS"
    
    # Stop running containers
    podman stop $CONTAINERS 2>/dev/null || true
    
    # Remove containers
    podman rm $CONTAINERS 2>/dev/null || true
    
    echo "✅ Existing containers cleaned up"
else
    echo "No existing listings containers found"
fi

# Also try to stop compose services
echo "Stopping any compose services..."
podman-compose -f compose.yml down 2>/dev/null || true

echo "🎉 Container conflicts resolved!"
echo "You can now run: ./scripts/start-dev.sh"