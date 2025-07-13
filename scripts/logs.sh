#!/bin/bash

SERVICE=${1:-listings-api}

echo "📜 Viewing logs for $SERVICE..."
echo "Press Ctrl+C to exit"
echo ""

podman-compose -f compose.yml logs -f $SERVICE