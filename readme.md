# Listings API

Real estate MLS data API with Go ingestion service and FastAPI REST endpoints.

## Quick Start

### Development

```bash
# Start everything
./start-dev.sh

# Check it's working
curl http://localhost:8000/health
```

**Available Services:**
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs  
- Database Admin: http://localhost:8080 (postgres/password)

### Production

```bash
# Create production environment file
cp .env.prod.example .env.prod
# Edit .env.prod with your production credentials

# Start production
./start-prod.sh
```

## Architecture

- **PostgreSQL**: Database for listings data
- **Redis**: API response caching  
- **Go Service**: Data ingestion from TRREB/DDF APIs
- **FastAPI**: REST API for property search

## Configuration

- **Development**: Hardcoded in `docker-compose.yml`
- **Production**: Environment variables in `.env.prod`
- **API Credentials**: Set in `config.yml`

## API Endpoints

- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `GET /api/v1/search` - Search listings
- `GET /api/v1/listings/{id}` - Get listing details
- `GET /api/v1/featured/{office_key}` - Featured listings

## Management

```bash
# View logs
podman-compose logs -f listings-api
podman-compose logs -f listings-ingestion

# Stop everything  
podman-compose down

# Rebuild after changes
podman-compose build && podman-compose up -d
```

## Requirements

- Podman + podman-compose
- Python 3.11+ (for FastAPI service)
- Go 1.24+ (for ingestion service)

That's it! Simple and clean.