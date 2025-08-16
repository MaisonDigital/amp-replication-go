// src/components/properties/property-card.tsx
"use client";

import { useState, useEffect } from "react";
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
  const [imageError, setImageError] = useState(false);
  const [mediumImageUrl, setMediumImageUrl] = useState<string | null>(null);

  const title = generatePropertyTitle(property);
  const href = `/properties/${property.listing_key}`;

  // Fetch medium image for the property card
  useEffect(() => {
    let isMounted = true;
    
    async function fetchMediumImage() {
      if (!property.listing_key) return;
      
      try {
        // Use the existing API endpoint to get Medium size images
        const response = await fetch(`/api/listings/${property.listing_key}/media?size=Medium`);
        
        if (response.ok && isMounted) {
          const data = await response.json();
          
          // Find the preferred photo with Medium size
          const preferredMediumPhoto = data.media.find(
            (item: any) => 
              item.preferred_photo_yn === true && 
              item.image_size_description === "Medium" && 
              item.media_url
          );
          
          // If no preferred photo, take the first medium image
          const firstMediumPhoto = data.media.find(
            (item: any) => 
              item.image_size_description === "Medium" && 
              item.media_url
          );
          
          // Use preferred photo if available, otherwise first medium photo
          if (preferredMediumPhoto) {
            setMediumImageUrl(preferredMediumPhoto.media_url);
          } else if (firstMediumPhoto) {
            setMediumImageUrl(firstMediumPhoto.media_url);
          }
        }
      } catch (error) {
        console.error("Error fetching medium image:", error);
      }
    }
    
    fetchMediumImage();
    
    return () => {
      isMounted = false;
    };
  }, [property.listing_key]);

  // Use medium image if available, otherwise fall back to thumbnail
  const imageUrl = mediumImageUrl || property.thumbnail_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <Link href={href}>
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className={cn(
                  "object-cover transition-all duration-300 group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={90}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
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