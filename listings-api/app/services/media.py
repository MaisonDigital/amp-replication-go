from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional, Union
from app.models.database import ResidentialMedia, CommercialMedia
from app.models.schemas import MediaItem


class MediaService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_media_by_listing(
        self,
        listing_key: str,
        size_filter: Optional[str] = None,
        media_type_filter: Optional[str] = None,
        limit: Optional[int] = None
    ) -> Optional[List[MediaItem]]:
        """Get media items for a specific listing with optional filtering."""
        # Check if listing exists in either table
        residential_exists = self._check_residential_listing_exists(listing_key)
        commercial_exists = self._check_commercial_listing_exists(listing_key)
        
        if not residential_exists and not commercial_exists:
            return None
        
        media_items = []
        
        # Get residential media
        if residential_exists:
            residential_media = self._get_residential_media(
                listing_key, size_filter, media_type_filter, limit
            )
            media_items.extend(residential_media)
        
        # Get commercial media
        if commercial_exists:
            remaining_limit = None
            if limit and residential_exists:
                remaining_limit = max(0, limit - len(media_items))
            elif limit and not residential_exists:
                remaining_limit = limit
            
            commercial_media = self._get_commercial_media(
                listing_key, size_filter, media_type_filter, remaining_limit
            )
            media_items.extend(commercial_media)
        
        # Sort by preferred photo and order
        media_items.sort(key=lambda x: (not x.preferred_photo_yn, x.order))
        
        return media_items[:limit] if limit else media_items
    
    def get_media_by_key(self, media_key: str) -> Optional[MediaItem]:
        """Get a specific media item by its key."""
        # Try residential media first
        residential_media = (
            self.db.query(ResidentialMedia)
            .filter(ResidentialMedia.media_key == media_key)
            .first()
        )
        
        if residential_media:
            return MediaItem.model_validate(residential_media.__dict__)
        
        # Try commercial media
        commercial_media = (
            self.db.query(CommercialMedia)
            .filter(CommercialMedia.media_key == media_key)
            .first()
        )
        
        if commercial_media:
            return MediaItem.model_validate(commercial_media.__dict__)
        
        return None
    
    def get_available_sizes(self, property_type: Optional[str] = None) -> List[str]:
        """Get list of available image sizes."""
        sizes = set()
        
        if not property_type or property_type.lower() == "residential":
            residential_sizes = (
                self.db.query(ResidentialMedia.image_size_description)
                .filter(ResidentialMedia.image_size_description.isnot(None))
                .distinct()
                .all()
            )
            sizes.update([size[0] for size in residential_sizes])
        
        if not property_type or property_type.lower() == "commercial":
            commercial_sizes = (
                self.db.query(CommercialMedia.image_size_description)
                .filter(CommercialMedia.image_size_description.isnot(None))
                .distinct()
                .all()
            )
            sizes.update([size[0] for size in commercial_sizes])
        
        return sorted(list(sizes))
    
    def get_available_types(self, property_type: Optional[str] = None) -> List[str]:
        """Get list of available media types."""
        types = set()
        
        if not property_type or property_type.lower() == "residential":
            residential_types = (
                self.db.query(ResidentialMedia.media_type)
                .filter(ResidentialMedia.media_type.isnot(None))
                .distinct()
                .all()
            )
            types.update([type_[0] for type_ in residential_types])
        
        if not property_type or property_type.lower() == "commercial":
            commercial_types = (
                self.db.query(CommercialMedia.media_type)
                .filter(CommercialMedia.media_type.isnot(None))
                .distinct()
                .all()
            )
            types.update([type_[0] for type_ in commercial_types])
        
        return sorted(list(types))
    
    def _check_residential_listing_exists(self, listing_key: str) -> bool:
        """Check if a residential listing exists."""
        from app.models.database import ResidentialProperty
        
        exists = (
            self.db.query(ResidentialProperty.listing_key)
            .filter(ResidentialProperty.listing_key == listing_key)
            .first()
        )
        return exists is not None
    
    def _check_commercial_listing_exists(self, listing_key: str) -> bool:
        """Check if a commercial listing exists."""
        from app.models.database import CommercialProperty
        
        exists = (
            self.db.query(CommercialProperty.listing_key)
            .filter(CommercialProperty.listing_key == listing_key)
            .first()
        )
        return exists is not None
    
    def _get_residential_media(
        self,
        listing_key: str,
        size_filter: Optional[str] = None,
        media_type_filter: Optional[str] = None,
        limit: Optional[int] = None
    ) -> List[MediaItem]:
        """Get residential media for a listing."""
        query = self.db.query(ResidentialMedia).filter(
            ResidentialMedia.resource_record_key == listing_key
        )
        
        # Apply filters
        if size_filter:
            query = query.filter(
                func.lower(ResidentialMedia.image_size_description) == size_filter.lower()
            )
        
        if media_type_filter:
            query = query.filter(
                func.lower(ResidentialMedia.media_type) == media_type_filter.lower()
            )
        
        # Order by preference and order
        query = query.order_by(
            ResidentialMedia.preferred_photo_yn.desc(),
            ResidentialMedia.order.asc()
        )
        
        if limit:
            query = query.limit(limit)
        
        results = query.all()
        return [MediaItem.model_validate(media.__dict__) for media in results]
    
    def _get_commercial_media(
        self,
        listing_key: str,
        size_filter: Optional[str] = None,
        media_type_filter: Optional[str] = None,
        limit: Optional[int] = None
    ) -> List[MediaItem]:
        """Get commercial media for a listing."""
        query = self.db.query(CommercialMedia).filter(
            CommercialMedia.resource_record_key == listing_key
        )
        
        # Apply filters
        if size_filter:
            query = query.filter(
                func.lower(CommercialMedia.image_size_description) == size_filter.lower()
            )
        
        if media_type_filter:
            query = query.filter(
                func.lower(CommercialMedia.media_type) == media_type_filter.lower()
            )
        
        # Order by preference and order
        query = query.order_by(
            CommercialMedia.preferred_photo_yn.desc(),
            CommercialMedia.order.asc()
        )
        
        if limit:
            query = query.limit(limit)
        
        results = query.all()
        return [MediaItem.model_validate(media.__dict__) for media in results]