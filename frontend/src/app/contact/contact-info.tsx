import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Contact Details */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Phone</h3>
            <p className="text-gray-600">{siteConfig.company.phone}</p>
            <p className="text-sm text-gray-500">Available 7 days a week</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Email</h3>
            <p className="text-gray-600">{siteConfig.company.email}</p>
            <p className="text-sm text-gray-500">We respond within 24 hours</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Office</h3>
            <p className="text-gray-600">{siteConfig.company.address}</p>
            <p className="text-sm text-gray-500">By appointment</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Hours</h3>
            <div className="text-gray-600 text-sm space-y-1">
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 5:00 PM</p>
              <p>Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Facebook className="h-5 w-5 text-gray-600 hover:text-blue-600" />
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors"
          >
            <Instagram className="h-5 w-5 text-gray-600 hover:text-pink-600" />
          </a>
          <a
            href={siteConfig.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-600" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-600" />
          </a>
        </div>
      </div>

      {/* Quick Response */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need Immediate Assistance?</h3>
        <p className="text-blue-700 text-sm mb-4">
          For urgent matters or to schedule a same-day viewing, call us directly.
        </p>
        <a
          href={`tel:${siteConfig.company.phone.replace(/\D/g, '')}`}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Now
        </a>
      </div>
    </div>
  );
}