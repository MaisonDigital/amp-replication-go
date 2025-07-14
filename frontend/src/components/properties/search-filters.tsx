"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Filter, X } from "lucide-react";
import { SearchFilters as SearchFiltersType } from "@/types/property";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

const filterSchema = z.object({
  transaction_type: z.enum(["For Sale", "For Lease", "For Sub-Lease"]).optional(),
  property_type: z.enum(["Residential", "Commercial"]).optional(),
  property_sub_type: z.string().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  bedrooms: z.number().min(0).max(10).optional(),
  bathrooms: z.number().min(0).max(10).optional(),
  city_region: z.string().optional(),
});

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  className?: string;
}

export function SearchFilters({ filters, onFiltersChange, className }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const { register, watch, setValue, reset } = useForm<SearchFiltersType>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  const watchedValues = watch();

  // Count active filters
  useEffect(() => {
    const count = Object.values(watchedValues).filter(
      (value) => value !== undefined && value !== "" && value !== null
    ).length;
    setActiveFilters(count);
  }, [watchedValues]);

  // Trigger onChange when form values change
  useEffect(() => {
    onFiltersChange(watchedValues);
  }, [watchedValues, onFiltersChange]);

  const clearFilters = () => {
    reset();
    setIsOpen(false);
  };

  const priceRanges = [
    { label: "Any Price", min: undefined, max: undefined },
    { label: "Under $300K", min: undefined, max: 300000 },
    { label: "$300K - $500K", min: 300000, max: 500000 },
    { label: "$500K - $750K", min: 500000, max: 750000 },
    { label: "$750K - $1M", min: 750000, max: 1000000 },
    { label: "$1M - $1.5M", min: 1000000, max: 1500000 },
    { label: "Above $1.5M", min: 1500000, max: undefined },
  ];

  return (
    <div className={className}>
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilters > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFilters}
              </span>
            )}
          </div>
          {isOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </button>
      </div>

      {/* Filter panel */}
      <div className={`${isOpen ? "block" : "hidden"} lg:block`}>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <select
              {...register("transaction_type")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value="For Sale">For Sale</option>
              <option value="For Lease">For Rent</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              {...register("property_type")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value="Residential">Residential</option>
              {siteConfig.features.showCommercial && (
                <option value="Commercial">Commercial</option>
              )}
            </select>
          </div>

          {/* Property Sub Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Sub Type
            </label>
            <select
              {...register("property_sub_type")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              {siteConfig.propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="price_range"
                    className="mr-2"
                    onChange={() => {
                      setValue("min_price", range.min);
                      setValue("max_price", range.max);
                    }}
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <select
              {...register("bedrooms", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
              <option value={5}>5+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <select
              {...register("bathrooms", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              {...register("city_region")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Location</option>
              {siteConfig.primaryLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="w-full py-2 text-center text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}