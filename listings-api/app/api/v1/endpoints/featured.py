from fastapi import APIRouter, Depends, Query, HTTPException, Path
from sqlalchemy.orm import Session
from typing import Optional
import json

from app.core.database import get_db, get_redis
from app.core.config import settings
from app.models.schemas import FeaturedListingsResponse, PropertyType
from app.services.featured import FeaturedService

router = APIRouter()


@router.get("/{office_key}", response_model=FeaturedListingsResponse)
async def get_featured_listings_by_office(
    office_key: str = Path(..., description="Broker office key"),
    property_type: Optional[PropertyType] = Query(None, description="Filter by property type"),
    limit: int = Query(12, ge=1, le=50, description="Number of featured listings to return"),
    transaction_type: Optional[str] = Query(None, description="Filter by transaction type"),
    db: Session = Depends(get_db),
    redis_client = Depends(get_redis)
):
    """
    Get featured listings for a specific broker office.
    Returns the most recent active listings from that office.
    """
    # Generate cache key
    cache_key = f"featured:{office_key}:{property_type}:{limit}:{transaction_type}"
    
    # Try cache first
    if redis_client:
        try:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return FeaturedListingsResponse.model_validate(json.loads(cached_result))
        except Exception:
            pass
    
    # Get from database
    featured_service = FeaturedService(db)
    featured_response = featured_service.get_featured_listings(
        office_key=office_key,
        property_type=property_type,
        limit=limit,
        transaction_type=transaction_type
    )
    
    if not featured_response:
        raise HTTPException(
            status_code=404,
            detail=f"No listings found for office key '{office_key}'"
        )
    
    # Cache the result
    if redis_client:
        try:
            redis_client.setex(
                cache_key,
                settings.CACHE_TTL_SECONDS,
                featured_response.model_dump_json()
            )
        except Exception:
            pass
    
    return featured_response


@router.get("/office/{office_key}/info")
async def get_office_info(
    office_key: str = Path(..., description="Broker office key"),
    db: Session = Depends(get_db)
):
    """
    Get basic information about a broker office.
    """
    featured_service = FeaturedService(db)
    office_info = featured_service.get_office_info(office_key)
    
    if not office_info:
        raise HTTPException(
            status_code=404,
            detail=f"Office with key '{office_key}' not found"
        )
    
    return office_info


@router.get("/offices")
async def get_active_offices(
    property_type: Optional[PropertyType] = Query(None, description="Filter by property type"),
    limit: int = Query(50, ge=1, le=100, description="Number of offices to return"),
    db: Session = Depends(get_db)
):
    """
    Get list of active broker offices that have listings.
    """
    featured_service = FeaturedService(db)
    offices = featured_service.get_active_offices(property_type, limit)
    
    return {
        "offices": offices,
        "count": len(offices)
    }