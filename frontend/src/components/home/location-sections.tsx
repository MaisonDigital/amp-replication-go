"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Home } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function LocationSections() {
  const locations = siteConfig.primaryLocations.slice(0, 6);

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Ottawa Neighborhoods
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore properties in Ottawa's most sought-after communities and find
            the perfect neighborhood for your lifestyle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/properties/for-sale/${location.toLowerCase()}`}
                className="group block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {location}
                    </h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    <span>Available Properties</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Market Trends</span>
                  </div>
                </div>
                
                <div className="mt-4 text-primary-600 text-sm font-medium group-hover:text-primary-700">
                  View Properties →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}