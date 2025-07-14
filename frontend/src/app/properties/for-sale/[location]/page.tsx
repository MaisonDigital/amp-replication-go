import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertiesPageWrapper } from "../../../../components/properties/properties-page-wrapper";
import { siteConfig } from "@/lib/config";
import { slugify } from "@/lib/utils";

interface LocationPageProps {
  params: {
    location: string;
  };
}

export async function generateStaticParams() {
  return siteConfig.primaryLocations.map((location) => ({
    location: slugify(location),
  }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const location = siteConfig.primaryLocations.find(
    (loc) => slugify(loc) === params.location
  );

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  return {
    title: `Homes for Sale in ${location}, Ottawa | ${siteConfig.company.name}`,
    description: `Find your dream home in ${location}, Ottawa. Browse houses, condos, and properties for sale with detailed listings, photos, and neighborhood insights.`,
    keywords: [
      `${location} homes for sale`,
      `${location} real estate`,
      `houses for sale ${location}`,
      `${location} Ottawa properties`,
      `${location} property listings`,
    ],
    openGraph: {
      title: `Homes for Sale in ${location}, Ottawa`,
      description: `Discover beautiful properties for sale in ${location}, one of Ottawa's most desirable neighborhoods.`,
    },
  };
}

export default function LocationForSalePage({ params }: LocationPageProps) {
  const location = siteConfig.primaryLocations.find(
    (loc) => slugify(loc) === params.location
  );

  if (!location) {
    notFound();
  }

  return (
    <PropertiesPageWrapper
      defaultFilters={{
        transaction_type: "For Sale",
        city_region: location,
      }}
      title={`Homes for Sale in ${location}`}
      description={`Explore available properties for sale in ${location}, Ottawa. From starter homes to luxury estates, find the perfect property in this desirable neighborhood.`}
      breadcrumbs={[
        { label: "Properties", href: "/properties" },
        { label: "For Sale", href: "/properties/for-sale" },
        { label: location, href: `/properties/for-sale/${params.location}` },
      ]}
    />
  );
}