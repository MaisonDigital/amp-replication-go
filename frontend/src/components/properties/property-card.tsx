"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Car, Square } from "lucide-react";
import { motion } from "framer-motion";
import { PropertySummary } from "@/types/property";
import { formatPrice, generatePropertyTitle, cn } from "@/lib/utils";

interface PropertyCardProps {
  property: PropertySummary;
  className?: string;
  showFavorite?: boolean;
}

export function PropertyCard({ property, className, showFavorite = true }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = generatePropertyTitle(property);
  const href = `/properties/${property.listing_key}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={href}>
          {property.thumbnail_url ? (
            <>
              <Image
                src={property.thumbnail_url}
                alt={title}
                fill
                className={cn(
                  "object-cover transition-all duration-300 group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Square className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </Link>

        {/* Favorite button */}
        {showFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </button>
        )}

        {/* Status badge */}
        {property.transaction_type && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary-700 text-white text-xs font-medium rounded">
            {property.transaction_type === "For Sale" ? "For Sale" : "For Rent"}
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(property.list_price)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={href} className="block">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {property.address.city_region || "Ottawa"}
            </span>
          </div>

          {/* Property details */}
          <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
            {property.bedrooms_total && (
              <div className="flex items-center">
                <Bed className="h-3 w-3 mr-1" />
                <span>{property.bedrooms_total}</span>
              </div>
            )}
            {property.bathrooms_total_integer && (
              <div className="flex items-center">
                <Bath className="h-3 w-3 mr-1" />
                <span>{property.bathrooms_total_integer}</span>
              </div>
            )}
            {property.parking_spaces && (
              <div className="flex items-center">
                <Car className="h-3 w-3 mr-1" />
                <span>{property.parking_spaces}</span>
              </div>
            )}
          </div>

          {/* Property type */}
          {property.property_sub_type && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {property.property_sub_type}
              </span>
            </div>
          )}
        </Link>
      </div>
    </motion.div>
  );
}