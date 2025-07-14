import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyDetailClient } from "./property-detail-client";
import { api } from "@/lib/api";
import { generatePropertyTitle, generatePropertyDescription } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

interface PropertyDetailPageProps {
  params: {
    listingKey: string;
  };
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  try {
    const property = await api.getListingDetail(params.listingKey);
    const title = generatePropertyTitle(property);
    const description = generatePropertyDescription(property);
    
    return {
      title: `${title} | ${siteConfig.company.name}`,
      description,
      openGraph: {
        title: `${title} - ${property.transaction_type}`,
        description,
        images: property.media.length > 0 ? [
          {
            url: property.media[0].media_url || "",
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [],
      },
    };
  } catch (error) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  try {
    // Pre-fetch the property data for SEO
    const property = await api.getListingDetail(params.listingKey);
    
    return <PropertyDetailClient listingKey={params.listingKey} initialData={property} />;
  } catch (error) {
    notFound();
  }
}