from fastapi import APIRouter, Depends, Query, HTTPException, Path
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.database import get_db
from app.models.schemas import MediaItem
from app.services.media import MediaService

router = APIRouter()


@router.get("/listing/{listing_key}")
async def get_media_by_listing(
    listing_key: str = Path(..., description="Unique listing identifier"),
    size: Optional[str] = Query(None, description="Filter by image size (Thumbnail, Medium, Large)"),
    media_type: Optional[str] = Query(None, description="Filter by media type"),
    limit: Optional[int] = Query(None, ge=1, le=100, description="Limit number of media items"),
    db: Session = Depends(get_db)
):
    """
    Get media for a specific listing with optional filtering.
    """
    media_service = MediaService(db)
    media_items = media_service.get_media_by_listing(
        listing_key=listing_key,
        size_filter=size,
        media_type_filter=media_type,
        limit=limit
    )
    
    if media_items is None:
        raise HTTPException(
            status_code=404,
            detail=f"No media found for listing '{listing_key}'"
        )
    
    return {
        "listing_key": listing_key,
        "media": media_items,
        "count": len(media_items),
        "filters": {
            "size": size,
            "media_type": media_type,
            "limit": limit
        }
    }


@router.get("/item/{media_key}")
async def get_media_item(
    media_key: str = Path(..., description="Unique media identifier"),
    db: Session = Depends(get_db)
):
    """
    Get details for a specific media item.
    """
    media_service = MediaService(db)
    media_item = media_service.get_media_by_key(media_key)
    
    if not media_item:
        raise HTTPException(
            status_code=404,
            detail=f"Media item with key '{media_key}' not found"
        )
    
    return media_item


@router.get("/sizes")
async def get_available_media_sizes(
    property_type: Optional[str] = Query(None, description="Filter by property type"),
    db: Session = Depends(get_db)
):
    """
    Get list of available media sizes in the system.
    """
    media_service = MediaService(db)
    sizes = media_service.get_available_sizes(property_type)
    
    return {
        "available_sizes": sizes,
        "property_type": property_type
    }


@router.get("/types")
async def get_available_media_types(
    property_type: Optional[str] = Query(None, description="Filter by property type"),
    db: Session = Depends(get_db)
):
    """
    Get list of available media types in the system.
    """
    media_service = MediaService(db)
    types = media_service.get_available_types(property_type)
    
    return {
        "available_types": types,
        "property_type": property_type
    }