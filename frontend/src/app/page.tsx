import { Metadata } from "next";
import { HeroSearch } from "@/components/home/hero-search";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { LocationSections } from "@/components/home/location-sections";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Ottawa Real Estate | Find Your Dream Home",
  description: "Discover your perfect home in Ottawa with our expert real estate team. Browse houses, condos, and rentals across the National Capital Region.",
};

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <FeaturedProperties />
      <LocationSections />
    </>
  );
}