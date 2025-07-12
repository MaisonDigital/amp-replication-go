package models

import (
	"time"

	"github.com/lib/pq"
)

type Property struct {
	ListingKey               string         `gorm:"primaryKey;column:listing_key" json:"ListingKey"`
	ListPrice                *float64       `gorm:"column:list_price" json:"ListPrice"`
	StreetName               *string        `gorm:"column:street_name" json:"StreetName"`
	StreetNumber             *string        `gorm:"column:street_number" json:"StreetNumber"`
	StreetSuffix             *string        `gorm:"column:street_suffix" json:"StreetSuffix"`
	CityRegion               *string        `gorm:"column:city_region" json:"CityRegion"`
	CountyOrParish           *string        `gorm:"column:county_or_parish" json:"CountyOrParish"`
	StateOrProvince          *string        `gorm:"column:state_or_province" json:"StateOrProvince"`
	PostalCode               *string        `gorm:"column:postal_code" json:"PostalCode"`
	BedroomsTotal            *int           `gorm:"column:bedrooms_total" json:"BedroomsTotal"`
	BathroomsTotalInteger    *int           `gorm:"column:bathrooms_total_integer" json:"BathroomsTotalInteger"`
	ParkingSpaces            *int           `gorm:"column:parking_spaces" json:"ParkingSpaces"`
	OriginalEntryTimestamp   *time.Time     `gorm:"column:original_entry_timestamp" json:"OriginalEntryTimestamp"`
	ModificationTimestamp    *time.Time     `gorm:"column:modification_timestamp" json:"ModificationTimestamp"`
	StandardStatus           *string        `gorm:"column:standard_status" json:"StandardStatus"`
	PublicRemarks            *string        `gorm:"column:public_remarks" json:"PublicRemarks"`
	TransactionType          *string        `gorm:"column:transaction_type" json:"TransactionType"`
	PropertySubType          *string        `gorm:"column:property_sub_type" json:"PropertySubType"`
	PropertyType             *string        `gorm:"column:property_type" json:"PropertyType"`
	ArchitecturalStyle       pq.StringArray `gorm:"type:text[];column:architectural_style" json:"ArchitecturalStyle"`
	LotDepth                 *float64       `gorm:"column:lot_depth" json:"LotDepth"`
	LotWidth                 *float64       `gorm:"column:lot_width" json:"LotWidth"`
	LotSizeUnits             *string        `gorm:"column:lot_size_units" json:"LotSizeUnits"`
	TaxAnnualAmount          *float64       `gorm:"column:tax_annual_amount" json:"TaxAnnualAmount"`
	RoomsAboveGrade          *int           `gorm:"column:rooms_above_grade" json:"RoomsAboveGrade"`
	RoomsBelowGrade          *int           `gorm:"column:rooms_below_grade" json:"RoomsBelowGrade"`
	Basement                 pq.StringArray `gorm:"type:text[];column:basement" json:"Basement"`
	Roof                     pq.StringArray `gorm:"type:text[];column:roof" json:"Roof"`
	ConstructionMaterials    pq.StringArray `gorm:"type:text[];column:construction_materials" json:"ConstructionMaterials"`
	FoundationDetails        pq.StringArray `gorm:"type:text[];column:foundation_details" json:"FoundationDetails"`
	Sewer                    pq.StringArray `gorm:"type:text[];column:sewer" json:"Sewer"`
	CrossStreet              *string        `gorm:"column:cross_street" json:"CrossStreet"`
	ZoningDesignation        *string        `gorm:"column:zoning_designation" json:"ZoningDesignation"`
	HeatType                 *string        `gorm:"column:heat_type" json:"HeatType"`
	HeatSource               *string        `gorm:"column:heat_source" json:"HeatSource"`
	FireplaceYN              *bool          `gorm:"column:has_fireplace" json:"FireplaceYN"`
	FireplaceFeatures        pq.StringArray `gorm:"type:text[];column:fireplace_features" json:"FireplaceFeatures"`
	Cooling                  pq.StringArray `gorm:"type:text[];column:cooling" json:"Cooling"`
	WaterSource              pq.StringArray `gorm:"type:text[];column:water_source" json:"WaterSource"`
	CommunityFeatures        pq.StringArray `gorm:"type:text[];column:community_features" json:"CommunityFeatures"`
	LotFeatures              pq.StringArray `gorm:"type:text[];column:lot_features" json:"LotFeatures"`
	PoolFeatures             pq.StringArray `gorm:"type:text[];column:pool_features" json:"PoolFeatures"`
	SecurityFeatures         pq.StringArray `gorm:"type:text[];column:security_features" json:"SecurityFeatures"`
	WaterfrontFeatures       pq.StringArray `gorm:"type:text[];column:waterfront_features" json:"WaterfrontFeatures"`
	ListOfficeName           *string        `gorm:"column:list_office_name" json:"ListOfficeName"`
	ListOfficeKey            *string        `gorm:"column:list_office_key" json:"ListOfficeKey"`
	VirtualTourURLUnbranded  *string        `gorm:"column:virtual_tour_url_unbranded" json:"VirtualTourURLUnbranded"`
	VirtualTourURLUnbranded2 *string        `gorm:"column:virtual_tour_url_unbranded2" json:"VirtualTourURLUnbranded2"`
	VirtualTourURLBranded    *string        `gorm:"column:virtual_tour_url_branded" json:"VirtualTourURLBranded"`
	VirtualTourURLBranded2   *string        `gorm:"column:virtual_tour_url_branded2" json:"VirtualTourURLBranded2"`
	Latitude                 *float64       `gorm:"column:latitude" json:"Latitude"`
	Longitude                *float64       `gorm:"column:longitude" json:"Longitude"`

	Media []Media `gorm:"-" json:"Media,omitempty"`

	CreatedAt time.Time `gorm:"column:created_at" json:"-"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"-"`
}

type ResidentialProperty struct {
	Property
}

func (ResidentialProperty) TableName() string {
	return "residential_properties"
}

type CommercialProperty struct {
	Property
}

func (CommercialProperty) TableName() string {
	return "commercial_properties"
}

type Media struct {
	MediaKey                   string     `gorm:"primaryKey;column:media_key" json:"MediaKey"`
	ResourceRecordKey          string     `gorm:"column:resource_record_key;not null" json:"ResourceRecordKey"`
	MediaURL                   *string    `gorm:"column:media_url" json:"MediaURL"`
	MediaCategory              *string    `gorm:"column:media_category" json:"MediaCategory"`
	MediaType                  *string    `gorm:"column:media_type" json:"MediaType"`
	Order                      int        `gorm:"column:order" json:"Order"`
	MediaModificationTimestamp *time.Time `gorm:"column:media_modification_timestamp" json:"MediaModificationTimestamp"`
	PreferredPhotoYN           *bool      `gorm:"column:preferred_photo_yn" json:"PreferredPhotoYN"`
	ImageSizeDescription       *string    `gorm:"column:image_size_description" json:"ImageSizeDescription"`

	CreatedAt time.Time `gorm:"column:created_at" json:"-"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"-"`
}

type ResidentialMedia struct {
	Media
}

func (ResidentialMedia) TableName() string {
	return "residential_media"
}

type CommercialMedia struct {
	Media
}

func (CommercialMedia) TableName() string {
	return "commercial_media"
}

type ReplicationLog struct {
	Source           string    `gorm:"primaryKey;column:source" json:"source"`
	LastReplicatedAt time.Time `gorm:"column:last_replicated_at" json:"last_replicated_at"`
}

func (ReplicationLog) TableName() string {
	return "replication_logs"
}
