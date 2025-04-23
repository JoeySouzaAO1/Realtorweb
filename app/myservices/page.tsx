
export default function MyServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <section className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">My Services</h1>
        <p className="text-lg text-gray-700 mb-8">
          I offer a full suite of real estate services to help you buy, sell, or invest with confidence.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-md p-6 shadow text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Home Buying</h2>
            <p className="text-gray-600">Guidance and support through every step of your home purchase journey.</p>
          </div>
          <div className="bg-gray-50 rounded-md p-6 shadow text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Home Selling</h2>
            <p className="text-gray-600">Expert marketing and negotiation to sell your home for the best price.</p>
          </div>
          <div className="bg-gray-50 rounded-md p-6 shadow text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Market Analysis</h2>
            <p className="text-gray-600">Comprehensive insights to help you make informed real estate decisions.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
