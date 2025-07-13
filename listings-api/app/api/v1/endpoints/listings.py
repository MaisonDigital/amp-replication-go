from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import Optional
import json

from app.core.database import get_db, get_redis
from app.core.config import settings
from app.models.schemas import ListingDetail, MediaItem
from app.services.listings import ListingsService

router = APIRouter()


@router.get("/{listing_key}", response_model=ListingDetail)
async def get_listing_detail(
    listing_key: str = Path(..., description="Unique listing identifier"),
    db: Session = Depends(get_db),
    redis_client = Depends(get_redis)
):
    """
    Get detailed information for a specific listing by its listing key.
    """
    # Try cache first
    cache_key = f"listing_detail:{listing_key}"
    if redis_client:
        try:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return ListingDetail.model_validate(json.loads(cached_result))
        except Exception:
            pass
    
    # Get from database
    listings_service = ListingsService(db)
    listing = listings_service.get_listing_by_key(listing_key)
    
    if not listing:
        raise HTTPException(
            status_code=404,
            detail=f"Listing with key '{listing_key}' not found"
        )
    
    # Cache the result
    if redis_client:
        try:
            redis_client.setex(
                cache_key,
                settings.CACHE_TTL_SECONDS,
                listing.model_dump_json()
            )
        except Exception:
            pass
    
    return listing


@router.get("/{listing_key}/media")
async def get_listing_media(
    listing_key: str = Path(..., description="Unique listing identifier"),
    size: Optional[str] = None,
    db: Session = Depends(get_db),
    redis_client = Depends(get_redis)
):
    """
    Get all media for a specific listing.
    Optional size parameter to filter by image size (Thumbnail, Medium, Large).
    """
    cache_key = f"listing_media:{listing_key}:{size or 'all'}"
    
    # Try cache first
    if redis_client:
        try:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
        except Exception:
            pass
    
    # Get from database
    listings_service = ListingsService(db)
    media = listings_service.get_listing_media(listing_key, size)
    
    if media is None:
        raise HTTPException(
            status_code=404,
            detail=f"Listing with key '{listing_key}' not found"
        )
    
    response = {"listing_key": listing_key, "media": media}
    
    # Cache the result
    if redis_client:
        try:
            redis_client.setex(
                cache_key,
                settings.CACHE_TTL_SECONDS,
                json.dumps(response, default=str)
            )
        except Exception:
            pass
    
    return response


@router.get("/{listing_key}/similar")
async def get_similar_listings(
    listing_key: str = Path(..., description="Unique listing identifier"),
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    Get similar listings based on the provided listing's characteristics.
    """
    listings_service = ListingsService(db)
    similar_listings = listings_service.get_similar_listings(listing_key, limit)
    
    if similar_listings is None:
        raise HTTPException(
            status_code=404,
            detail=f"Listing with key '{listing_key}' not found"
        )
    
    return {
        "listing_key": listing_key,
        "similar_listings": similar_listings,
        "count": len(similar_listings)
    }


@router.get("/{listing_key}/exists")
async def check_listing_exists(
    listing_key: str = Path(..., description="Unique listing identifier"),
    db: Session = Depends(get_db)
):
    """
    Check if a listing exists and return basic status information.
    """
    listings_service = ListingsService(db)
    exists, property_type = listings_service.check_listing_exists(listing_key)
    
    return {
        "listing_key": listing_key,
        "exists": exists,
        "property_type": property_type
    }