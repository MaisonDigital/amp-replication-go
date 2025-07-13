#!/bin/bash

echo "🔧 Starting development environment..."

# Check for existing containers and stop them if running
echo "🧹 Checking for existing containers..."
if podman ps -a --format "{{.Names}}" | grep -q "listings_"; then
    echo "Found existing containers, stopping them..."
    podman stop $(podman ps -a --format "{{.Names}}" | grep "listings_" | tr '\n' ' ') 2>/dev/null || true
    podman rm $(podman ps -a --format "{{.Names}}" | grep "listings_" | tr '\n' ' ') 2>/dev/null || true
fi

# Start core services (postgres, redis)
echo "🚀 Starting core services..."
podman-compose -f compose.yml up -d postgres redis

echo "⏳ Waiting for database to be ready..."
sleep 10

# Apply database indexes
echo "📊 Applying database indexes..."
podman-compose -f compose.yml exec postgres psql -U postgres -d postgres << 'EOF'
-- Core search indexes (composite for common filter combinations)
CREATE INDEX IF NOT EXISTS idx_residential_search ON residential_properties(standard_status, transaction_type, list_price, bedrooms_total, bathrooms_total_integer);
CREATE INDEX IF NOT EXISTS idx_commercial_search ON commercial_properties(standard_status, transaction_type, list_price);

-- Geographic indexes for map functionality
CREATE INDEX IF NOT EXISTS idx_residential_coordinates ON residential_properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_commercial_coordinates ON commercial_properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Location-based searches
CREATE INDEX IF NOT EXISTS idx_residential_location ON residential_properties(city_region, county_or_parish, standard_status);
CREATE INDEX IF NOT EXISTS idx_commercial_location ON commercial_properties(city_region, county_or_parish, standard_status);

-- Property type filtering
CREATE INDEX IF NOT EXISTS idx_residential_type ON residential_properties(property_type, property_sub_type, standard_status);
CREATE INDEX IF NOT EXISTS idx_commercial_type ON commercial_properties(property_type, property_sub_type, standard_status);

-- Broker/office filtering for featured listings
CREATE INDEX IF NOT EXISTS idx_residential_office ON residential_properties(list_office_key, standard_status);
CREATE INDEX IF NOT EXISTS idx_commercial_office ON commercial_properties(list_office_key, standard_status);

-- Timestamp for sorting by newest/updated
CREATE INDEX IF NOT EXISTS idx_residential_timestamps ON residential_properties(modification_timestamp DESC, original_entry_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_commercial_timestamps ON commercial_properties(modification_timestamp DESC, original_entry_timestamp DESC);

-- Media lookup optimization
CREATE INDEX IF NOT EXISTS idx_residential_media_lookup ON residential_media(resource_record_key, image_size_description, "order");
CREATE INDEX IF NOT EXISTS idx_commercial_media_lookup ON commercial_media(resource_record_key, image_size_description, "order");
EOF

echo "✅ Database indexes applied"

# Start the FastAPI service
echo "🚀 Starting FastAPI service..."
podman-compose -f compose.yml up -d listings-api
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

-- Broker/office filtering
CREATE INDEX IF NOT EXISTS idx_residential_office ON residential_properties(list_office_key, standard_status);
CREATE INDEX IF NOT EXISTS idx_commercial_office ON commercial_properties(list_office_key, standard_status);

-- Timestamp sorting
CREATE INDEX IF NOT EXISTS idx_residential_timestamps ON residential_properties(modification_timestamp DESC, original_entry_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_commercial_timestamps ON commercial_properties(modification_timestamp DESC, original_entry_timestamp DESC);

-- Media lookup optimization
CREATE INDEX IF NOT EXISTS idx_residential_media_lookup ON residential_media(resource_record_key, image_size_description, "order");
CREATE INDEX IF NOT EXISTS idx_commercial_media_lookup ON commercial_media(resource_record_key, image_size_description, "order");
EOF

echo "✅ Database indexes applied"

# Start the FastAPI service
echo "🚀 Starting FastAPI service..."
podman-compose up -d listings-api

echo "🎉 Development environment started!"
echo ""
echo "Services available:"
echo "📡 API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "🗃️  Adminer: http://localhost:8080"
echo ""
echo "To view logs: ./scripts/logs.sh"