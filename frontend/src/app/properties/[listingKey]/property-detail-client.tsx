"use client";

import { MapPin, Bed, Bath, Car, Square, Share2, Calculator, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { PropertyDetail, MediaItem } from "@/types/property";
import { usePropertyDetail, useSimilarProperties } from "@/hooks/useProperties";
import { formatPrice, generatePropertyTitle } from "@/lib/utils";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertyImageGallery } from "./property-image-gallery";

interface PropertyDetailClientProps {
  listingKey: string;
  initialData: PropertyDetail;
}

export function PropertyDetailClient({ listingKey, initialData }: PropertyDetailClientProps) {
  const { data: property = initialData, isLoading } = usePropertyDetail(listingKey);
  const { data: similarData } = useSimilarProperties(listingKey, 4);

  if (isLoading && !initialData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Property not found</div>
      </div>
    );
  }

  const title = generatePropertyTitle(property);
  const formattedPrice = formatPrice(property.list_price);
  const address = property.address.full_address;
  const images = property.media.filter(
    (m: MediaItem) => m.media_url && m.image_size_description !== "Thumbnail"
  );

  return (
    <div className="min-h-screen bg-white">
      <PropertyImageGallery
        images={images}
        title={title}
        price={formattedPrice}
        address={address}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
                    <div className="mb-4 flex items-center text-gray-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{property.address.full_address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {formatPrice(property.list_price)}
                    </div>
                    <div className="text-sm text-gray-500">{property.transaction_type}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-gray-600">
                  {property.bedrooms_total && (
                    <div className="flex items-center">
                      <Bed className="mr-2 h-5 w-5" />
                      <span>{property.bedrooms_total} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms_total_integer && (
                    <div className="flex items-center">
                      <Bath className="mr-2 h-5 w-5" />
                      <span>{property.bathrooms_total_integer} Bathrooms</span>
                    </div>
                  )}
                  {property.parking_spaces && (
                    <div className="flex items-center">
                      <Car className="mr-2 h-5 w-5" />
                      <span>{property.parking_spaces} Parking</span>
                    </div>
                  )}
                  {property.property_sub_type && (
                    <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                      {property.property_sub_type}
                    </div>
                  )}
                </div>
              </div>

              {property.public_remarks && (
                <div>
                  <h2 className="mb-3 text-xl font-semibold text-gray-900">Description</h2>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">
                    {property.public_remarks}
                  </p>
                </div>
              )}

              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Property Details</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    {property.rooms_above_grade && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms Above Grade:</span>
                        <span className="font-medium">{property.rooms_above_grade}</span>
                      </div>
                    )}
                    {property.rooms_below_grade && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms Below Grade:</span>
                        <span className="font-medium">{property.rooms_below_grade}</span>
                      </div>
                    )}
                    {property.lot_size_units && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lot Size:</span>
                        <span className="font-medium">
                          {property.lot_depth && property.lot_width
                            ? `${property.lot_depth} x ${property.lot_width} ${property.lot_size_units}`
                            : `${property.lot_size_units}`}
                        </span>
                      </div>
                    )}
                    {property.tax_annual_amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Tax:</span>
                        <span className="font-medium">
                          ${property.tax_annual_amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {property.heat_type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heat Type:</span>
                        <span className="font-medium">{property.heat_type}</span>
                      </div>
                    )}
                    {property.heat_source && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heat Source:</span>
                        <span className="font-medium">{property.heat_source}</span>
                      </div>
                    )}
                    {property.has_fireplace !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fireplace:</span>
                        <span className="font-medium">{property.has_fireplace ? "Yes" : "No"}</span>
                      </div>
                    )}
                    {property.zoning_designation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Zoning:</span>
                        <span className="font-medium">{property.zoning_designation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                {property.architectural_style && property.architectural_style.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Architectural Style</h3>
                    <ul className="list-inside list-disc space-y-1 text-gray-700">
                      {property.architectural_style.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {property.basement && property.basement.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Basement</h3>
                    <ul className="list-inside list-disc space-y-1 text-gray-700">
                      {property.basement.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {property.cooling && property.cooling.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Cooling</h3>
                    <ul className="list-inside list-disc space-y-1 text-gray-700">
                      {property.cooling.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {property.lot_features && property.lot_features.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Lot Features</h3>
                    <ul className="list-inside list-disc space-y-1 text-gray-700">
                      {property.lot_features.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="sticky top-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
              >
                <h3 className="mb-4 text-xl font-semibold">Contact Agent</h3>

                <div className="space-y-4">
                  <button className="flex w-full items-center justify-center rounded-lg bg-primary-600 py-3 font-medium text-white transition-colors hover:bg-primary-700">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Viewing
                  </button>

                  <button className="flex w-full items-center justify-center rounded-lg border border-primary-600 bg-white py-3 font-medium text-primary-600 transition-colors hover:bg-primary-50">
                    <Share2 className="mr-2 h-5 w-5" />
                    Share Listing
                  </button>

                  <button className="flex w-full items-center justify-center rounded-lg border border-primary-600 bg-white py-3 font-medium text-primary-600 transition-colors hover:bg-primary-50">
                    <Calculator className="mr-2 h-5 w-5" />
                    Mortgage Calculator
                  </button>
                </div>
              </motion.div>

              {property.list_office_name && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
                >
                  <h3 className="mb-3 text-lg font-semibold">Listed By</h3>
                  <div className="text-gray-700">{property.list_office_name}</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {similarData?.similar_listings && similarData.similar_listings.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-2xl font-bold text-gray-900"
            >
              Similar Properties
            </motion.h2>

            <PropertyGrid properties={similarData.similar_listings} />
          </div>
        </section>
      )}
    </div>
  );
}
