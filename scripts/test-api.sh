#!/bin/bash

API_URL="http://localhost:8000"

echo "🧪 Testing API endpoints..."

# Test health endpoint
echo "Testing health endpoint..."
curl -s "$API_URL/health" | jq .

echo ""

# Test search endpoint
echo "Testing search endpoint..."
curl -s "$API_URL/api/v1/search?limit=5" | jq '.listings | length'

echo ""

# Test featured listings (you'll need to replace with actual office key)
echo "Testing featured listings..."
curl -s "$API_URL/api/v1/featured/test-office-key?limit=3" | jq .

echo ""
echo "✅ API testing complete"