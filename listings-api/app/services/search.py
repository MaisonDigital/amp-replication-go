from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, asc
from typing import List, Tuple, Optional, Union
from app.models.database import ResidentialProperty, CommercialProperty, ResidentialMedia, CommercialMedia
from app.models.schemas import SearchFilters, ListingSummary, SortOption, PropertyType


class SearchService:
    def __init__(self, db: Session):
        self.db = db
    
    def search_listings(
        self, 
        filters: SearchFilters, 
        page: int = 1, 
        limit: int = 20, 
        sort: SortOption = SortOption.NEWEST
    ) -> Tuple[List[ListingSummary], int]:
        """
        Search listings with filters, pagination, and sorting.
        Returns (listings, total_count)
        """
        # Build queries for both residential and commercial
        residential_query = self._build_residential_query(filters)
        commercial_query = self._build_commercial_query(filters)
        
        # Get total count
        total_count = 0
        if not filters.property_type or filters.property_type == PropertyType.RESIDENTIAL:
            total_count += residential_query.count()
        if not filters.property_type or filters.property_type == PropertyType.COMMERCIAL:
            total_count += commercial_query.count()
        
        # Apply sorting and pagination
        residential_query = self._apply_sorting(residential_query, sort, ResidentialProperty)
        commercial_query = self._apply_sorting(commercial_query, sort, CommercialProperty)
        
        # Get results from both tables
        listings = []
        
        if not filters.property_type or filters.property_type == PropertyType.RESIDENTIAL:
            residential_results = residential_query.offset((page - 1) * limit).limit(limit).all()
            for result in residential_results:
                thumbnail_url = self._get_thumbnail_url(result.listing_key, "residential")
                listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        if not filters.property_type or filters.property_type == PropertyType.COMMERCIAL:
            remaining_limit = limit - len(listings)
            if remaining_limit > 0:
                commercial_offset = max(0, (page - 1) * limit - len(listings))
                commercial_results = commercial_query.offset(commercial_offset).limit(remaining_limit).all()
                for result in commercial_results:
                    thumbnail_url = self._get_thumbnail_url(result.listing_key, "commercial")
                    listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        # Sort combined results if needed
        if filters.property_type is None:
            listings = self._sort_combined_listings(listings, sort)
        
        return listings[:limit], total_count
    
    def search_listings_for_map(
        self, 
        filters: SearchFilters, 
        limit: int = 500
    ) -> List[ListingSummary]:
        """
        Search listings for map display (requires geographic bounds).
        Returns only listings with valid coordinates.
        """
        # Ensure we have geographic bounds
        if not all([filters.ne_lat, filters.ne_lng, filters.sw_lat, filters.sw_lng]):
            return []
        
        listings = []
        
        # Search residential properties
        if not filters.property_type or filters.property_type == PropertyType.RESIDENTIAL:
            residential_query = self._build_residential_query(filters, require_coordinates=True)
            residential_results = residential_query.limit(limit // 2 if not filters.property_type else limit).all()
            
            for result in residential_results:
                thumbnail_url = self._get_thumbnail_url(result.listing_key, "residential")
                listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        # Search commercial properties
        if not filters.property_type or filters.property_type == PropertyType.COMMERCIAL:
            remaining_limit = limit - len(listings)
            if remaining_limit > 0:
                commercial_query = self._build_commercial_query(filters, require_coordinates=True)
                commercial_results = commercial_query.limit(remaining_limit).all()
                
                for result in commercial_results:
                    thumbnail_url = self._get_thumbnail_url(result.listing_key, "commercial")
                    listings.append(ListingSummary.from_db_model(result, thumbnail_url))
        
        return listings[:limit]
    
    def get_city_suggestions(
        self, 
        query: str, 
        property_type: Optional[PropertyType] = None, 
        limit: int = 10
    ) -> List[str]:
        """Get city suggestions for autocomplete."""
        query = f"%{query.lower()}%"
        
        cities = set()
        
        if not property_type or property_type == PropertyType.RESIDENTIAL:
            residential_cities = (
                self.db.query(ResidentialProperty.city_region)
                .filter(
                    and_(
                        ResidentialProperty.city_region.isnot(None),
                        func.lower(ResidentialProperty.city_region).like(query),
                        ResidentialProperty.standard_status == "Active"
                    )
                )
                .distinct()
                .limit(limit)
                .all()
            )
            cities.update([city[0] for city in residential_cities if city[0]])
        
        if not property_type or property_type == PropertyType.COMMERCIAL:
            commercial_cities = (
                self.db.query(CommercialProperty.city_region)
                .filter(
                    and_(
                        CommercialProperty.city_region.isnot(None),
                        func.lower(CommercialProperty.city_region).like(query),
                        CommercialProperty.standard_status == "Active"
                    )
                )
                .distinct()
                .limit(limit)
                .all()
            )
            cities.update([city[0] for city in commercial_cities if city[0]])
        
        return sorted(list(cities))[:limit]
    
    def get_property_subtypes(
        self, 
        property_type: Optional[PropertyType] = None
    ) -> List[str]:
        """Get available property sub-types."""
        subtypes = set()
        
        if not property_type or property_type == PropertyType.RESIDENTIAL:
            residential_subtypes = (
                self.db.query(ResidentialProperty.property_sub_type)
                .filter(
                    and_(
                        ResidentialProperty.property_sub_type.isnot(None),
                        ResidentialProperty.standard_status == "Active"
                    )
                )
                .distinct()
                .all()
            )
            subtypes.update([subtype[0] for subtype in residential_subtypes if subtype[0]])
        
        if not property_type or property_type == PropertyType.COMMERCIAL:
            commercial_subtypes = (
                self.db.query(CommercialProperty.property_sub_type)
                .filter(
                    and_(
                        CommercialProperty.property_sub_type.isnot(None),
                        CommercialProperty.standard_status == "Active"
                    )
                )
                .distinct()
                .all()
            )
            subtypes.update([subtype[0] for subtype in commercial_subtypes if subtype[0]])
        
        return sorted(list(subtypes))
    
    def _build_residential_query(self, filters: SearchFilters, require_coordinates: bool = False):
        """Build SQLAlchemy query for residential properties."""
        query = self.db.query(ResidentialProperty)
        
        # Base filters
        conditions = [ResidentialProperty.standard_status == "Active"]
        
        # Transaction type
        if filters.transaction_type:
            conditions.append(ResidentialProperty.transaction_type == filters.transaction_type)
        
        # Property sub-type
        if filters.property_sub_type:
            conditions.append(ResidentialProperty.property_sub_type == filters.property_sub_type)
        
        # Price range
        if filters.min_price is not None:
            conditions.append(ResidentialProperty.list_price >= filters.min_price)
        if filters.max_price is not None:
            conditions.append(ResidentialProperty.list_price <= filters.max_price)
        
        # Bedrooms and bathrooms
        if filters.bedrooms is not None:
            conditions.append(ResidentialProperty.bedrooms_total >= filters.bedrooms)
        if filters.bathrooms is not None:
            conditions.append(ResidentialProperty.bathrooms_total_integer >= filters.bathrooms)
        
        # Location filters
        if filters.city_region:
            conditions.append(
                func.lower(ResidentialProperty.city_region).like(f"%{filters.city_region.lower()}%")
            )
        if filters.county_or_parish:
            conditions.append(
                func.lower(ResidentialProperty.county_or_parish).like(f"%{filters.county_or_parish.lower()}%")
            )
        
        # Geographic bounds
        if all([filters.ne_lat, filters.ne_lng, filters.sw_lat, filters.sw_lng]):
            conditions.extend([
                ResidentialProperty.latitude.between(filters.sw_lat, filters.ne_lat),
                ResidentialProperty.longitude.between(filters.sw_lng, filters.ne_lng)
            ])
        
        # Require coordinates for map searches
        if require_coordinates:
            conditions.extend([
                ResidentialProperty.latitude.isnot(None),
                ResidentialProperty.longitude.isnot(None)
            ])
        
        return query.filter(and_(*conditions))
    
    def _build_commercial_query(self, filters: SearchFilters, require_coordinates: bool = False):
        """Build SQLAlchemy query for commercial properties."""
        query = self.db.query(CommercialProperty)
        
        # Base filters
        conditions = [CommercialProperty.standard_status == "Active"]
        
        # Transaction type
        if filters.transaction_type:
            conditions.append(CommercialProperty.transaction_type == filters.transaction_type)
        
        # Property sub-type
        if filters.property_sub_type:
            conditions.append(CommercialProperty.property_sub_type == filters.property_sub_type)
        
        # Price range
        if filters.min_price is not None:
            conditions.append(CommercialProperty.list_price >= filters.min_price)
        if filters.max_price is not None:
            conditions.append(CommercialProperty.list_price <= filters.max_price)
        
        # Note: Commercial properties may not have bedrooms/bathrooms filters
        
        # Location filters
        if filters.city_region:
            conditions.append(
                func.lower(CommercialProperty.city_region).like(f"%{filters.city_region.lower()}%")
            )
        if filters.county_or_parish:
            conditions.append(
                func.lower(CommercialProperty.county_or_parish).like(f"%{filters.county_or_parish.lower()}%")
            )
        
        # Geographic bounds
        if all([filters.ne_lat, filters.ne_lng, filters.sw_lat, filters.sw_lng]):
            conditions.extend([
                CommercialProperty.latitude.between(filters.sw_lat, filters.ne_lat),
                CommercialProperty.longitude.between(filters.sw_lng, filters.ne_lng)
            ])
        
        # Require coordinates for map searches
        if require_coordinates:
            conditions.extend([
                CommercialProperty.latitude.isnot(None),
                CommercialProperty.longitude.isnot(None)
            ])
        
        return query.filter(and_(*conditions))
    
    def _apply_sorting(self, query, sort: SortOption, model_class):
        """Apply sorting to query."""
        if sort == SortOption.PRICE_ASC:
            return query.order_by(asc(model_class.list_price))
        elif sort == SortOption.PRICE_DESC:
            return query.order_by(desc(model_class.list_price))
        elif sort == SortOption.UPDATED:
            return query.order_by(desc(model_class.modification_timestamp))
        else:  # NEWEST
            return query.order_by(desc(model_class.original_entry_timestamp))
    
    def _sort_combined_listings(self, listings: List[ListingSummary], sort: SortOption) -> List[ListingSummary]:
        """Sort combined residential and commercial listings."""
        if sort == SortOption.PRICE_ASC:
            return sorted(listings, key=lambda x: x.list_price or 0)
        elif sort == SortOption.PRICE_DESC:
            return sorted(listings, key=lambda x: x.list_price or 0, reverse=True)
        elif sort == SortOption.UPDATED:
            return sorted(listings, key=lambda x: x.modification_timestamp or "", reverse=True)
        else:  # NEWEST
            return sorted(listings, key=lambda x: x.original_entry_timestamp or "", reverse=True)
    
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
                    .order_by(ResidentialMedia.order)
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
                    .order_by(CommercialMedia.order)
                    .first()
                )
            
            return media.media_url if media else None
        except Exception:
            return None