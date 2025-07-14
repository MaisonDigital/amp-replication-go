import { Metadata } from "next";
import { PropertiesPageWrapper } from "@/components/properties/properties-page-wrapper";

export const metadata: Metadata = {
  title: "Homes for Sale in Ottawa | Real Estate Listings",
  description: "Browse houses, condos, and properties for sale in Ottawa. Find your dream home with detailed listings, photos, and neighborhood information.",
  keywords: ["Ottawa homes for sale", "Ottawa real estate", "houses for sale Ottawa", "Ottawa property listings"],
};

export default function ForSalePage() {
  return (
    <PropertiesPageWrapper
      defaultFilters={{ transaction_type: "For Sale" }}
      title="Properties for Sale in Ottawa"
      description="Discover your perfect home from our extensive collection of properties for sale across Ottawa and surrounding areas."
    />
  );
}