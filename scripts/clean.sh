#!/bin/bash

echo "🧹 Cleaning up containers and volumes..."

read -p "This will remove all data. Are you sure? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    podman-compose -f compose.yml down -v --remove-orphans
    podman system prune -f
    echo "✅ Cleanup complete"
else
    echo "❌ Cleanup cancelled"
fi