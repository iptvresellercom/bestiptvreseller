import React from 'react';
import { motion } from 'framer-motion';

const PremiumResellerHero: React.FC = () => {
  return (
    <section 
      className="relative w-full py-20 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #1A1A1A, #0D0D0D)'
      }}
    >
      {/* Aspect ratio container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-[600px] md:min-h-0" style={{ aspectRatio: window.innerWidth < 768 ? 'auto' : '16/6' }}>
        <div className="flex flex-col lg:flex-row items-center h-full min-h-[600px] md:min-h-0">
          {/* LEFT SIDE - 40% width */}
          <motion.div 
            className="w-full lg:w-4/5 mb-12 lg:mb-0 lg:pr-8 flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Image placeholder with empty src */}
              <div className="relative mx-auto">
                <img 
                  src="https://www.blrparis.com/wp-content/uploads/2025/10/29-scaled.png" 
                  alt="Premium IPTV Reseller" 
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
            </div>
          </motion.div>
          
          {/* RIGHT SIDE - 60% width */}
          <motion.div 
            className="w-full lg:w-3/5 text-center lg:text-left flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              Join world's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">TOP 1</span> IPTV RESELLER service in the world
            </h1>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <button 
                className="px-10 py-2 bg-zinc-950 text-white font-bold rounded-full text-lg hover:bg-zinc-900 transition-all duration-300"
                style={{
                  boxShadow: '0 0 15px rgba(161, 161, 170, 0.7), 0 0 50px rgba(168, 85, 247, 0.4), 0 0 35px rgba(147, 51, 234, 0.2)'
                }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-purple-800">Join Us Now!</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default PremiumResellerHero;