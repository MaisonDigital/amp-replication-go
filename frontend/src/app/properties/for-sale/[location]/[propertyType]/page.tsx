import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertiesPageWrapper } from "@/components/properties/properties-page-wrapper";
import { siteConfig } from "@/lib/config";
import { slugify } from "@/lib/utils";

interface PropertyTypeLocationPageProps {
  params: {
    location: string;
    propertyType: string;
  };
}

export async function generateStaticParams() {
  const params = [];
  
  for (const location of siteConfig.primaryLocations) {
    for (const propertyType of siteConfig.propertyTypes) {
      params.push({
        location: slugify(location),
        propertyType: propertyType.slug,
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PropertyTypeLocationPageProps): Promise<Metadata> {
  const location = siteConfig.primaryLocations.find(
    (loc) => slugify(loc) === params.location
  );
  
  const propertyType = siteConfig.propertyTypes.find(
    (type) => type.slug === params.propertyType
  );

  if (!location || !propertyType) {
    return {
      title: "Properties Not Found",
    };
  }

  return {
    title: `${propertyType.label} for Sale in ${location}, Ottawa | ${siteConfig.company.name}`,
    description: `Browse ${propertyType.label.toLowerCase()} for sale in ${location}, Ottawa. Find your perfect ${propertyType.label.toLowerCase().slice(0, -1)} with detailed listings and neighborhood information.`,
    keywords: [
      `${propertyType.label} for sale ${location}`,
      `${location} ${propertyType.label.toLowerCase()}`,
      `${propertyType.value} ${location} Ottawa`,
      `buy ${propertyType.label.toLowerCase()} ${location}`,
    ],
    openGraph: {
      title: `${propertyType.label} for Sale in ${location}, Ottawa`,
      description: `Discover beautiful ${propertyType.label.toLowerCase()} for sale in ${location}, Ottawa.`,
    },
  };
}

export default function PropertyTypeLocationPage({ params }: PropertyTypeLocationPageProps) {
  const location = siteConfig.primaryLocations.find(
    (loc) => slugify(loc) === params.location
  );
  
  const propertyType = siteConfig.propertyTypes.find(
    (type) => type.slug === params.propertyType
  );

  if (!location || !propertyType) {
    notFound();
  }

  return (
    <PropertiesPageWrapper
      defaultFilters={{
        transaction_type: "For Sale",
        city_region: location,
        property_sub_type: propertyType.value,
      }}
      title={`${propertyType.label} for Sale in ${location}`}
      description={`Find the perfect ${propertyType.label.toLowerCase().slice(0, -1)} in ${location}, Ottawa. Browse our curated selection of ${propertyType.label.toLowerCase()} with detailed information and high-quality photos.`}
      breadcrumbs={[
        { label: "Properties", href: "/properties" },
        { label: "For Sale", href: "/properties/for-sale" },
        { label: location, href: `/properties/for-sale/${params.location}` },
        { label: propertyType.label, href: `/properties/for-sale/${params.location}/${params.propertyType}` },
      ]}
    />
  );
}