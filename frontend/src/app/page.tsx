import { Metadata } from "next";
import { HeroSearch } from "@/components/home/hero-search";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { LocationSections } from "@/components/home/location-sections";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    countryName: "Canada",
    description: siteConfig.seo.defaultDescription,
    emails: [siteConfig.company.email],
    images: [siteConfig.seo.image],
    locale: "en-CA",
    phoneNumbers: [siteConfig.company.phones[0], siteConfig.company.phones[1]],
    siteName: siteConfig.company.name,
    type: "website",
    title: siteConfig.seo.defaultTitle,
    url: siteConfig.seo.siteUrl,
  },
  title: siteConfig.seo.defaultTitle || "Ottawa Real Estate | Find Your Dream Home",
  description:
    siteConfig.seo.defaultDescription ||
    "Discover your perfect home in Ottawa with our expert real estate team. Browse houses, condos, and rentals across the National Capital Region.",
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
