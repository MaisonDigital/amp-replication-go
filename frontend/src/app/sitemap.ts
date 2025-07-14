import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { slugify } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.seo.siteUrl;
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/for-sale`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/for-rent`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  const locationPages = siteConfig.primaryLocations.flatMap((location) => [
    {
      url: `${baseUrl}/properties/for-sale/${slugify(location)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties/for-rent/${slugify(location)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]);

  const propertyTypeLocationPages = siteConfig.primaryLocations.flatMap((location) =>
    siteConfig.propertyTypes.flatMap((propertyType) => [
      {
        url: `${baseUrl}/properties/for-sale/${slugify(location)}/${propertyType.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/properties/for-rent/${slugify(location)}/${propertyType.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
    ])
  );

  return [...staticPages, ...locationPages, ...propertyTypeLocationPages];
}