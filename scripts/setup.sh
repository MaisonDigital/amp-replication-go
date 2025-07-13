#!/bin/bash

set -e

echo "🚀 Setting up Listings API Development Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.development exists
if [ ! -f ".env.development" ]; then
    echo -e "${YELLOW}⚠️  Creating .env.development from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.development
        echo -e "${GREEN}✅ Created .env.development${NC}"
        echo -e "${YELLOW}📝 Please edit .env.development with your actual credentials${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Please create it first.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env.development already exists${NC}"
fi

# Check for required commands
echo "🔍 Checking required dependencies..."

if ! command -v podman &> /dev/null; then
    echo -e "${RED}❌ Podman is not installed${NC}"
    echo "Please install Podman first:"
    echo "  - macOS: brew install podman"
    echo "  - Ubuntu: sudo apt install podman"
    echo "  - RHEL/CentOS: sudo dnf install podman"
    exit 1
fi

if ! command -v podman-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  podman-compose not found, installing...${NC}"
    pip3 install podman-compose || {
        echo -e "${RED}❌ Failed to install podman-compose${NC}"
        echo "Please install it manually: pip3 install podman-compose"
        exit 1
    }
fi

echo -e "${GREEN}✅ Dependencies check passed${NC}"

# Initialize podman if needed
echo "🔧 Initializing Podman..."
if ! podman system info &> /dev/null; then
    echo "Initializing Podman machine..."
    podman machine init 2>/dev/null || true
    podman machine start 2>/dev/null || true
fi

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
./scripts/clean.sh -y 2>/dev/null || true

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p nginx/ssl
mkdir -p backups
mkdir -p logs

# Set permissions for scripts
echo "🔑 Setting script permissions..."
chmod +x scripts/*.sh

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo -e "${BLUE}1. Edit .env.development with your API credentials${NC}"
echo -e "${BLUE}2. Start development environment: ${YELLOW}./scripts/dev.sh${NC}"
echo -e "${BLUE}3. Access the API at: ${YELLOW}http://localhost:8000${NC}"
echo -e "${BLUE}4. View API docs at: ${YELLOW}http://localhost:8000/docs${NC}"
echo ""