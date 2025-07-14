import { Metadata } from "next";
import { PropertiesPageWrapper } from "@/components/properties/properties-page-wrapper";

export const metadata: Metadata = {
  title: "Rental Properties in Ottawa | Apartments & Houses for Rent",
  description: "Find apartments, condos, and houses for rent in Ottawa. Browse rental listings with photos, amenities, and neighborhood details.",
  keywords: ["Ottawa rentals", "apartments for rent Ottawa", "houses for rent Ottawa", "Ottawa rental properties"],
};

export default function ForRentPage() {
  return (
    <PropertiesPageWrapper
      defaultFilters={{ transaction_type: "For Lease" }}
      title="Rental Properties in Ottawa"
      description="Discover your next home from our selection of rental properties across Ottawa and surrounding communities."
    />
  );
}