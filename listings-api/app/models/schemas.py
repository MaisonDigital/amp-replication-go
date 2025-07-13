from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Union
from datetime import datetime
from enum import Enum


# Enums for validation
class TransactionType(str, Enum):
    FOR_SALE = "For Sale"
    FOR_LEASE = "For Lease"
    FOR_SUB_LEASE = "For Sub-Lease"


class PropertyType(str, Enum):
    RESIDENTIAL = "Residential"
    COMMERCIAL = "Commercial"


class StandardStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    PENDING = "Pending"


class SortOption(str, Enum):
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"
    NEWEST = "newest"
    UPDATED = "updated"


# Base schemas
class PropertyAddress(BaseModel):
    street_number: Optional[str] = None
    street_name: Optional[str] = None
    street_suffix: Optional[str] = None
    apartment_number: Optional[str] = None
    unit_number: Optional[str] = None
    city_region: Optional[str] = None
    county_or_parish: Optional[str] = None
    state_or_province: Optional[str] = None
    postal_code: Optional[str] = None

    @property
    def full_address(self) -> str:
        """Generate a formatted full address string"""
        parts = []
        
        # Street address
        street_parts = [self.street_number, self.street_name, self.street_suffix]
        street = " ".join(filter(None, street_parts))
        if street:
            parts.append(street)
        
        # Unit/apartment
        if self.apartment_number:
            parts.append(f"Apt {self.apartment_number}")
        elif self.unit_number:
            parts.append(f"Unit {self.unit_number}")
        
        # City and postal code
        if self.city_region:
            city_postal = self.city_region
            if self.postal_code:
                city_postal += f", {self.postal_code}"
            parts.append(city_postal)
        
        return ", ".join(parts)


class PropertyCoordinates(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class MediaItem(BaseModel):
    media_key: str
    media_url: Optional[str] = None
    media_category: Optional[str] = None
    media_type: Optional[str] = None
    order: int = 0
    preferred_photo_yn: Optional[bool] = None
    image_size_description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# Main listing schemas
class ListingBase(BaseModel):
    listing_key: str
    list_price: Optional[float] = None
    address: PropertyAddress
    coordinates: PropertyCoordinates
    bedrooms_total: Optional[int] = None
    bathrooms_total_integer: Optional[int] = None
    parking_spaces: Optional[int] = None
    standard_status: Optional[str] = None
    transaction_type: Optional[str] = None
    property_type: Optional[str] = None
    property_sub_type: Optional[str] = None
    modification_timestamp: Optional[datetime] = None
    original_entry_timestamp: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ListingSummary(ListingBase):
    """Minimal listing data for search results and map displays"""
    thumbnail_url: Optional[str] = None
    
    @classmethod
    def from_db_model(cls, db_model, thumbnail_url: Optional[str] = None):
        """Create ListingSummary from database model"""
        return cls(
            listing_key=db_model.listing_key,
            list_price=db_model.list_price,
            address=PropertyAddress(
                street_number=db_model.street_number,
                street_name=db_model.street_name,
                street_suffix=db_model.street_suffix,
                apartment_number=db_model.apartment_number,
                unit_number=db_model.unit_number,
                city_region=db_model.city_region,
                county_or_parish=db_model.county_or_parish,
                state_or_province=db_model.state_or_province,
                postal_code=db_model.postal_code,
            ),
            coordinates=PropertyCoordinates(
                latitude=db_model.latitude,
                longitude=db_model.longitude,
            ),
            bedrooms_total=db_model.bedrooms_total,
            bathrooms_total_integer=db_model.bathrooms_total_integer,
            parking_spaces=db_model.parking_spaces,
            standard_status=db_model.standard_status,
            transaction_type=db_model.transaction_type,
            property_type=db_model.property_type,
            property_sub_type=db_model.property_sub_type,
            modification_timestamp=db_model.modification_timestamp,
            original_entry_timestamp=db_model.original_entry_timestamp,
            thumbnail_url=thumbnail_url,
        )


class ListingDetail(ListingBase):
    """Full listing details"""
    public_remarks: Optional[str] = None
    rooms_above_grade: Optional[int] = None
    rooms_below_grade: Optional[int] = None
    lot_depth: Optional[float] = None
    lot_width: Optional[float] = None
    lot_size_units: Optional[str] = None
    tax_annual_amount: Optional[float] = None
    heat_type: Optional[str] = None
    heat_source: Optional[str] = None
    has_fireplace: Optional[bool] = None
    cross_street: Optional[str] = None
    zoning_designation: Optional[str] = None
    list_office_name: Optional[str] = None
    list_office_key: Optional[str] = None
    virtual_tour_url_unbranded: Optional[str] = None
    virtual_tour_url_unbranded2: Optional[str] = None
    virtual_tour_url_branded: Optional[str] = None
    virtual_tour_url_branded2: Optional[str] = None
    
    # Array fields for residential properties
    architectural_style: Optional[List[str]] = None
    basement: Optional[List[str]] = None
    roof: Optional[List[str]] = None
    construction_materials: Optional[List[str]] = None
    foundation_details: Optional[List[str]] = None
    sewer: Optional[List[str]] = None
    cooling: Optional[List[str]] = None
    water_source: Optional[List[str]] = None
    fireplace_features: Optional[List[str]] = None
    community_features: Optional[List[str]] = None
    lot_features: Optional[List[str]] = None
    pool_features: Optional[List[str]] = None
    security_features: Optional[List[str]] = None
    waterfront_features: Optional[List[str]] = None
    
    media: List[MediaItem] = []

    @classmethod
    def from_db_model(cls, db_model, media_list: List[MediaItem] = None):
        """Create ListingDetail from database model"""
        return cls(
            listing_key=db_model.listing_key,
            list_price=db_model.list_price,
            address=PropertyAddress(
                street_number=db_model.street_number,
                street_name=db_model.street_name,
                street_suffix=db_model.street_suffix,
                apartment_number=db_model.apartment_number,
                unit_number=db_model.unit_number,
                city_region=db_model.city_region,
                county_or_parish=db_model.county_or_parish,
                state_or_province=db_model.state_or_province,
                postal_code=db_model.postal_code,
            ),
            coordinates=PropertyCoordinates(
                latitude=db_model.latitude,
                longitude=db_model.longitude,
            ),
            bedrooms_total=db_model.bedrooms_total,
            bathrooms_total_integer=db_model.bathrooms_total_integer,
            parking_spaces=db_model.parking_spaces,
            standard_status=db_model.standard_status,
            transaction_type=db_model.transaction_type,
            property_type=db_model.property_type,
            property_sub_type=db_model.property_sub_type,
            modification_timestamp=db_model.modification_timestamp,
            original_entry_timestamp=db_model.original_entry_timestamp,
            public_remarks=db_model.public_remarks,
            rooms_above_grade=getattr(db_model, 'rooms_above_grade', None),
            rooms_below_grade=getattr(db_model, 'rooms_below_grade', None),
            lot_depth=db_model.lot_depth,
            lot_width=db_model.lot_width,
            lot_size_units=db_model.lot_size_units,
            tax_annual_amount=db_model.tax_annual_amount,
            heat_type=getattr(db_model, 'heat_type', None),
            heat_source=getattr(db_model, 'heat_source', None),
            has_fireplace=getattr(db_model, 'has_fireplace', None),
            cross_street=db_model.cross_street,
            zoning_designation=db_model.zoning_designation,
            list_office_name=db_model.list_office_name,
            list_office_key=db_model.list_office_key,
            virtual_tour_url_unbranded=db_model.virtual_tour_url_unbranded,
            virtual_tour_url_unbranded2=db_model.virtual_tour_url_unbranded2,
            virtual_tour_url_branded=db_model.virtual_tour_url_branded,
            virtual_tour_url_branded2=db_model.virtual_tour_url_branded2,
            # Residential-specific fields (will be None for commercial)
            architectural_style=getattr(db_model, 'architectural_style', None),
            basement=getattr(db_model, 'basement', None),
            roof=getattr(db_model, 'roof', None),
            construction_materials=getattr(db_model, 'construction_materials', None),
            foundation_details=getattr(db_model, 'foundation_details', None),
            sewer=getattr(db_model, 'sewer', None),
            cooling=getattr(db_model, 'cooling', None),
            water_source=getattr(db_model, 'water_source', None),
            fireplace_features=getattr(db_model, 'fireplace_features', None),
            community_features=getattr(db_model, 'community_features', None),
            lot_features=getattr(db_model, 'lot_features', None),
            pool_features=getattr(db_model, 'pool_features', None),
            security_features=getattr(db_model, 'security_features', None),
            waterfront_features=getattr(db_model, 'waterfront_features', None),
            media=media_list or [],
        )


# Search request/response schemas
class SearchFilters(BaseModel):
    transaction_type: Optional[TransactionType] = None
    property_type: Optional[PropertyType] = None
    property_sub_type: Optional[str] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    city_region: Optional[str] = None
    county_or_parish: Optional[str] = None
    
    # Map bounds for geographic search
    ne_lat: Optional[float] = Field(None, description="Northeast latitude")
    ne_lng: Optional[float] = Field(None, description="Northeast longitude")
    sw_lat: Optional[float] = Field(None, description="Southwest latitude")
    sw_lng: Optional[float] = Field(None, description="Southwest longitude")


class PaginationInfo(BaseModel):
    page: int
    limit: int
    total: int
    pages: int


class SearchResponse(BaseModel):
    listings: List[ListingSummary]
    pagination: PaginationInfo
    filters_applied: SearchFilters


class MapResponse(BaseModel):
    listings: List[ListingSummary]
    count: int


class FeaturedListingsResponse(BaseModel):
    listings: List[ListingSummary]
    office_name: Optional[str] = None
    office_key: str
    count: int