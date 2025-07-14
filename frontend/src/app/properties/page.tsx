"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, List, Map, SlidersHorizontal } from "lucide-react";
import { PropertyGrid } from "@/components/properties/property-grid";
import { SearchFilters } from "@/components/properties/search-filters";
import { useSearchProperties } from "@/hooks/useProperties";
import { SearchFilters as SearchFiltersType, SortOption, ViewMode } from "@/types/property";

function PropertiesPageContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const urlFilters: SearchFiltersType = {};
    
    if (searchParams.get("transaction_type")) {
      urlFilters.transaction_type = searchParams.get("transaction_type") as any;
    }
    if (searchParams.get("property_type")) {
      urlFilters.property_type = searchParams.get("property_type") as any;
    }
    if (searchParams.get("property_sub_type")) {
      urlFilters.property_sub_type = searchParams.get("property_sub_type") as string;
    }
    if (searchParams.get("city_region")) {
      urlFilters.city_region = searchParams.get("city_region") as string;
    }
    if (searchParams.get("min_price")) {
      urlFilters.min_price = Number(searchParams.get("min_price"));
    }
    if (searchParams.get("max_price")) {
      urlFilters.max_price = Number(searchParams.get("max_price"));
    }
    if (searchParams.get("bedrooms")) {
      urlFilters.bedrooms = Number(searchParams.get("bedrooms"));
    }
    if (searchParams.get("bathrooms")) {
      urlFilters.bathrooms = Number(searchParams.get("bathrooms"));
    }

    setFilters(urlFilters);
  }, [searchParams]);

  const { data, isLoading, error } = useSearchProperties(filters, sort, page, 20);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Properties</h1>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.transaction_type === "For Sale" ? "Properties for Sale" : 
             filters.transaction_type === "For Lease" ? "Properties for Rent" : 
             "All Properties"}
            {filters.city_region && ` in ${filters.city_region}`}
          </h1>
          {data && (
            <p className="text-gray-600">
              {data.pagination.total} properties found
            </p>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
            
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                className="sticky top-24"
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="updated">Recently Updated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                {/* View toggles */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "map"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Map className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Property Grid */}
            {viewMode === "grid" && (
              <PropertyGrid
                properties={data?.listings || []}
                loading={isLoading}
              />
            )}

            {/* Pagination */}
            {data && data.pagination.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex space-x-2">
                  {/* Previous */}
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next */}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === data.pagination.pages}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      page === data.pagination.pages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}