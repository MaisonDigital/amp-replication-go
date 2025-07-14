"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Car, Square, Heart, Share2, Calculator, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { PropertyDetail, MediaItem } from "@/types/property";
import { usePropertyDetail, useSimilarProperties } from "@/hooks/useProperties";
import { formatPrice, generatePropertyTitle } from "@/lib/utils";
import { PropertyGrid } from "@/components/properties/property-grid";

interface PropertyDetailClientProps {
  listingKey: string;
  initialData: PropertyDetail;
}

export function PropertyDetailClient({ listingKey, initialData }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  const { data: property = initialData, isLoading } = usePropertyDetail(listingKey);
  const { data: similarData } = useSimilarProperties(listingKey, 4);

  if (isLoading && !initialData) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  const title = generatePropertyTitle(property);
  const images = property.media.filter((m: MediaItem) => m.media_url && m.image_size_description !== "Thumbnail");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <div className="relative">
        {images.length > 0 ? (
          <div className="relative h-96 lg:h-[500px] overflow-hidden">
            <Image
              src={images[currentImageIndex].media_url || ""}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              <button className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
            <Square className="h-24 w-24 text-gray-400" />
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.address.full_address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(property.list_price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.transaction_type}
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="flex flex-wrap gap-6 text-gray-600">
                  {property.bedrooms_total && (
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2" />
                      <span>{property.bedrooms_total} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms_total_integer && (
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2" />
                      <span>{property.bathrooms_total_integer} Bathrooms</span>
                    </div>
                  )}
                  {property.parking_spaces && (
                    <div className="flex items-center">
                      <Car className="h-5 w-5 mr-2" />
                      <span>{property.parking_spaces} Parking</span>
                    </div>
                  )}
                  {property.property_sub_type && (
                    <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {property.property_sub_type}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {property.public_remarks && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {property.public_remarks}
                  </p>
                </div>
              )}

              {/* Property Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {property.rooms_above_grade && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms Above Grade:</span>
                        <span className="font-medium">{property.rooms_above_grade}</span>
                      </div>
                    )}
                    {property.lot_depth && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lot Depth:</span>
                        <span className="font-medium">{property.lot_depth} ft</span>
                      </div>
                    )}
                    {property.heat_type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heat Type:</span>
                        <span className="font-medium">{property.heat_type}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {property.tax_annual_amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Taxes:</span>
                        <span className="font-medium">{formatPrice(property.tax_annual_amount)}</span>
                      </div>
                    )}
                    {property.lot_width && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lot Width:</span>
                        <span className="font-medium">{property.lot_width} ft</span>
                      </div>
                    )}
                    {property.has_fireplace && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fireplace:</span>
                        <span className="font-medium">Yes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Agent
                </h3>
                <div className="space-y-4">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Request Information
                  </button>
                  <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Schedule Viewing
                  </button>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                      <Calculator className="h-4 w-4" />
                      <span>Mortgage Calculator</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Office Info */}
              {property.list_office_name && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Listed By
                  </h3>
                  <p className="text-gray-700">{property.list_office_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarData?.similar_listings && similarData.similar_listings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Properties</h2>
            <PropertyGrid properties={similarData.similar_listings} />
          </div>
        )}
      </div>
    </div>
  );
}