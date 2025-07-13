#!/bin/bash

set -e

echo "🚀 Starting Development Environment"
echo "=================================="
echo ""
echo "📝 Starting sequence:"
echo "   1. PostgreSQL & Redis (infrastructure)"
echo "   2. Go ingestion service (creates database tables)"
echo "   3. Database indexes (performance optimization)"
echo "   4. FastAPI service (REST API)"
echo "   5. Nginx reverse proxy (load balancing)"
echo "   6. Adminer (database administration)"
echo ""

# Check if .env.development exists
if [ ! -f ".env.development" ]; then
    echo "❌ .env.development not found!"
    echo "Run ./scripts/setup.sh first"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.development | xargs)

# Check for existing containers and stop them properly
echo "🔍 Checking for existing containers..."
if podman ps -a --format "{{.Names}}" | grep -q "listings_.*_dev"; then
    echo "🛑 Stopping and removing existing development containers..."
    
    # Stop all development containers
    CONTAINERS=$(podman ps -a --format "{{.Names}}" | grep "listings_.*_dev" || true)
    if [ ! -z "$CONTAINERS" ]; then
        echo "Stopping containers: $CONTAINERS"
        podman stop $CONTAINERS 2>/dev/null || true
        podman rm $CONTAINERS 2>/dev/null || true
    fi
    
    # Also try compose down to be thorough
    podman-compose -f compose.dev.yml --env-file .env.development down 2>/dev/null || true
    
    echo "✅ Cleanup complete"
fi

# Start all infrastructure services together
echo "🗄️  Starting infrastructure services (postgres, redis)..."
podman-compose -f compose.dev.yml --env-file .env.development up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
timeout=60
counter=0
until podman-compose -f compose.dev.yml --env-file .env.development exec postgres pg_isready -U $POSTGRES_USER > /dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo "❌ Database failed to start within $timeout seconds"
        exit 1
    fi
done

echo "✅ Database is ready"

# Start ingestion service (this creates tables via GORM auto-migration)
echo "📥 Starting data ingestion service to create database tables..."
podman-compose -f compose.dev.yml --env-file .env.development up -d listings-ingestion --no-deps

# Wait a moment for the Go service to create tables
echo "⏳ Waiting for tables to be created..."
sleep 10

# Check if tables exist, if not wait a bit more
echo "🔍 Checking if tables were created..."
for i in {1..6}; do
    if podman-compose -f compose.dev.yml --env-file .env.development exec postgres psql -U $POSTGRES_USER -d $TRREB_DATABASE_NAME -c "\dt" 2>/dev/null | grep -q "residential_properties"; then
        echo "✅ Tables found in database"
        break
    else
        echo "⏳ Tables not ready yet, waiting... (attempt $i/6)"
        sleep 5
    fi
    
    if [ $i -eq 6 ]; then
        echo "⚠️  Tables may not be created yet. Check ingestion service logs: ./scripts/logs.sh listings-ingestion"
        echo "⚠️  You can apply indexes later with: ./scripts/apply-indexes.sh"
        break
    fi
done

# Apply database indexes (only if tables exist)
echo "📊 Applying database indexes..."
podman-compose -f compose.dev.yml --env-file .env.development exec postgres psql -U $POSTGRES_USER -d $TRREB_DATABASE_NAME << 'EOF' || echo "⚠️  Indexes will be applied after tables are created - run ./scripts/apply-indexes.sh later"
-- Core search indexes
CREATE INDEX IF NOT EXISTS idx_residential_search ON residential_properties(standard_status, transaction_type, list_price, bedrooms_total, bathrooms_total_integer);
CREATE INDEX IF NOT EXISTS idx_commercial_search ON commercial_properties(standard_status, transaction_type, list_price);

-- Geographic indexes  
CREATE INDEX IF NOT EXISTS idx_residential_coordinates ON residential_properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_commercial_coordinates ON commercial_properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Location-based searches
CREATE INDEX IF NOT EXISTS idx_residential_location ON residential_properties(city_region, county_or_parish, standard_status);
CREATE INDEX IF NOT EXISTS idx_commercial_location ON commercial_properties(city_region, county_or_parish, standard_status);

-- Property type filtering
CREATE INDEX IF NOT EXISTS idx_residential_type ON residential_properties(property_type, property_sub_type, standard_status);
CREATE INDEX IF NOT EXISTS idx_commercial_type ON commercial_properties(property_type, property_sub_type, standard_status);

-- Office filtering
CREATE INDEX IF NOT EXISTS idx_residential_office ON residential_properties(list_office_key, standard_status);
CREATE INDEX IF NOT EXISTS idx_commercial_office ON commercial_properties(list_office_key, standard_status);

-- Timestamp sorting
CREATE INDEX IF NOT EXISTS idx_residential_timestamps ON residential_properties(modification_timestamp DESC, original_entry_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_commercial_timestamps ON commercial_properties(modification_timestamp DESC, original_entry_timestamp DESC);

-- Media lookup optimization
CREATE INDEX IF NOT EXISTS idx_residential_media_lookup ON residential_media(resource_record_key, image_size_description, "order");
CREATE INDEX IF NOT EXISTS idx_commercial_media_lookup ON commercial_media(resource_record_key, image_size_description, "order");
EOF

echo "✅ Database indexes applied (or will be applied when tables exist)"

# Start remaining services
echo "🐍 Starting FastAPI service..."
podman-compose -f compose.dev.yml --env-file .env.development up -d listings-api

echo "🌐 Starting Nginx reverse proxy..."
podman-compose -f compose.dev.yml --env-file .env.development up -d nginx

echo "🔧 Starting additional services..."
podman-compose -f compose.dev.yml --env-file .env.development up -d adminer

# Note: listings-ingestion already started earlier to create tables

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
timeout=60
counter=0
until curl -s http://localhost:$API_PORT/health > /dev/null; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo "⚠️  API may not be ready yet, but services are running"
        break
    fi
done

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📡 Services available:"
echo "   Direct API:     http://localhost:$API_PORT"
echo "   API via Nginx:  http://localhost/api/v1"
echo "   API Docs:       http://localhost/docs"
echo "   Health Check:   http://localhost/health"
echo "   Adminer:        http://localhost:$ADMINER_PORT"
echo ""
echo "💡 Recommended: Use Nginx URLs (http://localhost/) for realistic testing"
echo "📜 View logs: ./scripts/logs.sh [service-name]"
echo "📊 Apply indexes manually: ./scripts/apply-indexes.sh"
echo "🔄 Force restart (if conflicts): ./scripts/restart.sh"
echo "🛑 Stop all:  ./scripts/stop.sh"
echo ""