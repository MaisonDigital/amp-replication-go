"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  Camera, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  Star,
  Phone,
  Mail,
  Calendar,
  X
} from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function SellPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const whyChooseUs = [
    {
      icon: DollarSign,
      title: "Maximum Sale Price",
      description: "Our proven marketing strategies and expert pricing help you get the best possible price for your property."
    },
    {
      icon: TrendingUp,
      title: "Market Expertise",
      description: "Deep knowledge of Ottawa's neighborhoods and market trends ensures optimal timing and positioning."
    },
    {
      icon: Camera,
      title: "Professional Marketing",
      description: "High-quality photography, virtual tours, and targeted online marketing to showcase your property."
    },
    {
      icon: Clock,
      title: "Fast Sale Process",
      description: "Average time on market is 30% faster than industry average with our comprehensive approach."
    }
  ];

  const sellingProcess = [
    {
      step: 1,
      title: "Property Evaluation",
      description: "Comprehensive market analysis to determine optimal listing price"
    },
    {
      step: 2,
      title: "Preparation & Staging",
      description: "Professional advice on staging and improvements to maximize appeal"
    },
    {
      step: 3,
      title: "Marketing Launch",
      description: "Multi-platform marketing campaign with professional photography"
    },
    {
      step: 4,
      title: "Showings & Offers",
      description: "Manage viewings and negotiate offers to get you the best price"
    },
    {
      step: 5,
      title: "Closing",
      description: "Handle all paperwork and guide you through to successful closing"
    }
  ];

  const stats = [
    { number: "150+", label: "Properties Sold This Year" },
    { number: "98%", label: "Of Asking Price Achieved" },
    { number: "28", label: "Average Days on Market" },
    { number: "4.9/5", label: "Client Satisfaction Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah & Michael Chen",
      location: "Kanata",
      text: "Our house sold in just 12 days for $15,000 over asking! The marketing was incredible and the team handled everything professionally.",
      rating: 5
    },
    {
      name: "David Thompson",
      location: "Orleans",
      text: "Best real estate experience ever. They helped us stage the house and got us multiple offers within a week.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      location: "Barrhaven",
      text: "Exceeded all expectations. Sold for more than we thought possible and the entire process was stress-free.",
      rating: 5
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  Sell Your Home for
                  <span className="text-accent-500"> Maximum Value</span>
                </h1>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl">
                  Join hundreds of satisfied clients who chose {siteConfig.company.name} 
                  to sell their properties. Our proven process gets results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={openModal}
                    className="bg-accent-500 text-primary-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-400 transition-colors shadow-lg"
                  >
                    Get Free Home Evaluation
                  </button>
                  <a
                    href={`tel:${siteConfig.company.phones[0].replace(/\D/g, '')}`}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-primary-900 transition-colors"
                  >
                    Call {siteConfig.company.phones[0]}
                  </a>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Quick Market Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-primary-900">{stat.number}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose {siteConfig.company.name}?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine cutting-edge marketing with personalized service to deliver 
                exceptional results for every client.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Selling Process */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Proven Selling Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From evaluation to closing, we guide you through every step to ensure 
                a smooth and successful sale.
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-primary-200" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {sellingProcess.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center relative"
                  >
                    <div className="w-16 h-16 bg-primary-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 font-bold text-xl">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Comprehensive Marketing Services
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  We use every tool available to ensure your property gets maximum exposure 
                  and attracts the right buyers.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Professional photography and virtual tours",
                    "MLS listing optimization",
                    "Social media marketing campaigns", 
                    "Targeted online advertising",
                    "Print marketing and signage",
                    "Open house coordination",
                    "Broker networking and referrals"
                  ].map((service, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary-700 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-primary-900 text-white rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
                <p className="text-primary-100 mb-8">
                  Get your free, no-obligation home evaluation today and discover 
                  what your property is worth in today's market.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={openModal}
                    className="w-full bg-accent-500 text-primary-900 py-3 rounded-lg font-bold hover:bg-accent-400 transition-colors"
                  >
                    Get Free Home Evaluation
                  </button>
                  
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {siteConfig.company.phones[0]}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {siteConfig.company.email}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600">
                Don't just take our word for it – hear from satisfied sellers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary-900 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                Ready to Sell Your Home?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Join the hundreds of satisfied clients who have trusted us with their 
                most important investment. Let's get started today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={openModal}
                  className="bg-accent-500 text-primary-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-400 transition-colors"
                >
                  Get Your Free Evaluation
                </button>
                <a
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-primary-900 transition-colors"
                >
                  Schedule Consultation
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Home Evaluation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Free Home Evaluation
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-8">
                Get an accurate estimate of your home's current market value. 
                Our evaluation is completely free with no obligation.
              </p>

              <HomeEvaluationForm onSubmit={closeModal} />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

// Home Evaluation Form Component
function HomeEvaluationForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    sqft: "",
    timeframe: "",
    additionalInfo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>

      {/* Property Information */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select City</option>
              {siteConfig.primaryLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type *
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select Type</option>
              {siteConfig.propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <select
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms
            </label>
            <select
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
              <option value="3.5+">3.5+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <input
              type="number"
              name="yearBuilt"
              value={formData.yearBuilt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 1995"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Square Footage
            </label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 2500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            When are you planning to sell? *
          </label>
          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Select timeframe</option>
            <option value="immediately">Immediately</option>
            <option value="1-3 months">Within 1-3 months</option>
            <option value="3-6 months">Within 3-6 months</option>
            <option value="6-12 months">Within 6-12 months</option>
            <option value="just looking">Just looking for information</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information
          </label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Any additional details about your property or selling situation..."
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary-900 text-white py-3 rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Get My Free Evaluation"}
        </button>
        <button
          type="button"
          onClick={() => onSubmit()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to be contacted by {siteConfig.company.name} 
        regarding your property evaluation. We respect your privacy and will never share your information.
      </p>
    </form>
  );
}