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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-4xl font-bold lg:text-6xl"
          >
            Find Your Dream Home in <span className="text-yellow-400">Ottawa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-12 max-w-3xl text-xl text-primary-100 lg:text-2xl"
          >
            {siteConfig.company.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex justify-center">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setSearchType("buy")}
                    className={`flex items-center space-x-2 rounded-md px-6 py-3 font-medium transition-all ${
                      searchType === "buy"
                        ? "bg-primary-700 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Buy</span>
                  </button>
                  <button
                    onClick={() => setSearchType("rent")}
                    className={`flex items-center space-x-2 rounded-md px-6 py-3 font-medium transition-all ${
                      searchType === "rent"
                        ? "bg-primary-700 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Rent</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-4 lg:flex lg:space-x-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-4 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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

                <div className="flex-1">
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-4 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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

                <div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary-700 px-8 py-4 font-medium text-white transition-colors hover:bg-primary-800 lg:w-auto"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Properties</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-primary-100">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-yellow-400">15+</div>
              <div className="text-primary-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-yellow-400">1000+</div>
              <div className="text-primary-100">Happy Clients</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
