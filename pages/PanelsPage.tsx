import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import PremiumResellerHero from '../components/PremiumResellerHero';
import { motion } from 'framer-motion';

interface IPTVPanel {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  panel_data: {
    logo: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
}

const PanelsPage: React.FC = () => {
  const [panels, setPanels] = useState<IPTVPanel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  


  useEffect(() => {
    const fetchPanels = async () => {
      try {
        setLoading(true);
        // Fetch all panels
        const response = await fetch('https://blrparis.com/wp-json/wp/v2/iptv-panels?_embed');
        
        // Debug: Log the response
        // console.log('Response status:', response.status);
        // console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: IPTVPanel[] = await response.json();
        
        // Debug: Log the fetched data
        // console.log('Fetched data:', data);
        // console.log('First panel:', data[0]);
        
        // Validate the data
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        
        setPanels(data);
      } catch (err) {
        console.error('Error fetching panels:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPanels();
  }, []);

  // Transform panels to slides (same format as homepage)
  const transformPanelsToSlides = (panels: IPTVPanel[]) => {
    const gradients = [
      'from-green-500/50 to-teal-800/50',
      'from-yellow-500/50 to-yellow-800/50',
      'from-cyan-500/50 to-blue-800/50',
      'from-blue-500/50 to-indigo-900/50',
      'from-red-500/50 to-red-900/50',
      'from-purple-500/50 to-pink-800/50',
    ];

    return panels.map((panel, index) => {
      // Use DOMParser to safely extract the first paragraph from HTML content for the description
      const doc = new DOMParser().parseFromString(panel.content.rendered, 'text/html');
      const firstParagraph = doc.querySelector('p')?.textContent || 'Manage your streams, users, and resellers with ease.';
      
      // Safely access panel data
      const logoUrl = panel.panel_data?.logo || '';
      const imageUrl = panel._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://source.unsplash.com/random/800x800?sig=${panel.id}`;
      
      return {
        id: panel.id,
        title: panel.title.rendered,
        description: firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : ''),
        image: imageUrl,
        icon: (
          <div className="w-12 h-12 flex items-center justify-center">
             <img src={logoUrl} alt={`${panel.title.rendered} logo`} className="w-10 h-10 object-contain"/>
          </div>
        ),
        gradient: gradients[index % gradients.length], // Cycle through predefined gradients
        slug: panel.slug || panel.title.rendered.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      };
    });
  };



  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
              <p className="text-white/70">Loading panels...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
              <p className="text-white/70 mb-6">{error}</p>
              <Link to="/" className="text-amber-400 hover:text-amber-300 underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Validate panels data before transformation
  const validPanels = panels.filter(panel => 
    panel.id && 
    panel.title?.rendered
  );
  
  const slides = transformPanelsToSlides(validPanels);
  // Debug: Log the panels and slides to see what's happening
  // console.log('Panels:', panels);
  // console.log('Valid panels:', validPanels);
  // console.log('Slides:', slides);

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>All IPTV Panels - BITR</title>
        <meta name="description" content="Discover our complete collection of premium IPTV panels for viewers and resellers" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Link to="/" className="text-amber-400 hover:text-amber-300 flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All IPTV Panels</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our complete collection of premium IPTV panels for viewers and resellers
            </p>
          </div>

          {/* Debug info */}
          <div className="mb-4 text-center text-white/70">
            <p>Panels fetched: {panels.length} | Slides generated: {slides.length}</p>
          </div>

          {slides && slides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  className="relative rounded-3xl p-8 aspect-square flex flex-col justify-end bg-black/20 overflow-hidden border border-white/10 group cursor-pointer"
                  initial={{ 
                    x: index === 0 ? -100 : index === slides.length - 1 ? 100 : 0, 
                    y: index === 0 || index === slides.length - 1 ? 0 : 100,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1 
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeOut",
                    delay: index * 0.2
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link to={`/panels/${slide.slug}`} className="absolute inset-0 z-10"></Link>
                  <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent z-1"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-50 mix-blend-color z-1`}></div>
                  <div className="relative z-10">
                    <div className="inline-block mb-4 bg-gray-900/50 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/10">
                      {slide.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-3">{slide.title}</h3>
                      <p className="text-white/80 text-sm lg:text-base">{slide.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/70">No panels found.</p>
            </div>
          )}
        </div>
        
        {/* Premium IPTV Reseller Section */}
        <PremiumResellerHero />
      </main>
    </div>
  );
};

export default PanelsPage;