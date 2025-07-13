from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional, Tuple, Union
from app.models.database import (
    ResidentialProperty, CommercialProperty, 
    ResidentialMedia, CommercialMedia
)
from app.models.schemas import ListingDetail, MediaItem, ListingSummary


class ListingsService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_listing_by_key(self, listing_key: str) -> Optional[ListingDetail]:
        """Get detailed listing information by listing key."""
        # Try residential first
        residential = (
            self.db.query(ResidentialProperty)
            .filter(ResidentialProperty.listing_key == listing_key)
            .first()
        )
        
        if residential:
            media = self._get_media_for_listing(listing_key, "residential")
            return ListingDetail.from_db_model(residential, media)
        
        # Try commercial
        commercial = (
            self.db.query(CommercialProperty)
            .filter(CommercialProperty.listing_key == listing_key)
            .first()
        )
        
        if commercial:
            media = self._get_media_for_listing(listing_key, "commercial")
            return ListingDetail.from_db_model(commercial, media)
        
        return None
    
    def get_listing_media(
        self, 
        listing_key: str, 
        size_filter: Optional[str] = None
    ) -> Optional[List[MediaItem]]:
        """Get all media for a listing, optionally filtered by size."""
        # Check if listing exists and determine type
        exists, property_type = self.check_listing_exists(listing_key)
        if not exists:
            return None
        
        return self._get_media_for_listing(listing_key, property_type, size_filter)
    
    def get_similar_listings(
        self, 
        listing_key: str, 
        limit: int = 5
    ) -> Optional[List[ListingSummary]]:
        """Get similar listings based on the provided listing's characteristics."""
        # Get the base listing
        base_listing = self.get_listing_by_key(listing_key)
        if not base_listing:
            return None
        
        similar_listings = []
        
        # Define similarity criteria based on property type
        if base_listing.property_type == "Residential":
            similar_listings = self._find_similar_residential(base_listing, limit)
        elif base_listing.property_type == "Commercial":
            similar_listings = self._find_similar_commercial(base_listing, limit)
        
        return similar_listings
    
    def check_listing_exists(self, listing_key: str) -> Tuple[bool, Optional[str]]:
        """Check if a listing exists and return its property type."""
        # Check residential
        residential_exists = (
            self.db.query(ResidentialProperty.listing_key)
            .filter(ResidentialProperty.listing_key == listing_key)
            .first()
        )
        if residential_exists:
            return True, "residential"
        
        # Check commercial
        commercial_exists = (
            self.db.query(CommercialProperty.listing_key)
            .filter(CommercialProperty.listing_key == listing_key)
            .first()
        )
        if commercial_exists:
            return True, "commercial"
        
        return False, None
    
    def _get_media_for_listing(
        self, 
        listing_key: str, 
        property_type: str, 
        size_filter: Optional[str] = None
    ) -> List[MediaItem]:
        """Get media items for a listing."""
        if property_type == "residential":
            query = (
                self.db.query(ResidentialMedia)
                .filter(ResidentialMedia.resource_record_key == listing_key)
            )
        else:
            query = (
                self.db.query(CommercialMedia)
                .filter(CommercialMedia.resource_record_key == listing_key)
            )
        
        # Apply size filter if provided
        if size_filter:
            query = query.filter(
                func.lower(query.column_descriptions[0]['type'].image_size_description) == size_filter.lower()
            )
        
        # Order by preference and order
        media_results = (
            query.order_by(
                ResidentialMedia.preferred_photo_yn.desc() if property_type == "residential" 
                else CommercialMedia.preferred_photo_yn.desc(),
                ResidentialMedia.order.asc() if property_type == "residential" 
                else CommercialMedia.order.asc()
            )
            .all()
        )
        
        return [MediaItem.model_validate(media.__dict__) for media in media_results]
    
    def _find_similar_residential(
        self, 
        base_listing: ListingDetail, 
        limit: int
    ) -> List[ListingSummary]:
        """Find similar residential properties."""
        query = self.db.query(ResidentialProperty)
        
        # Exclude the current listing
        query = query.filter(ResidentialProperty.listing_key != base_listing.listing_key)
        
        # Base filters
        conditions = [
            ResidentialProperty.standard_status == "Active",
            ResidentialProperty.property_type == "Residential"
        ]
        
        # Same transaction type
        if base_listing.transaction_type:
            conditions.append(ResidentialProperty.transaction_type == base_listing.transaction_type)
        
        # Same property sub-type (or similar)
        if base_listing.property_sub_type:
            conditions.append(ResidentialProperty.property_sub_type == base_listing.property_sub_type)
        
        # Same city/region
        if base_listing.address.city_region:
            conditions.append(ResidentialProperty.city_region == base_listing.address.city_region)
        
        # Similar price range (±20%)
        if base_listing.list_price:
            price_variance = base_listing.list_price * 0.2
            conditions.extend([
                ResidentialProperty.list_price >= (base_listing.list_price - price_variance),
                ResidentialProperty.list_price <= (base_listing.list_price + price_variance)
            ])
        
        # Similar bedroom count (±1)
        if base_listing.bedrooms_total:
            conditions.append(
                ResidentialProperty.bedrooms_total.between(
                    base_listing.bedrooms_total - 1,
                    base_listing.bedrooms_total + 1
                )
            )
        
        # Apply filters and get results
        results = (
            query.filter(and_(*conditions))
            .order_by(ResidentialProperty.modification_timestamp.desc())
            .limit(limit)
            .all()
        )
        
        # Convert to ListingSummary
        similar_listings = []
        for result in results:
            thumbnail_url = self._get_thumbnail_url(result.listing_key, "residential")
            similar_listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        return similar_listings
    
    def _find_similar_commercial(
        self, 
        base_listing: ListingDetail, 
        limit: int
    ) -> List[ListingSummary]:
        """Find similar commercial properties."""
        query = self.db.query(CommercialProperty)
        
        # Exclude the current listing
        query = query.filter(CommercialProperty.listing_key != base_listing.listing_key)
        
        # Base filters
        conditions = [
            CommercialProperty.standard_status == "Active",
            CommercialProperty.property_type == "Commercial"
        ]
        
        # Same transaction type
        if base_listing.transaction_type:
            conditions.append(CommercialProperty.transaction_type == base_listing.transaction_type)
        
        # Same property sub-type
        if base_listing.property_sub_type:
            conditions.append(CommercialProperty.property_sub_type == base_listing.property_sub_type)
        
        # Same city/region
        if base_listing.address.city_region:
            conditions.append(CommercialProperty.city_region == base_listing.address.city_region)
        
        # Similar price range (±30% for commercial)
        if base_listing.list_price:
            price_variance = base_listing.list_price * 0.3
            conditions.extend([
                CommercialProperty.list_price >= (base_listing.list_price - price_variance),
                CommercialProperty.list_price <= (base_listing.list_price + price_variance)
            ])
        
        # Apply filters and get results
        results = (
            query.filter(and_(*conditions))
            .order_by(CommercialProperty.modification_timestamp.desc())
            .limit(limit)
            .all()
        )
        
        # Convert to ListingSummary
        similar_listings = []
        for result in results:
            thumbnail_url = self._get_thumbnail_url(result.listing_key, "commercial")
            similar_listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        return similar_listings
    
    def _get_thumbnail_url(self, listing_key: str, property_type: str) -> Optional[str]:
        """Get thumbnail URL for a listing."""
        try:
            if property_type == "residential":
                media = (
                    self.db.query(ResidentialMedia)
                    .filter(
                        and_(
                            ResidentialMedia.resource_record_key == listing_key,
                            ResidentialMedia.image_size_description == "Thumbnail",
                            ResidentialMedia.media_url.isnot(None)
                        )
                    )
                    .order_by(
                        ResidentialMedia.preferred_photo_yn.desc(),
                        ResidentialMedia.order.asc()
                    )
                    .first()
                )
            else:
                media = (
                    self.db.query(CommercialMedia)
                    .filter(
                        and_(
                            CommercialMedia.resource_record_key == listing_key,
                            CommercialMedia.image_size_description == "Thumbnail",
                            CommercialMedia.media_url.isnot(None)
                        )
                    )
                    .order_by(
                        CommercialMedia.preferred_photo_yn.desc(),
                        CommercialMedia.order.asc()
                    )
                    .first()
                )
            
            return media.media_url if media else None
        except Exception:
            return None