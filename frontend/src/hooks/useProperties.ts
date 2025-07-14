import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SearchFilters, SortOption } from "@/types/property";

export function useSearchProperties(
  filters: SearchFilters = {},
  sort: SortOption = "newest",
  page = 1,
  limit = 20
) {
  return useQuery({
    queryKey: ["properties", "search", filters, sort, page, limit],
    queryFn: () => api.searchListings(filters, page, limit, sort),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useInfiniteProperties(
  filters: SearchFilters = {},
  sort: SortOption = "newest",
  limit = 20
) {
  return useInfiniteQuery({
    queryKey: ["properties", "infinite", filters, sort, limit],
    queryFn: ({ pageParam = 1 }) =>
      api.searchListings(filters, pageParam, limit, sort),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.pages
        ? pagination.page + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMapProperties(
  bounds: {
    ne_lat: number;
    ne_lng: number;
    sw_lat: number;
    sw_lng: number;
  },
  filters: SearchFilters = {},
  limit = 500
) {
  return useQuery({
    queryKey: ["properties", "map", bounds, filters, limit],
    queryFn: () => api.searchForMap(bounds, filters, limit),
    enabled: !!(bounds.ne_lat && bounds.ne_lng && bounds.sw_lat && bounds.sw_lng),
    staleTime: 2 * 60 * 1000, // 2 minutes for map data
  });
}

export function usePropertyDetail(listingKey: string) {
  return useQuery({
    queryKey: ["property", "detail", listingKey],
    queryFn: () => api.getListingDetail(listingKey),
    enabled: !!listingKey,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSimilarProperties(listingKey: string, limit = 5) {
  return useQuery({
    queryKey: ["property", "similar", listingKey, limit],
    queryFn: () => api.getSimilarListings(listingKey, limit),
    enabled: !!listingKey,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useFeaturedProperties(
  officeKey: string,
  propertyType?: "Residential" | "Commercial",
  limit = 12,
  transactionType?: string
) {
  return useQuery({
    queryKey: ["properties", "featured", officeKey, propertyType, limit, transactionType],
    queryFn: () => api.getFeaturedListings(officeKey, propertyType, limit, transactionType),
    enabled: !!officeKey,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCitySuggestions(
  query: string,
  propertyType?: "Residential" | "Commercial"
) {
  return useQuery({
    queryKey: ["suggestions", "cities", query, propertyType],
    queryFn: () => api.getCitySuggestions(query, propertyType),
    enabled: query.length >= 2,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function usePropertyTypes(propertyType?: "Residential" | "Commercial") {
  return useQuery({
    queryKey: ["suggestions", "property-types", propertyType],
    queryFn: () => api.getPropertyTypes(propertyType),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}