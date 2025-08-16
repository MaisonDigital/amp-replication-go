// src/components/layout/footer.tsx
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded bg-primary-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">M</span>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {siteConfig.company.name}
                  </div>
                  <div className="text-sm text-gray-300">
                    {siteConfig.company.tagline}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {siteConfig.company.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{siteConfig.company.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{siteConfig.company.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{siteConfig.company.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/properties/for-sale" className="text-gray-300 hover:text-white transition-colors">
                    Buy a Home
                  </Link>
                </li>
                <li>
                  <Link href="/properties/for-rent" className="text-gray-300 hover:text-white transition-colors">
                    Rent a Home
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="text-gray-300 hover:text-white transition-colors">
                    Sell Your Home
                  </Link>
                </li>
                <li>
                  <Link href="/market-stats" className="text-gray-300 hover:text-white transition-colors">
                    Market Stats
                  </Link>
                </li>
                <li>
                  <Link href="/mortgage-calculator" className="text-gray-300 hover:text-white transition-colors">
                    Mortgage Calculator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Searches */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
              <ul className="space-y-2">
                {siteConfig.primaryLocations.slice(0, 5).map((location) => (
                  <li key={location}>
                    <Link 
                      href={`/properties/for-sale/${location.toLowerCase()}`} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Homes for Sale in {location}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} {siteConfig.company.name}. All rights reserved. {siteConfig.company.licenseNumber}
            </div>
            
            {/* Social links */}
            <div className="flex space-x-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
