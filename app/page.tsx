import Link from "next/link";
import InstaCard from "@/components/cards/Instacard";
import { CountUp } from "@/components/Effects/Countup";
import { createClient } from "@/utils/supabase/server";
import VideoCard from "@/components/cards/Videocard";
import { TestimonialSlider } from "@/components/sliders/Testimonialslider";
import TypingText from "@/components/Effects/TypingText";
import InterestForm from "@/components/forms/InterestForm";

async function getInstagramPosts() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return posts;
}

export default async function Home() {
  const posts = await getInstagramPosts();

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}

      <section className="bg-white py-20 px-4 text-center shadow-sm">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    {/* Left side: Video */}
    <div className="md:w-1/2 flex justify-center">
      <VideoCard src="/Why-realestate.mp4" title="Why Real Estate?" />
    </div>

    {/* Right side: Text */}
    <div className="md:w-1/2 text-center md:text-left">
      <h1 className="text-black text-4xl md:text-5xl font-bold mb-6">
        Joey <span className="text-red-500">Souza</span>
      </h1>
      <TypingText
              text='"I genuinely just love to build relationships with people."'
              className="text-2xl md:text-4xl lg:text-5xl text-gray-700 font-semibold italic"
              speed={70}
            />
     
    </div>
  </div>
</section>

      {/* Testimonial Slider Section */}
      <section className="py-16 bg-gradient-to-br from-white via-pink-50 to-yellow-50">
  <div className="container mx-auto">
    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
      What Clients Are Saying
    </h2>
    <TestimonialSlider />
  </div>
</section>
  {/* About Me (left) */}
  <section className="max-w-5xl mx-auto py-16 px-4 flex flex-col md:flex-row gap-8 items-start">
  <div className="flex-1">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">About Me</h2>
    <p className="text-gray-600 text-lg leading-relaxed">
  I'm Joey Souza, a dedicated Realtor with <span className="font-semibold text-red-500">Fathom Realty</span>, proudly serving buyers and sellers in the Triangle area. As a University of North Carolina alum (Go Heels!), I bring the same commitment and team spirit I learned at Carolina to every client relationship.  
  <br /><br />
  I believe that transparency and honest communication are the foundation of trust, and I’m passionate about guiding my clients through every step of their real estate journey with clarity and care. Whether you’re buying your first home or selling a longtime family property, I’m here to make the process smooth, informed, and successful.  
  <br /><br />
  And don’t worry — even if you went to Duke, you'll get same top knotch service! However, there may be trash talking throughout...
</p>

    {/* Stats blocks */}
    <div className="flex gap-30 mt-8">
      {/* Experience Block */}
      <div className="flex flex-col items-center bg-gradient-to-tr from-pink-100 via-red-100 to-yellow-100 rounded-xl px-6 py-4 shadow min-w-[120px]">
        <h3 className="text-lg font-semibold text-gray-700">Experience</h3>
        <div className="text-3xl font-bold text-pink-500 mt-2">
          <CountUp end={5} duration={1.5} />
        </div>
        <p className="text-xs text-gray-500 mt-1">Years</p>
      </div>
      {/* Sales Volume Block */}
      <div className="flex flex-col items-center bg-gradient-to-tr from-pink-100 via-red-100 to-yellow-100 rounded-xl px-6 py-4 shadow min-w-[120px]">
        <h3 className="text-lg font-semibold text-gray-700">Sales Volume</h3>
        <div className="text-3xl font-bold text-yellow-500 mt-2">
          <CountUp end={3.5} decimals={1} duration={1.5} prefix="$" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Million</p>
      </div>
    </div>
  </div>
  {/* InstaCard (right) */}
  <div className="flex-shrink-0">
    <InstaCard posts={posts} />
  </div>
</section>


      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800 ">My Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2 text-red-500">Home Buying</h3>
              <p className="text-gray-600">Personalized guidance to help you find and purchase your dream home, from first showing to closing.</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2 text-red-500">Home Selling</h3>
              <p className="text-gray-600">Strategic marketing and expert negotiation to sell your property quickly and for top dollar.</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2 text-red-500">Market Analysis</h3>
              <p className="text-gray-600">In-depth market insights to help you make informed decisions about buying or selling real estate.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Interest Form */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Questions? I’m Here to Help!
          </h2>
          <InterestForm />
        </div>
      </section>
      {/* Contact Section */}
      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
<p className="text-gray-600 mb-2">
  <span className="font-semibold text-red-500">Brokered by Fathom Realty</span>
</p>
      </section>
    </main>
  );
}
