"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

const navigation = [
  { name: "Buy", href: "/properties/for-sale" },
  { name: "Rent", href: "/properties/for-rent" },
  { name: "Sell", href: "/sell" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden items-center space-x-6 md:flex">
              <div className="flex items-center space-x-1 text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{siteConfig.company.phones[0]}</span>
                <Phone className="h-3 w-3" />
                <span>{siteConfig.company.phones[1]}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Mail className="h-3 w-3" />
                <span>{siteConfig.company.email}</span>
              </div>
            </div>
            <div className="hidden items-center space-x-1 text-gray-600 md:flex">
              <MapPin className="h-3 w-3" />
              <span>{siteConfig.company.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-700">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{siteConfig.company.name}</div>
                <div className="text-xs text-gray-500">{siteConfig.company.tagline}</div>
              </div>
            </Link>
          </div>

          <nav className="hidden space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-600",
                  pathname === item.href ? "text-primary-600" : "text-gray-700"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 bg-gray-50 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium",
                  pathname === item.href
                    ? "bg-blue-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block w-full rounded-md bg-primary-700 px-3 py-2 text-left text-base font-medium text-white hover:bg-primary-800"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
