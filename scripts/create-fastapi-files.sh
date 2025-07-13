#!/bin/bash

echo "🚀 Creating FastAPI directory structure and files..."

# Create directory structure
mkdir -p listings-api/app/{core,models,api/v1/endpoints,services,utils}
mkdir -p nginx/ssl
mkdir -p scripts

# Create __init__.py files
cat > listings-api/app/__init__.py << 'EOF'
"""Listings API - Real Estate MLS Data API"""
EOF

cat > listings-api/app/core/__init__.py << 'EOF'
"""Core application components"""
EOF

cat > listings-api/app/models/__init__.py << 'EOF'
"""Data models and schemas"""
EOF

cat > listings-api/app/api/__init__.py << 'EOF'
"""API routes and endpoints"""
EOF

cat > listings-api/app/api/v1/__init__.py << 'EOF'
"""API version 1 endpoints"""
EOF

cat > listings-api/app/api/v1/endpoints/__init__.py << 'EOF'
"""API v1 endpoint modules"""
EOF

cat > listings-api/app/services/__init__.py << 'EOF'
"""Business logic services"""
EOF

cat > listings-api/app/utils/__init__.py << 'EOF'
"""Utility functions and helpers"""
EOF

# Create requirements.txt
cat > listings-api/requirements.txt << 'EOF'
fastapi==0.115.6
uvicorn[standard]==0.33.0
sqlalchemy==2.0.36
psycopg2-binary==2.9.10
pydantic==2.10.4
pydantic-settings==2.7.0
redis==5.2.1
python-multipart==0.0.17
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dateutil==2.9.0
EOF

# Create .env.example
cat > listings-api/.env.example << 'EOF'
# FastAPI Application Settings
APP_NAME=Listings API
ENVIRONMENT=development
DEBUG=true

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=cmcs03w7c000007jl2v8jevqq
DATABASE_NAME=postgres

# Redis Configuration (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# CORS Settings (comma-separated list)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8080,https://yourdomain.com

# API Settings
API_V1_STR=/api/v1
PAGE_SIZE_DEFAULT=20
PAGE_SIZE_MAX=100

# Cache Settings (in seconds)
CACHE_TTL_SECONDS=300
SEARCH_CACHE_TTL=180
EOF

# Create Dockerfile
cat > listings-api/Dockerfile << 'EOF'
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check (compatible with podman)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

echo "✅ FastAPI structure created!"
echo ""
echo "⚠️  You still need to create the Python source files:"
echo "   - app/main.py"
echo "   - app/core/config.py"
echo "   - app/core/database.py"
echo "   - app/models/database.py"
echo "   - app/models/schemas.py"
echo "   - And all the endpoint/service files..."
echo ""
echo "💡 You can copy these from the artifacts I provided earlier."
echo "   For now, let's create a minimal main.py to test the build:"

# Create minimal main.py for testing
cat > listings-api/app/main.py << 'EOF'
from fastapi import FastAPI

app = FastAPI(title="Listings API", version="1.0.0")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/")
async def root():
    return {"message": "Listings API", "version": "1.0.0"}
EOF

echo "✅ Created minimal main.py for testing"
echo "🎉 Setup complete! You can now run ./scripts/start-dev.sh"