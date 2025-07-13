#!/bin/bash

echo "🚀 Starting Development Environment"
echo "=================================="

# Check if podman-compose is available
if ! command -v podman-compose &> /dev/null; then
    echo "❌ podman-compose not found! Install with: pip3 install podman-compose"
    exit 1
fi

# Start podman machine on macOS if needed
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! podman machine list 2>/dev/null | grep -q "running"; then
        echo "🚀 Starting podman machine..."
        podman machine start
        sleep 5
    fi
fi

# Clean up any existing containers
echo "🧹 Cleaning up..."
podman-compose down 2>/dev/null || true

# Start development environment
echo "🚀 Starting services..."
podman-compose up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "✅ Development environment started!"
echo ""
echo "🌐 Services:"
echo "   API:      http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Health:   http://localhost:8000/health"
echo "   Database: http://localhost:8080 (user: postgres, password: password)"
echo ""
echo "📜 Useful commands:"
echo "   podman-compose ps                    # Check status"
echo "   podman-compose logs -f listings-api # View API logs"
echo "   podman-compose down                  # Stop everything"
echo ""

# Quick health check
echo "🏥 Quick health check:"
curl -s http://localhost:8000/health 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "API not ready yet - check logs"