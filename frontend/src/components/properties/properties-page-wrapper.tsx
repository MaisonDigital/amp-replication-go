"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { PropertyGrid } from "./property-grid";
import { SearchFilters } from "./search-filters";
import { useSearchProperties } from "@/hooks/useProperties";
import { SearchFilters as SearchFiltersType, SortOption } from "@/types/property";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PropertiesPageWrapperProps {
  defaultFilters: SearchFiltersType;
  title: string;
  description: string;
  breadcrumbs?: Breadcrumb[];
}

export function PropertiesPageWrapper({
  defaultFilters,
  title,
  description,
  breadcrumbs,
}: PropertiesPageWrapperProps) {
  const [filters, setFilters] = useState<SearchFiltersType>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSearchProperties(filters, sort, page, 20);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters({ ...defaultFilters, ...newFilters });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
                    <Home className="h-4 w-4" />
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-gray-900 font-medium">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="text-gray-500 hover:text-gray-700">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl">{description}</p>
            {data && (
              <p className="text-gray-500 mt-4">
                {data.pagination.total} properties found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="sticky top-24"
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {/* Sort Controls */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="updated">Recently Updated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Property Grid */}
            <PropertyGrid
              properties={data?.listings || []}
              loading={isLoading}
            />

            {/* Pagination */}
            {data && data.pagination.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.pagination.pages}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
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