"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export function HeroSearch() {
  const [searchType, setSearchType] = useState<"buy" | "rent">("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    params.set("transaction_type", searchType === "buy" ? "For Sale" : "For Lease");
    
    if (location) {
      params.set("city_region", location);
    }
    
    if (propertyType) {
      params.set("property_sub_type", propertyType);
    }

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            Find Your Dream Home in{" "}
            <span className="text-yellow-400">Ottawa</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto"
          >
            {siteConfig.company.description}
          </motion.p>

          {/* Search form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              {/* Search type tabs */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSearchType("buy")}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                      searchType === "buy"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Buy</span>
                  </button>
                  <button
                    onClick={() => setSearchType("rent")}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                      searchType === "rent"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Rent</span>
                  </button>
                </div>
              </div>

              {/* Search form */}
              <form onSubmit={handleSearch} className="space-y-4 lg:space-y-0 lg:flex lg:space-x-4">
                {/* Location */}
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All of Ottawa</option>
                      {siteConfig.primaryLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property Type */}
                <div className="flex-1">
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Property Types</option>
                      {siteConfig.propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search button */}
                <div>
                  <button
                    type="submit"
                    className="w-full lg:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Properties</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-blue-100">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">15+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">1000+</div>
              <div className="text-blue-100">Happy Clients</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}