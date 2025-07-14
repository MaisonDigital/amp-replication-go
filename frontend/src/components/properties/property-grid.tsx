"use client";

import { PropertySummary } from "@/types/property";
import { PropertyCard } from "./property-card";

interface PropertyGridProps {
  properties: PropertySummary[];
  loading?: boolean;
  className?: string;
}

export function PropertyGrid({ properties, loading, className }: PropertyGridProps) {
  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No properties found</div>
        <div className="text-gray-400 text-sm mt-1">Try adjusting your search filters</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.listing_key} property={property} />
        ))}
      </div>
    </div>
  );
}