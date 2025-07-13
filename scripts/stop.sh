#!/bin/bash

echo "🛑 Stopping all services..."

podman-compose -f compose.yml down

echo "✅ All services stopped"