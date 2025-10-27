import { Link } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <main className="py-36">
        {/* Hero Section */}
        <section className="container max-w-5xl mx-auto px-4 py-16">

          <div className="max-w-5xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              We empower IPTV resellers<br />
              Worldwide with most Modern<br />
              Premium IPTV tools and techs.
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-4xl">
              Welcome to our platform, the world's best IPTV reseller platform. We empower your IPTV journey with world best IPTV reseller services and seamless IPTV business solutions, making us the top choice for resellers globally. Our mission is to make the IPTV market accessible and profitable for everyone by providing the best tools plus support, and infrastructure.
            </p>
          </div>
        </section>

        {/* More About Us Section */}
        <section className="relative bg-gray-900 text-white py-32" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://ext.same-assets.com/4291253363/3340885245.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="container max-w-[1200px] mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">More About Us.</h2>
          </div>
        </section>

        {/* About Description */}
        <section className="bg-gray-900 py-16">
          <div className="container max-w-[1200px] mx-auto px-4">
            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed max-w-5xl">
              IPTVRESELLER.STORE is the world leading IPTV reseller platform that offers top-quality IPTV services, powerful tools like IPTV Panels and Servers, and exceptional support to help resellers succeed. Our commitment was to providing the lastest and best infrastructure and resources which has made us the most trusted partner for IPTV resellers around the world.
            </p>
          </div>
        </section>

        {/* Dedicated Support Team Section */}
        <section className="container max-w-[1200px] mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Dedicated Reseller<br />Support Team
              </h2>
            </div>
            <div>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Our dedicated Reseller Support Team is here for you. We try to create opportunities for IPTV resellers to succeed in the competitive IPTV field. With high technology, dependable servers, and an intuitive platform, we empower every reseller to reach their full potential.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Our experts are ready to guide you—offering advice on the best devices within your budget, identifying suitable financing options, and delivering ongoing support to ensure your peace of mind.
              </p>
              <Link to="/support" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-lg">
                Contact Us <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Premium IPTV Panels Section */}
        <section className="container max-w-[1200px] mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-8">
              {/* Icons */}
              <div className="flex justify-center">
                <svg className="w-24 h-24 text-gray-300" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <circle cx="50" cy="35" r="15" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <path d="M 30 60 Q 50 45 70 60" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <path d="M 20 75 Q 50 55 80 75" fill="none" stroke="currentColor" strokeWidth="3"/>
                </svg>
              </div>
              <div className="flex justify-center">
                <svg className="w-24 h-24 text-gray-300" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="20" y="30" width="60" height="40" rx="5" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <rect x="30" y="40" width="15" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <rect x="55" y="40" width="15" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="50" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="currentColor">$</text>
                </svg>
              </div>
              <div className="flex justify-center">
                <svg className="w-24 h-24 text-gray-300" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <text x="50" y="45" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor">24</text>
                  <text x="50" y="65" textAnchor="middle" fontSize="12" fill="currentColor">7</text>
                </svg>
              </div>
              <div className="flex justify-center">
                <svg className="w-24 h-24 text-gray-300" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="30" y="20" width="40" height="60" rx="3" fill="none" stroke="currentColor" strokeWidth="3"/>
                  <line x1="35" y1="30" x2="65" y2="30" stroke="currentColor" strokeWidth="2"/>
                  <line x1="35" y1="40" x2="65" y2="40" stroke="currentColor" strokeWidth="2"/>
                  <line x1="35" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Premium IPTV Panels and Global Coverage
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We take pride in offering premium panels with 99.9% uptime, extensive global channel coverage spanning over 100 countries, and a commitment to exceptional 24/7 customer support.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our platform includes advanced analytics tools to help you track your performance, flexible subscription management options, and seamless integration capabilities to enhance your operational efficiency. Our focus is on simplicity, transparency, and efficiency, so you can focus on what really matters — delivering the best IPTV experience to your customers.
              </p>
            </div>
          </div>
        </section>

        {/* Resellers from Around the World */}
        <section className="container max-w-[1200px] mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Resellers from Around the World
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Our resellers come from diverse countries across the globe, making our community truly international.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We are proud to support a growing network of resellers from regions including Europe, North America, South America, Asia, Africa, and beyond. This global presence not only reflects the reliability of our platform but also ensures that our services are tailored to meet various market needs and local preferences.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Wherever you are, we are here to help you grow and succeed!
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                So we request and value your join to our community, so we made a great IPTV business journey!
              </p>
              <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-lg">
                Join Them Now <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
            <div className="w-[100%]">
              {/* Replaced flag placeholders with the IPTV-countries image */}
              <img 
                src="/IPTV-countries.webp" 
                alt="Countries where our IPTV resellers are located" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
