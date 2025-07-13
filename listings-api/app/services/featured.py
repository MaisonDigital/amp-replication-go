from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc
from typing import List, Optional, Dict, Any
from app.models.database import (
    ResidentialProperty, CommercialProperty, 
    ResidentialMedia, CommercialMedia
)
from app.models.schemas import FeaturedListingsResponse, ListingSummary, PropertyType


class FeaturedService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_featured_listings(
        self,
        office_key: str,
        property_type: Optional[PropertyType] = None,
        limit: int = 12,
        transaction_type: Optional[str] = None
    ) -> Optional[FeaturedListingsResponse]:
        """Get featured listings for a specific broker office."""
        listings = []
        office_name = None
        
        # Get residential listings
        if not property_type or property_type == PropertyType.RESIDENTIAL:
            residential_listings, res_office_name = self._get_residential_featured(
                office_key, limit, transaction_type
            )
            listings.extend(residential_listings)
            if not office_name and res_office_name:
                office_name = res_office_name
        
        # Get commercial listings
        if not property_type or property_type == PropertyType.COMMERCIAL:
            remaining_limit = limit - len(listings)
            if remaining_limit > 0:
                commercial_listings, com_office_name = self._get_commercial_featured(
                    office_key, remaining_limit, transaction_type
                )
                listings.extend(commercial_listings)
                if not office_name and com_office_name:
                    office_name = com_office_name
        
        if not listings:
            return None
        
        # Sort by modification timestamp (most recent first)
        listings.sort(key=lambda x: x.modification_timestamp or "", reverse=True)
        
        return FeaturedListingsResponse(
            listings=listings[:limit],
            office_name=office_name,
            office_key=office_key,
            count=len(listings[:limit])
        )
    
    def get_office_info(self, office_key: str) -> Optional[Dict[str, Any]]:
        """Get basic information about a broker office."""
        # Try to get office name from residential properties first
        residential_office = (
            self.db.query(
                ResidentialProperty.list_office_name,
                func.count(ResidentialProperty.listing_key).label('residential_count')
            )
            .filter(
                and_(
                    ResidentialProperty.list_office_key == office_key,
                    ResidentialProperty.standard_status == "Active"
                )
            )
            .group_by(ResidentialProperty.list_office_name)
            .first()
        )
        
        # Try commercial properties
        commercial_office = (
            self.db.query(
                CommercialProperty.list_office_name,
                func.count(CommercialProperty.listing_key).label('commercial_count')
            )
            .filter(
                and_(
                    CommercialProperty.list_office_key == office_key,
                    CommercialProperty.standard_status == "Active"
                )
            )
            .group_by(CommercialProperty.list_office_name)
            .first()
        )
        
        if not residential_office and not commercial_office:
            return None
        
        office_name = (residential_office.list_office_name if residential_office 
                      else commercial_office.list_office_name)
        residential_count = residential_office.residential_count if residential_office else 0
        commercial_count = commercial_office.commercial_count if commercial_office else 0
        
        return {
            "office_key": office_key,
            "office_name": office_name,
            "total_listings": residential_count + commercial_count,
            "residential_listings": residential_count,
            "commercial_listings": commercial_count
        }
    
    def get_active_offices(
        self,
        property_type: Optional[PropertyType] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get list of active broker offices that have listings."""
        offices = {}
        
        # Get residential offices
        if not property_type or property_type == PropertyType.RESIDENTIAL:
            residential_offices = (
                self.db.query(
                    ResidentialProperty.list_office_key,
                    ResidentialProperty.list_office_name,
                    func.count(ResidentialProperty.listing_key).label('count')
                )
                .filter(ResidentialProperty.standard_status == "Active")
                .filter(ResidentialProperty.list_office_key.isnot(None))
                .group_by(
                    ResidentialProperty.list_office_key,
                    ResidentialProperty.list_office_name
                )
                .having(func.count(ResidentialProperty.listing_key) > 0)
                .all()
            )
            
            for office in residential_offices:
                key = office.list_office_key
                if key not in offices:
                    offices[key] = {
                        "office_key": key,
                        "office_name": office.list_office_name,
                        "residential_listings": 0,
                        "commercial_listings": 0
                    }
                offices[key]["residential_listings"] = office.count
        
        # Get commercial offices
        if not property_type or property_type == PropertyType.COMMERCIAL:
            commercial_offices = (
                self.db.query(
                    CommercialProperty.list_office_key,
                    CommercialProperty.list_office_name,
                    func.count(CommercialProperty.listing_key).label('count')
                )
                .filter(CommercialProperty.standard_status == "Active")
                .filter(CommercialProperty.list_office_key.isnot(None))
                .group_by(
                    CommercialProperty.list_office_key,
                    CommercialProperty.list_office_name
                )
                .having(func.count(CommercialProperty.listing_key) > 0)
                .all()
            )
            
            for office in commercial_offices:
                key = office.list_office_key
                if key not in offices:
                    offices[key] = {
                        "office_key": key,
                        "office_name": office.list_office_name,
                        "residential_listings": 0,
                        "commercial_listings": 0
                    }
                offices[key]["commercial_listings"] = office.count
        
        # Calculate total listings and sort by count
        office_list = list(offices.values())
        for office in office_list:
            office["total_listings"] = (
                office["residential_listings"] + office["commercial_listings"]
            )
        
        # Sort by total listings (descending) and limit
        office_list.sort(key=lambda x: x["total_listings"], reverse=True)
        return office_list[:limit]
    
    def _get_residential_featured(
        self,
        office_key: str,
        limit: int,
        transaction_type: Optional[str] = None
    ) -> tuple[List[ListingSummary], Optional[str]]:
        """Get featured residential listings for an office."""
        query = self.db.query(ResidentialProperty).filter(
            and_(
                ResidentialProperty.list_office_key == office_key,
                ResidentialProperty.standard_status == "Active"
            )
        )
        
        if transaction_type:
            query = query.filter(ResidentialProperty.transaction_type == transaction_type)
        
        # Order by modification timestamp (most recent first)
        results = (
            query.order_by(desc(ResidentialProperty.modification_timestamp))
            .limit(limit)
            .all()
        )
        
        office_name = results[0].list_office_name if results else None
        
        listings = []
        for result in results:
            thumbnail_url = self._get_thumbnail_url(result.listing_key, "residential")
            listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        return listings, office_name
    
    def _get_commercial_featured(
        self,
        office_key: str,
        limit: int,
        transaction_type: Optional[str] = None
    ) -> tuple[List[ListingSummary], Optional[str]]:
        """Get featured commercial listings for an office."""
        query = self.db.query(CommercialProperty).filter(
            and_(
                CommercialProperty.list_office_key == office_key,
                CommercialProperty.standard_status == "Active"
            )
        )
        
        if transaction_type:
            query = query.filter(CommercialProperty.transaction_type == transaction_type)
        
        # Order by modification timestamp (most recent first)
        results = (
            query.order_by(desc(CommercialProperty.modification_timestamp))
            .limit(limit)
            .all()
        )
        
        office_name = results[0].list_office_name if results else None
        
        listings = []
        for result in results:
            thumbnail_url = self._get_thumbnail_url(result.listing_key, "commercial")
            listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        return listings, office_name
    
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