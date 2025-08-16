import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { siteConfig } from "@/lib/config";
import { generatePropertyTitle, generatePropertyDescription } from "@/lib/utils";
import type { Metadata } from "next";
import { PropertyDetailClient } from "./property-detail-client";

type Params = {
  params: Promise<{ listingKey: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const listingKey = resolvedParams.listingKey;

    const property = await api.getListingDetail(listingKey);

    const title = generatePropertyTitle(property);
    const description = generatePropertyDescription(property);

    return {
      title: `${title} | ${siteConfig.company.name}`,
      description,
      openGraph: {
        title: `${title} - ${property.transaction_type}`,
        description,
        images:
          property.media.length > 0
            ? [
                {
                  url: property.media[0].media_url || "",
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ]
            : [],
      },
    };
  } catch (error) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }
}

export default async function Page({ params }: Params) {
  try {
    const resolvedParams = await params;
    const listingKey = resolvedParams.listingKey;

    const property = await api.getListingDetail(listingKey);

    if (!property) {
      notFound();
    }

    return <PropertyDetailClient listingKey={listingKey} initialData={property} />;
  } catch (error) {
    notFound();
  }
}
