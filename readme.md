# Real Estate Listings API

A high-performance FastAPI-based REST API for real estate MLS data, built to serve property listings with advanced search, filtering, and map integration capabilities.

## 🏗️ Architecture

The project consists of two main services:

1. **Go Ingestion Service** (`listings-service/`) - Handles data replication from TRREB and DDF APIs
2. **FastAPI Service** (`listings-api/`) - Provides REST API for property search and retrieval

## 🚀 Quick Start

### Prerequisites

- Podman and podman-compose
- Git

### 1. Clone and Setup

```bash
git clone <your-repo>
cd <project-directory>

# Install podman-compose if needed
chmod +x scripts/podman-install.sh
./scripts/podman-install.sh

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure Environment

Edit `listings-api/.env` with your configuration:

```bash
# Database settings (should match your Go service)
DATABASE_HOST=postgres
DATABASE_PASSWORD=your_password

# Redis settings
REDIS_HOST=redis

# CORS settings for your frontend domains
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 3. Start Development Environment

```bash
# Start all services
./scripts/start-dev.sh

# View logs
./scripts/logs.sh listings-api
```

### 4. Access the API

- **API Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Database Admin**: http://localhost:8080

## 🐳 Podman Setup

This project uses **Podman** instead of Docker for containerization. Podman is a daemonless, rootless container engine that's compatible with Docker commands.

### Installing Podman

**RHEL/CentOS/Fedora:**
```bash
sudo dnf install podman podman-compose
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install podman podman-compose
```

**macOS:**
```bash
brew install podman podman-compose
```

### Podman Configuration

```bash
# Enable podman socket for compose compatibility
systemctl --user enable --now podman.socket

# Set up podman machine (macOS/Windows)
podman machine init
podman machine start
```

## 📚 API Endpoints

### Search & Discovery

#### `GET /api/v1/search`
Search listings with comprehensive filtering options.

**Query Parameters:**
- `transaction_type`: "For Sale" | "For Lease" | "For Sub-Lease"
- `property_type`: "Residential" | "Commercial"  
- `property_sub_type`: "Detached", "Condo", etc.
- `min_price`, `max_price`: Price range filters
- `bedrooms`: Minimum number of bedrooms
- `bathrooms`: Minimum number of bathrooms
- `city_region`: City or region name
- `county_or_parish`: County filter
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)
- `sort`: "price_asc" | "price_desc" | "newest" | "updated"

**Example:**
```bash
curl "http://localhost:8000/api/v1/search?transaction_type=For Sale&property_type=Residential&min_price=500000&max_price=1000000&bedrooms=3&city_region=Ottawa&limit=10"
```

**Response:**
```json
{
  "listings": [
    {
      "listing_key": "12345",
      "list_price": 750000,
      "address": {
        "street_number": "123",
        "street_name": "Main St", 
        "city_region": "Ottawa",
        "postal_code": "K1A 0A6",
        "full_address": "123 Main St, Ottawa, K1A 0A6"
      },
      "coordinates": {
        "latitude": 45.4215,
        "longitude": -75.6972
      },
      "bedrooms_total": 3,
      "bathrooms_total_integer": 2,
      "property_type": "Residential",
      "property_sub_type": "Detached",
      "transaction_type": "For Sale",
      "thumbnail_url": "https://...",
      "modification_timestamp": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16
  },
  "filters_applied": {
    "transaction_type": "For Sale",
    "property_type": "Residential",
    "min_price": 500000,
    "max_price": 1000000,
    "bedrooms": 3,
    "city_region": "Ottawa"
  }
}
```

#### `GET /api/v1/search/map`
Get listings for map display with geographic bounds.

**Required Parameters:**
- `ne_lat`, `ne_lng`: Northeast corner coordinates
- `sw_lat`, `sw_lng`: Southwest corner coordinates

**Optional Parameters:**
- Same filters as regular search
- `limit`: Max markers (default: 500, max: 1000)

**Example:**
```bash
curl "http://localhost:8000/api/v1/search/map?ne_lat=45.5&ne_lng=-75.5&sw_lat=45.3&sw_lng=-75.8&transaction_type=For Sale"
```

### Individual Listings

#### `GET /api/v1/listings/{listing_key}`
Get detailed information for a specific listing.

**Example:**
```bash
curl "http://localhost:8000/api/v1/listings/ABC123"
```

**Response includes:**
- Complete property details
- All property features and amenities
- Virtual tour URLs
- Associated media

#### `GET /api/v1/listings/{listing_key}/media`
Get all media for a specific listing.

**Query Parameters:**
- `size`: Filter by image size ("Thumbnail", "Medium", "Large")

#### `GET /api/v1/listings/{listing_key}/similar`
Get similar listings based on property characteristics.

**Query Parameters:**
- `limit`: Number of similar listings (default: 5)

### Featured Listings

#### `GET /api/v1/featured/{office_key}`
Get featured listings for a specific broker office.

**Query Parameters:**
- `property_type`: Filter by property type
- `limit`: Number of listings (default: 12, max: 50)
- `transaction_type`: Filter by transaction type

**Example:**
```bash
curl "http://localhost:8000/api/v1/featured/OFFICE123?limit=6&property_type=Residential"
```

#### `GET /api/v1/featured/offices`
Get list of active broker offices.

### Suggestions & Autocomplete

#### `GET /api/v1/search/suggestions/cities`
Get city suggestions for autocomplete.

**Parameters:**
- `q`: Search query (minimum 2 characters)
- `property_type`: Filter by property type
- `limit`: Max suggestions (default: 10)

#### `GET /api/v1/search/suggestions/property-types`
Get available property sub-types.

## 🗺️ Map Integration

The API is optimized for map-based property browsing:

1. **Bounding Box Search**: Use `/search/map` with geographic bounds
2. **Coordinate Data**: All listings include lat/lng when available
3. **Optimized Responses**: Map endpoints return minimal data for performance
4. **Clustering Support**: Limit parameter prevents too many markers

### Example Map Integration

```javascript
// Get listings in current map bounds
const bounds = map.getBounds();
const response = await fetch(`/api/v1/search/map?` + new URLSearchParams({
  ne_lat: bounds.getNorthEast().lat(),
  ne_lng: bounds.getNorthEast().lng(),
  sw_lat: bounds.getSouthWest().lat(),
  sw_lng: bounds.getSouthWest().lng(),
  limit: 500
}));

const data = await response.json();
// Add markers to map
data.listings.forEach(listing => {
  if (listing.coordinates.latitude && listing.coordinates.longitude) {
    addMarkerToMap(listing);
  }
});
```

## 🔧 Performance Features

### Caching
- Redis-based caching for search results and listings
- Configurable TTL (default: 5 minutes for search, 5 minutes for listings)
- Cache keys include filter parameters for accuracy

### Database Optimization
- Comprehensive indexes for common search patterns
- Composite indexes for multi-field queries
- Geographic indexes for map-based searches

### Rate Limiting
- Configurable via Nginx
- Different limits for search vs. general API endpoints
- Burst handling for legitimate traffic spikes

## 🔒 Security & CORS

### CORS Configuration
Configure allowed origins in `.env`:
```bash
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com,https://www.yourdomain.com
```

### Production Security
- HTTPS enforced via Nginx
- Security headers (XSS protection, content type sniffing prevention)
- Rate limiting
- Input validation and sanitization

## 📊 Monitoring & Logging

### Health Checks
- `GET /health`: Basic health check
- `GET /api/v1/status`: API status with version

### Logging
```bash
# View API logs
./scripts/logs.sh listings-api

# View ingestion service logs  
./scripts/logs.sh listings-ingestion

# View all service logs
podman-compose -f compose.yml logs -f
```

### Podman vs Docker Commands

If you're familiar with Docker, here are the equivalent Podman commands:

| Docker | Podman |
|--------|--------|
| `docker-compose up` | `podman-compose up` |
| `docker-compose down` | `podman-compose down` |
| `docker ps` | `podman ps` |
| `docker images` | `podman images` |
| `docker exec -it container bash` | `podman exec -it container bash` |
| `docker system prune` | `podman system prune` |

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Copy and configure production environment
cp listings-api/.env.example listings-api/.env.prod

# Update with production values
ENVIRONMENT=production
DEBUG=false
DATABASE_HOST=your-db-host
REDIS_HOST=your-redis-host
ALLOWED_ORIGINS=https://yourdomain.com
```

### 2. SSL Configuration
Configure SSL certificates in `nginx/nginx.conf` and place certificates in `nginx/ssl/`.

### 3. Start Production
```bash
./scripts/start-prod.sh
```

## 🔧 Management Scripts

```bash
# Setup and Installation
./scripts/podman-install.sh   # Install podman-compose if needed
./scripts/setup.sh            # Initial project setup
./scripts/fix-containers.sh   # Fix container name conflicts

# Development
./scripts/start-dev.sh        # Start development environment
./scripts/logs.sh             # View logs
./scripts/stop.sh             # Stop all services

# Production  
./scripts/start-prod.sh       # Start with Nginx reverse proxy

# Maintenance
./scripts/backup-db.sh        # Create database backup
./scripts/clean.sh            # Clean up containers and volumes
./scripts/test-api.sh         # Basic API testing
```

## 📈 Performance Tuning

### Database Indexes
The setup script automatically applies optimized indexes for:
- Multi-field searches (status + type + price + bedrooms)
- Geographic queries (lat/lng with bounds)
- Office-based filtering
- Timestamp sorting

### Redis Caching
Tune cache TTL values in `.env`:
```bash
CACHE_TTL_SECONDS=300      # General cache (5 minutes)
SEARCH_CACHE_TTL=180       # Search results (3 minutes)
```

### Connection Pooling
PostgreSQL connection pool settings in `app/core/database.py`:
- `pool_size=10`: Connections per process
- `max_overflow=20`: Additional connections allowed
- `pool_recycle=300`: Connection lifetime (5 minutes)

## 🐛 Troubleshooting

### Common Issues

**Container Name Conflicts (most common)**
```bash
# If you get "container name already in use" errors:
chmod +x scripts/fix-containers.sh
./scripts/fix-containers.sh

# Then try starting again:
./scripts/start-dev.sh
```

**Podman Permission Errors**
```bash
# If you get permission errors, try:
sudo systemctl enable --now podman.socket
systemctl --user enable --now podman.socket

# For rootless podman (recommended):
podman system migrate
```

**Podman Compose Not Found**
```bash
# Install podman-compose
./scripts/podman-install.sh

# Verify installation
podman-compose --version
```

**Container Build Failures**
```bash
# Clear podman cache and rebuild
podman system prune -a
podman-compose -f compose.yml build --no-cache
```

**Database Connection Error**
```bash
# Check if PostgreSQL is running
podman-compose -f compose.yml ps postgres

# View database logs
podman-compose -f compose.yml logs postgres
```

**Redis Connection Error**
```bash
# Check Redis status
podman-compose -f compose.yml ps redis

# Test Redis connectivity
podman-compose -f compose.yml exec redis redis-cli ping
```

**API Not Responding**
```bash
# Check API service status
podman-compose -f compose.yml ps listings-api

# View API logs
./scripts/logs.sh listings-api

# Test health endpoint
curl http://localhost:8000/health
```

### Performance Issues

**Slow Search Queries**
1. Check if database indexes are applied: `./scripts/start-dev.sh`
2. Monitor query performance in PostgreSQL logs
3. Consider adjusting `limit` parameters for large result sets

**High Memory Usage**
1. Adjust Redis memory limits in compose.yml
2. Tune PostgreSQL `shared_buffers` and `work_mem`
3. Monitor connection pool usage

## 📄 License

[Your license here]

## 🤝 Contributing

[Contributing guidelines here]