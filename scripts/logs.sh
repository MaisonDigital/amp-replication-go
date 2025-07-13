#!/bin/bash

SERVICE=${1:-listings-api}
ENV=${2:-development}

if [ ! -f ".env.$ENV" ]; then
    echo "❌ Environment file .env.$ENV not found"
    echo "Available environments: development, production"
    exit 1
fi

COMPOSE_FILE="compose.$ENV.yml"
if [ "$ENV" = "development" ]; then
    COMPOSE_FILE="compose.dev.yml"
elif [ "$ENV" = "production" ]; then
    COMPOSE_FILE="compose.prod.yml"
fi

echo "📜 Viewing logs for $SERVICE in $ENV environment..."
echo "Press Ctrl+C to exit"
echo ""

# Add environment suffix to service name for container lookup
if [[ "$SERVICE" == "postgres" || "$SERVICE" == "redis" || "$SERVICE" == "adminer" ]]; then
    CONTAINER_NAME="${SERVICE}_${ENV}"
else
    CONTAINER_NAME="${SERVICE}_${ENV}"
fi

podman-compose -f $COMPOSE_FILE --env-file .env.$ENV logs -f $SERVICE