#!/bin/bash

set -e

echo "📊 Applying Database Indexes"
echo "============================"

# Check if .env.development exists
if [ ! -f ".env.development" ]; then
    echo "❌ .env.development not found!"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.development | xargs)

# Check if database container is running
if ! podman ps --format "{{.Names}}" | grep -q "listings_postgres_dev"; then
    echo "❌ PostgreSQL container not running"
    echo "Start the development environment first: ./scripts/dev.sh"
    exit 1
fi

# Check if tables exist
echo "🔍 Checking if tables exist..."
if ! podman-compose -f compose.dev.yml --env-file .env.development exec postgres psql -U $POSTGRES_USER -d $TRREB_DATABASE_NAME -c "\dt" 2>/dev/null | grep -q "residential_properties"; then
    echo "❌ Tables not found in database '$TRREB_DATABASE_NAME'"
    echo "Make sure the Go ingestion service has run at least once to create tables"
    echo "Check logs: ./scripts/logs.sh listings-ingestion"
    exit 1
fi

echo "✅ Tables found, applying indexes..."

# Apply indexes
podman-compose -f compose.dev.yml --env-file .env.development exec postgres psql -U $POSTGRES_USER -d $TRREB_DATABASE_NAME << 'EOF'
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

-- Show created indexes
\di
EOF

echo "✅ Database indexes applied successfully!"