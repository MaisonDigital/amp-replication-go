export interface PropertyAddress {
  street_number?: string;
  street_name?: string;
  street_suffix?: string;
  apartment_number?: string;
  unit_number?: string;
  city_region?: string;
  county_or_parish?: string;
  state_or_province?: string;
  postal_code?: string;
  full_address: string;
}

export interface PropertyCoordinates {
  latitude?: number;
  longitude?: number;
}

export interface MediaItem {
  media_key: string;
  media_url?: string;
  media_category?: string;
  media_type?: string;
  order: number;
  preferred_photo_yn?: boolean;
  image_size_description?: string;
}

export interface PropertyBase {
  listing_key: string;
  list_price?: number;
  address: PropertyAddress;
  coordinates: PropertyCoordinates;
  bedrooms_total?: number;
  bathrooms_total_integer?: number;
  parking_spaces?: number;
  standard_status?: string;
  transaction_type?: string;
  property_type?: string;
  property_sub_type?: string;
  modification_timestamp?: string;
  original_entry_timestamp?: string;
}

export interface PropertySummary extends PropertyBase {
  thumbnail_url?: string;
}

export interface PropertyDetail extends PropertyBase {
  public_remarks?: string;
  rooms_above_grade?: number;
  rooms_below_grade?: number;
  lot_depth?: number;
  lot_width?: number;
  lot_size_units?: string;
  tax_annual_amount?: number;
  heat_type?: string;
  heat_source?: string;
  has_fireplace?: boolean;
  cross_street?: string;
  zoning_designation?: string;
  list_office_name?: string;
  list_office_key?: string;
  virtual_tour_url_unbranded?: string;
  virtual_tour_url_unbranded2?: string;
  virtual_tour_url_branded?: string;
  virtual_tour_url_branded2?: string;
  architectural_style?: string[];
  basement?: string[];
  roof?: string[];
  construction_materials?: string[];
  foundation_details?: string[];
  sewer?: string[];
  cooling?: string[];
  water_source?: string[];
  fireplace_features?: string[];
  community_features?: string[];
  lot_features?: string[];
  pool_features?: string[];
  security_features?: string[];
  waterfront_features?: string[];
  media: MediaItem[];
}

export interface SearchFilters {
  transaction_type?: "For Sale" | "For Lease" | "For Sub-Lease";
  property_type?: "Residential" | "Commercial";
  property_sub_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  city_region?: string;
  county_or_parish?: string;
  ne_lat?: number;
  ne_lng?: number;
  sw_lat?: number;
  sw_lng?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SearchResponse {
  listings: PropertySummary[];
  pagination: PaginationInfo;
  filters_applied: SearchFilters;
}

export interface MapResponse {
  listings: PropertySummary[];
  count: number;
}

export type SortOption = "price_asc" | "price_desc" | "newest" | "updated";
export type ViewMode = "grid" | "list" | "map";