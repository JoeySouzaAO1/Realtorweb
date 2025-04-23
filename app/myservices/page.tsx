import { FaHome, FaChartLine, FaHandshake, FaSearchLocation, FaClipboardList, FaComments } from 'react-icons/fa';
import Link from 'next/link';

export default function MyServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-yellow-50">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-red-500 bg-clip-text text-transparent">
            Real Estate Services
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Experience the difference of working with a dedicated realtor who puts your needs first.
          </p>
        </div>
      </section>

      {/* For Sellers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            For <span className="text-red-500">Sellers</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Consultation Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-red-500 text-3xl mb-4 flex justify-center">
                <FaHandshake />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Consultation</h3>
              <p className="text-gray-600">
                Free, no-obligation consultation to discuss your goals and timeline. I'll be your trusted advisor throughout the entire process.
              </p>
            </div>

            {/* Market Analysis Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-red-500 text-3xl mb-4 flex justify-center">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Market Analysis</h3>
              <p className="text-gray-600">
                Comprehensive market analysis to determine the optimal listing price and marketing strategy for your property.
              </p>
            </div>

            {/* Marketing Strategy Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-red-500 text-3xl mb-4 flex justify-center">
                <FaClipboardList />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Marketing</h3>
              <p className="text-gray-600">
                Professional photography, virtual tours, targeted digital marketing, and extensive network promotion to maximize exposure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Buyers Section */}
      <section className="py-16 px-4 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            For <span className="text-red-500">Buyers</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Property Search Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-red-500 text-3xl mb-4 flex justify-center">
                <FaSearchLocation />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Property Search</h3>
              <p className="text-gray-600">
                Access to the latest listings and off-market properties. I'll help you find the perfect home that matches your criteria.
              </p>
            </div>

            {/* Neighborhood Expertise Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-red-500 text-3xl mb-4 flex justify-center">
                <FaHome />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Area Expertise</h3>
              <p className="text-gray-600">
                In-depth knowledge of local neighborhoods, schools, and market trends to help you make informed decisions.
              </p>
            </div>

            {/* Negotiation Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-red-500 text-3xl mb-4 flex justify-center">
                <FaComments />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Negotiation</h3>
              <p className="text-gray-600">
                Expert negotiation skills to secure the best possible price and terms for your home purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to Get Started?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Whether you're buying or selling, I'm here to help you achieve your real estate goals.
          </p>
          <Link href="/contact">
            <button className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors duration-300">
              Contact Me Today
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
