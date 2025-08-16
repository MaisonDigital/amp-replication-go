import { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { ContactInfo } from "./contact-info";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with Our Real Estate Experts",
  description: `Contact ${siteConfig.company.name} for all your Ottawa real estate needs. Our experienced team is ready to help you buy, sell, or rent your perfect property.`,
  keywords: ["contact real estate agent Ottawa", "Ottawa real estate contact", "property consultation"],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Our Team</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Ready to find your dream home or sell your property? Get in touch with Ottawa's
              trusted real estate professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}