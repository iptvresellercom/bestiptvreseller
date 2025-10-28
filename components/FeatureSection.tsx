import React from 'react';
import { StreamIcon } from './icons/StreamIcon';
import { PlayIcon } from './icons/PlayIcon';

const FeatureSection: React.FC = () => {
  return (
    <section className="py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="relative rounded-3xl overflow-hidden border border-white/10"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=2070&auto=format&fit=crop)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative flex flex-col md:flex-row min-h-[500px]">
            {/* Left Panel - Content */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center p-12 bg-black/30 backdrop-blur-xl">
              <div className="mb-5">
                <StreamIcon />
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">Stream Control</h2>
              <p className="text-lg text-white/80 max-w-md">
                IPTV Panels and servers with unlimited stock of IPTV credits. Available at any time.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <button className="flex items-center justify-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-full hover:brightness-110 transition-all duration-200">
                  {/* <PlayIcon /> */}
                  Get Started
                </button>
                <button className="text-base font-semibold text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-200">
                  Get in touch
                </button>
              </div>
            </div>

            {/* Right Panel - Image Placeholder */}
            <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center">
              {/* You can replace this src with your own image URL */}
              <img 
                src="https://www.blrparis.com/wp-content/uploads/2025/10/heroimg.png" 
                alt="IPTV Dashboard Showcase" 
                className="w-full h-auto object-cover rounded-2xl relative top-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;