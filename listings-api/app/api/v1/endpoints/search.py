from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
import json

from app.core.database import get_db, get_redis
from app.core.config import settings
from app.models.schemas import (
    SearchResponse, MapResponse, SearchFilters, 
    PaginationInfo, TransactionType, PropertyType, SortOption
)
from app.services.search import SearchService

router = APIRouter()


@router.get("/", response_model=SearchResponse)
async def search_listings(
    # Filter parameters
    transaction_type: Optional[TransactionType] = Query(None, description="Sale, Lease, or Sub-Lease"),
    property_type: Optional[PropertyType] = Query(None, description="Residential or Commercial"),
    property_sub_type: Optional[str] = Query(None, description="Detached, Condo, etc."),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    bedrooms: Optional[int] = Query(None, ge=0, description="Number of bedrooms"),
    bathrooms: Optional[int] = Query(None, ge=0, description="Number of bathrooms"),
    city_region: Optional[str] = Query(None, description="City or region"),
    county_or_parish: Optional[str] = Query(None, description="County or parish"),
    
    # Pagination
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=settings.PAGE_SIZE_MAX, description="Items per page"),
    
    # Sorting
    sort: SortOption = Query(SortOption.NEWEST, description="Sort option"),
    
    # Dependencies
    db: Session = Depends(get_db),
    redis_client = Depends(get_redis)
):
    """
    Search listings with filters, pagination, and sorting.
    """
    # Create search filters
    filters = SearchFilters(
        transaction_type=transaction_type,
        property_type=property_type,
        property_sub_type=property_sub_type,
        min_price=min_price,
        max_price=max_price,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        city_region=city_region,
        county_or_parish=county_or_parish,
    )
    
    # Generate cache key
    cache_key = f"search:{hash(str(filters.model_dump()))}:{page}:{limit}:{sort}"
    
    # Try to get from cache first
    if redis_client:
        try:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return SearchResponse.model_validate(json.loads(cached_result))
        except Exception:
            pass  # Cache miss or error, continue to database
    
    # Get search service
    search_service = SearchService(db)
    
    # Perform search
    listings, total_count = search_service.search_listings(
        filters=filters,
        page=page,
        limit=limit,
        sort=sort
    )
    
    # Calculate pagination info
    total_pages = (total_count + limit - 1) // limit
    pagination = PaginationInfo(
        page=page,
        limit=limit,
        total=total_count,
        pages=total_pages
    )
    
    # Create response
    response = SearchResponse(
        listings=listings,
        pagination=pagination,
        filters_applied=filters
    )
    
    # Cache the result
    if redis_client:
        try:
            redis_client.setex(
                cache_key, 
                settings.SEARCH_CACHE_TTL, 
                response.model_dump_json()
            )
        except Exception:
            pass  # Cache write error, continue
    
    return response


@router.get("/map", response_model=MapResponse)
async def search_listings_for_map(
    # Geographic bounds (required for map)
    ne_lat: float = Query(..., description="Northeast latitude"),
    ne_lng: float = Query(..., description="Northeast longitude"),
    sw_lat: float = Query(..., description="Southwest latitude"),
    sw_lng: float = Query(..., description="Southwest longitude"),
    
    # Filter parameters (optional for map)
    transaction_type: Optional[TransactionType] = Query(None),
    property_type: Optional[PropertyType] = Query(None),
    property_sub_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    bedrooms: Optional[int] = Query(None, ge=0),
    bathrooms: Optional[int] = Query(None, ge=0),
    
    # Limit for map display (prevent too many markers)
    limit: int = Query(500, ge=1, le=1000, description="Max listings for map"),
    
    # Dependencies
    db: Session = Depends(get_db),
    redis_client = Depends(get_redis)
):
    """
    Get listings within map bounds for display on a map.
    Returns minimal data optimized for map markers.
    """
    # Validate bounds
    if ne_lat <= sw_lat or ne_lng <= sw_lng:
        raise HTTPException(
            status_code=400,
            detail="Invalid geographic bounds: northeast must be greater than southwest"
        )
    
    # Create search filters with bounds
    filters = SearchFilters(
        transaction_type=transaction_type,
        property_type=property_type,
        property_sub_type=property_sub_type,
        min_price=min_price,
        max_price=max_price,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        ne_lat=ne_lat,
        ne_lng=ne_lng,
        sw_lat=sw_lat,
        sw_lng=sw_lng,
    )
    
    # Generate cache key for map search
    cache_key = f"map:{hash(str(filters.model_dump()))}:{limit}"
    
    # Try cache first
    if redis_client:
        try:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return MapResponse.model_validate(json.loads(cached_result))
        except Exception:
            pass
    
    # Get search service
    search_service = SearchService(db)
    
    # Perform map search
    listings = search_service.search_listings_for_map(
        filters=filters,
        limit=limit
    )
    
    # Create response
    response = MapResponse(
        listings=listings,
        count=len(listings)
    )
    
    # Cache result (shorter TTL for map data)
    if redis_client:
        try:
            redis_client.setex(
                cache_key,
                60,  # 1 minute cache for map data
                response.model_dump_json()
            )
        except Exception:
            pass
    
    return response


@router.get("/suggestions/cities")
async def get_city_suggestions(
    q: str = Query(..., min_length=2, description="City search query"),
    property_type: Optional[PropertyType] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get city suggestions for autocomplete.
    """
    search_service = SearchService(db)
    suggestions = search_service.get_city_suggestions(q, property_type, limit)
    
    return {"suggestions": suggestions}


@router.get("/suggestions/property-types")
async def get_property_type_suggestions(
    property_type: Optional[PropertyType] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get available property sub-types for a given property type.
    """
    search_service = SearchService(db)
    subtypes = search_service.get_property_subtypes(property_type)
    
    return {"property_subtypes": subtypes}