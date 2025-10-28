import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/ChevronIcons';

// Define interfaces for API data and the slide structure for type safety
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

interface Slide {
  // FIX: Replaced `JSX.Element` with `React.ReactNode` to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  gradient: string;
  slug: string;
}

const SuperpowersSection: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPanels = async () => {
            try {
                // Fetch data with embedded media to avoid extra API calls for images
                const response = await fetch('https://blrparis.com/wp-json/wp/v2/iptv-panels?_embed');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: IPTVPanel[] = await response.json();

                const gradients = [
                    'from-green-500/50 to-teal-800/50',
                    'from-yellow-500/50 to-yellow-800/50',
                    'from-cyan-500/50 to-blue-800/50',
                    'from-blue-500/50 to-indigo-900/50',
                    'from-red-500/50 to-red-900/50',
                    'from-purple-500/50 to-pink-800/50',
                ];

                const transformedSlides: Slide[] = data.map((panel, index) => {
                    // Use DOMParser to safely extract the first paragraph from HTML content for the description
                    const doc = new DOMParser().parseFromString(panel.content.rendered, 'text/html');
                    const firstParagraph = doc.querySelector('p')?.textContent || 'Manage your streams, users, and resellers with ease.';
                    
                    return {
                        title: panel.title.rendered,
                        description: firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : ''),
                        image: panel._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://source.unsplash.com/random/800x800?sig=${panel.id}`, // Fallback to a random image
                        icon: (
                          <div className="w-12 h-12 flex items-center justify-center">
                             <img src={panel.panel_data.logo} alt={`${panel.title.rendered} logo`} className="w-10 h-10 object-contain"/>
                          </div>
                        ),
                        gradient: gradients[index % gradients.length], // Cycle through predefined gradients
                        slug: panel.slug || panel.title.rendered.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    };
                });

                setSlides(transformedSlides);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching panels.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPanels();
    }, []);

    const prevSlide = () => setCurrentIndex(currentIndex - 1);
    const nextSlide = () => setCurrentIndex(currentIndex + 1);

    const renderCarouselContent = () => {
        if (isLoading) {
            return <div className="text-center py-20 text-white/70">Loading panels...</div>;
        }

        if (error) {
            return <div className="text-center py-20 text-red-400">Error: {error}</div>;
        }
        
        if (slides.length === 0) {
            return <div className="text-center py-20 text-white/70">No panels found.</div>
        }

        return (
            <div className="relative">
                 <div className="absolute top-0 left-0 h-full w-[10%] md:w-[20%] bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                 <div className="overflow-hidden">
                     <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ 
                            transform: window.innerWidth < 768 
                                ? `translateX(-${currentIndex * 100}%)` 
                                : `translateX(-${currentIndex * (100 / 3)}%)` 
                        }}
                     >
                        {slides.map((slide, index) => (
                            <div key={index} className="flex-shrink-0 w-full md:w-1/3 px-2 md:px-3">
                                 <Link to={`/panels/${slide.slug}`} className={`relative rounded-3xl p-8 aspect-square flex flex-col justify-end bg-black/20 overflow-hidden border border-white/10 group cursor-pointer`}>
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
                                </Link>
                            </div>
                        ))}
                     </div>
                 </div>
                 <div className="absolute top-0 right-0 h-full w-[10%] md:w-[20%] bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
                 
                 {/* Navigation controls */}
                 {slides.length > 1 && (
                    <>
                         <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-2 md:-left-8 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700/90 text-white p-3 rounded-full z-20 transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-2 md:-right-8 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700/90 text-white p-3 rounded-full z-20 transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={window.innerWidth < 768 ? currentIndex >= slides.length - 1 : currentIndex >= slides.length - 3}
                        >
                            <ChevronRightIcon />
                        </button>
                    </>
                 )}
            </div>
        );
    };

    return (
        <section className="bg-black text-white py-28">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="text-white/70 mb-2">IPTV panels for resellers with comprehensive management tools</p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                        Panels{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Resellers
                        </span>
                    </h2>
                </div>
                {renderCarouselContent()}
                <div className="text-center mt-12">
                    <Link 
                        to="/panels" 
                        className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-4 px-8 rounded-full hover:brightness-110 transition-all duration-300 text-lg"
                    >
                        Show all panels
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SuperpowersSection;