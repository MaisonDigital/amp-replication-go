from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
from datetime import datetime
from typing import Optional


class ResidentialProperty(Base):
    __tablename__ = "residential_properties"
    
    # Primary key
    listing_key = Column(String, primary_key=True, index=True)
    
    # Basic property info
    list_price = Column(Float)
    street_name = Column(String)
    street_number = Column(String)
    street_suffix = Column(String)
    city_region = Column(String, index=True)
    county_or_parish = Column(String, index=True)
    state_or_province = Column(String)
    postal_code = Column(String)
    apartment_number = Column(String)
    unit_number = Column(String)
    
    # Property details
    bedrooms_total = Column(Integer, index=True)
    bathrooms_total_integer = Column(Integer, index=True)
    parking_spaces = Column(Integer)
    rooms_above_grade = Column(Integer)
    rooms_below_grade = Column(Integer)
    
    # Timestamps
    original_entry_timestamp = Column(DateTime)
    modification_timestamp = Column(DateTime, index=True)
    
    # Property status and type
    standard_status = Column(String, index=True)
    transaction_type = Column(String, index=True)
    property_type = Column(String, index=True)
    property_sub_type = Column(String, index=True)
    
    # Property features
    public_remarks = Column(Text)
    architectural_style = Column(ARRAY(String))
    basement = Column(ARRAY(String))
    roof = Column(ARRAY(String))
    construction_materials = Column(ARRAY(String))
    foundation_details = Column(ARRAY(String))
    sewer = Column(ARRAY(String))
    cooling = Column(ARRAY(String))
    water_source = Column(ARRAY(String))
    fireplace_features = Column(ARRAY(String))
    community_features = Column(ARRAY(String))
    lot_features = Column(ARRAY(String))
    pool_features = Column(ARRAY(String))
    security_features = Column(ARRAY(String))
    waterfront_features = Column(ARRAY(String))
    
    # Lot details
    lot_depth = Column(Float)
    lot_width = Column(Float)
    lot_size_units = Column(String)
    
    # Financial
    tax_annual_amount = Column(Float)
    
    # Property systems
    cross_street = Column(String)
    zoning_designation = Column(String)
    heat_type = Column(String)
    heat_source = Column(String)
    has_fireplace = Column(Boolean)
    
    # Listing office
    list_office_name = Column(String)
    list_office_key = Column(String, index=True)
    
    # Virtual tours
    virtual_tour_url_unbranded = Column(String)
    virtual_tour_url_unbranded2 = Column(String)
    virtual_tour_url_branded = Column(String)
    virtual_tour_url_branded2 = Column(String)
    
    # Coordinates
    latitude = Column(Float, index=True)
    longitude = Column(Float, index=True)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class CommercialProperty(Base):
    __tablename__ = "commercial_properties"
    
    # Primary key
    listing_key = Column(String, primary_key=True, index=True)
    
    # Basic property info
    list_price = Column(Float)
    street_name = Column(String)
    street_number = Column(String)
    street_suffix = Column(String)
    city_region = Column(String, index=True)
    county_or_parish = Column(String, index=True)
    state_or_province = Column(String)
    postal_code = Column(String)
    apartment_number = Column(String)
    unit_number = Column(String)
    
    # Property details (fewer fields than residential)
    bedrooms_total = Column(Integer)
    bathrooms_total_integer = Column(Integer)
    parking_spaces = Column(Integer)
    
    # Timestamps
    original_entry_timestamp = Column(DateTime)
    modification_timestamp = Column(DateTime, index=True)
    
    # Property status and type
    standard_status = Column(String, index=True)
    transaction_type = Column(String, index=True)
    property_type = Column(String, index=True)
    property_sub_type = Column(String, index=True)
    
    # Property features
    public_remarks = Column(Text)
    
    # Lot details
    lot_depth = Column(Float)
    lot_width = Column(Float)
    lot_size_units = Column(String)
    
    # Financial
    tax_annual_amount = Column(Float)
    
    # Property systems
    cross_street = Column(String)
    zoning_designation = Column(String)
    
    # Listing office
    list_office_name = Column(String)
    list_office_key = Column(String, index=True)
    
    # Virtual tours
    virtual_tour_url_unbranded = Column(String)
    virtual_tour_url_unbranded2 = Column(String)
    virtual_tour_url_branded = Column(String)
    virtual_tour_url_branded2 = Column(String)
    
    # Coordinates
    latitude = Column(Float, index=True)
    longitude = Column(Float, index=True)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class ResidentialMedia(Base):
    __tablename__ = "residential_media"
    
    media_key = Column(String, primary_key=True, index=True)
    resource_record_key = Column(String, index=True, nullable=False)
    media_url = Column(String)
    media_category = Column(String)
    media_type = Column(String)
    order = Column(Integer, default=0)
    media_modification_timestamp = Column(DateTime)
    preferred_photo_yn = Column(Boolean)
    image_size_description = Column(String, index=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class CommercialMedia(Base):
    __tablename__ = "commercial_media"
    
    media_key = Column(String, primary_key=True, index=True)
    resource_record_key = Column(String, index=True, nullable=False)
    media_url = Column(String)
    media_category = Column(String)
    media_type = Column(String)
    order = Column(Integer, default=0)
    media_modification_timestamp = Column(DateTime)
    preferred_photo_yn = Column(Boolean)
    image_size_description = Column(String, index=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class ReplicationLog(Base):
    __tablename__ = "replication_logs"
    
    source = Column(String, primary_key=True)
    last_replicated_at = Column(DateTime, nullable=False)