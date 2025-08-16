import { Metadata } from "next";
import { Users, Award, MapPin, TrendingUp } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Us | Ottawa's Trusted Real Estate Experts",
  description: `Learn about ${siteConfig.company.name} - Ottawa's premier real estate team. With years of experience and local expertise, we help clients buy, sell, and rent properties.`,
  keywords: ["Ottawa real estate team", "real estate experience", "local property experts", "Ottawa realtors"],
};

export default function AboutPage() {
  const stats = [
    { icon: TrendingUp, label: "Properties Sold", value: "1,000+" },
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: MapPin, label: "Neighborhoods", value: "25+" },
    { icon: Award, label: "Years Experience", value: "15+" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About {siteConfig.company.name}
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              {siteConfig.company.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Our Story */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                Founded over 15 years ago, {siteConfig.company.name} has grown from a small local team 
                to one of Ottawa's most trusted real estate brokerages. Our success stems from our 
                unwavering commitment to our clients and deep understanding of the local market.
              </p>
              <p>
                We believe that buying or selling a home is one of life's most important decisions. 
                That's why we've built our business on the foundation of trust, expertise, and 
                personalized service that puts our clients' needs first.
              </p>
              <p>
                Our team of experienced professionals brings together decades of combined experience 
                in residential and commercial real estate, ensuring that we can help clients with 
                any property need throughout the National Capital Region.
              </p>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide exceptional real estate services that exceed our clients' expectations 
                while building lasting relationships based on trust, integrity, and results.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Integrity:</strong> We conduct business with honesty and transparency</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Excellence:</strong> We strive for the highest standards in everything we do</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Innovation:</strong> We embrace technology to better serve our clients</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Community:</strong> We're committed to giving back to Ottawa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Buyer Representation</h3>
              <p className="text-gray-600">
                From first-time buyers to seasoned investors, we guide you through every step 
                of the home buying process.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Seller Representation</h3>
              <p className="text-gray-600">
                Maximize your property's value with our proven marketing strategies and 
                negotiation expertise.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Property Management</h3>
              <p className="text-gray-600">
                Comprehensive rental property management services for landlords and 
                investors throughout Ottawa.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary-700 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work with Ottawa's Best?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, or investing in Ottawa real estate, 
            our team is here to help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a
              href="/properties"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}