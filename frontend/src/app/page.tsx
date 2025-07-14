import { Metadata } from "next";
import { HeroSearch } from "@/components/home/hero-search";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { LocationSections } from "@/components/home/location-sections";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle || "Ottawa Real Estate | Find Your Dream Home",
  description: siteConfig.seo.defaultDescription || "Discover your perfect home in Ottawa with our expert real estate team. Browse houses, condos, and rentals across the National Capital Region.",
};

export default function HomePage() {
  return (
    <>
    <div className="bg-red-500 text-white p-8 text-center text-2xl">
  🔥 IF YOU SEE RED, TAILWIND IS WORKING! 🔥
</div>
      <HeroSearch />
      <FeaturedProperties />
      <LocationSections />
    </>
  );
}