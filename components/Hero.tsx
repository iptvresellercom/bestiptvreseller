// FIX: Replaced placeholder content with a valid React component for the Hero section.
import React, { useState, useEffect } from 'react';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { BITRLogo } from './icons/BITRLogo';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    // Fallback in case video fails to load
    const videoTimer = setTimeout(() => {
      setVideoError(true);
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(videoTimer);
  }, []);
  
  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        {!videoError ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ minHeight: '100%', minWidth: '100%' }}
            onError={handleVideoError}
          >
            <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Fallback background if video fails to load
          <div className="w-full h-full bg-black"></div>
        )}
        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black" style={{ opacity: 0.7 }}></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgb(120_119_198_/60%),#f59e0b00)] z-10"></div>
      
      <div className="relative z-20 px-4 w-full">
        <div className="inline-block mb-8">
          <BITRLogo />
        </div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight max-w-4xl mx-auto"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Best IPTV Reseller. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500">Your streaming solution.</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Get the best IPTV panels and resell them with our platform. Take control of your streaming business today.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <button className="flex items-center justify-center gap-2 text-base font-semibold text-black bg-white px-8 py-4 rounded-xl hover:bg-white/90 transition-all duration-200 w-full sm:w-auto">
            <ShoppingBagIcon />
            Get Started Now
          </button>
          <button className="text-base font-semibold text-white border border-white/20 bg-transparent hover:border-white/40 px-8 py-4 rounded-xl transition-all duration-200 w-full sm:w-auto">
            Start Free Trial
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;