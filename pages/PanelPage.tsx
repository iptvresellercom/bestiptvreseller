import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import { data as channelsData } from '../constants/chnls.ts';

interface IPTVPanel {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  panel_data: {
    logo: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text?: string;
    }[];
  };
}

// Define a type for channel data
interface Channel {
  id: number;
  name: string;
  category: string;
  logo: string;
  isHD?: boolean;
  isPopular?: boolean;
  channels: string[];
}

const PanelPage: React.FC = () => {
  const { panelSlug } = useParams<{ panelSlug: string }>();
  const [panel, setPanel] = useState<IPTVPanel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(120);
  const [username, setUsername] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'features' | 'pricing' | 'support' | 'channels'>('features');
  // State to track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchPanel = async () => {
      try {
        setLoading(true);
        // Fetch the specific panel by slug
        const response = await fetch(`https://blrparis.com/wp-json/wp/v2/iptv-panels?slug=${panelSlug}&_embed`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: IPTVPanel[] = await response.json();
        
        if (data.length > 0) {
          setPanel(data[0]);
        } else {
          setError('Panel not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (panelSlug) {
      fetchPanel();
    }
  }, [panelSlug]);

  // Transform the data to match our component structure
  const transformedChannels: Channel[] = channelsData.map((category, index) => ({
    id: index,
    name: category.name,
    category: category.name,
    logo: category.image,
    channels: category.sublist,
    isPopular: index < 3 // Mark first 3 categories as popular
  }));

  // Group channels by category
  const channelsByCategory: Record<string, Channel> = {};
  transformedChannels.forEach(channel => {
    channelsByCategory[channel.category] = channel;
  });

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p className="text-white/70">Loading panel...</p>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  if (error || !panel) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
              <p className="text-white/70 mb-6">{error || 'Panel not found'}</p>
              <Link to="/" className="text-white hover:text-white/80 underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Extract content from HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(panel.content.rendered, 'text/html');
  const paragraphs = Array.from(doc.querySelectorAll('p')).map(p => p.textContent);
  const lists = Array.from(doc.querySelectorAll('ul, ol')).map(list => 
    Array.from(list.querySelectorAll('li')).map(li => li.textContent)
  );

  // Function to convert absolute WordPress URLs to relative paths
  const convertAbsoluteUrlsToRelative = (content: string): string => {
    // Convert absolute URLs to relative paths
    return content
      .replace(/https?:\/\/[^\/]*blrparis\.com\/wp-content\/uploads\//g, '/wp-content/uploads/')
      .replace(/https?:\/\/[^\/]*blrparis\.com\//g, '/')
      .replace(/https?:\/\/[^\/]*reselleriptv\.com\//g, '/');
  };

  // Function to extract slug from WordPress URLs and create relative paths
  const convertWordPressUrlToRelativeSlug = (url: string): string => {
    // Extract the slug from WordPress URLs
    const blrparisPattern = /https?:\/\/[^\/]*blrparis\.com\/([^?]*)/;
    const wwwblrparisPattern = /https?:\/\/www\.blrparis\.com\/([^?]*)/;
    
    // Check if it matches blrparis.com pattern
    const blrparisMatch = url.match(blrparisPattern);
    if (blrparisMatch && blrparisMatch[1]) {
      const slug = blrparisMatch[1];
      // Ensure it starts with /
      return slug.startsWith('/') ? slug : `/${slug}`;
    }
    
    // Check if it matches www.blrparis.com pattern
    const wwwblrparisMatch = url.match(wwwblrparisPattern);
    if (wwwblrparisMatch && wwwblrparisMatch[1]) {
      const slug = wwwblrparisMatch[1];
      // Ensure it starts with /
      return slug.startsWith('/') ? slug : `/${slug}`;
    }
    
    // For other URLs, just return as is
    return url;
  };

  // Function to convert URLs in HTML content
  const convertHtmlUrlsToRelative = (htmlContent: string): string => {
    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Convert absolute URLs in links to use data attributes for React Router
    const links = doc.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        // Check if it's an internal link (WordPress URL)
        if (href.includes('blrparis.com') || href.includes('reselleriptv.com')) {
          // Extract the relative slug
          const relativeSlug = convertWordPressUrlToRelativeSlug(href);
          // Remove the href and add a data attribute for our Link component
          link.removeAttribute('href');
          link.setAttribute('data-link-to', relativeSlug);
          // Add a class to identify these links
          link.classList.add('wordpress-link');
        }
        // External links will keep their href attribute
      }
    });
    
    // Convert absolute URLs in images
    const images = doc.querySelectorAll('img[src]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        const newSrc = convertAbsoluteUrlsToRelative(src);
        img.setAttribute('src', newSrc);
      }
    });
    
    return doc.body.innerHTML;
  };

  // Extract features from the WordPress content
  const extractFeatures = () => {
    const features: string[] = [];
    
    // Look for list items in the content as features
    const listItems = doc.querySelectorAll('li');
    listItems.forEach(item => {
      const text = item.textContent?.trim();
      if (text && text.length > 5) { // Only use meaningful list items
        features.push(text);
      }
    });
    
    // If we have enough list items, return them
    if (features.length >= 4) {
      return features.slice(0, 8); // Limit to 8 features
    }
    
    // If not enough list items, look for strong/bold text as features
    const boldElements = doc.querySelectorAll('strong, b');
    boldElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 5) {
        features.push(text);
      }
    });
    
    // If we still don't have enough, look for headings as features
    if (features.length < 4) {
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const text = heading.textContent?.trim();
        if (text && text.length > 5 && !features.includes(text)) {
          features.push(text);
        }
      });
    }
    
    // If still not enough, use paragraphs as features
    if (features.length < 4) {
      const paras = doc.querySelectorAll('p');
      paras.forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 20 && !features.includes(text)) { // Only use longer paragraphs
          features.push(text);
        }
      });
    }
    
    return features.slice(0, 8); // Limit to 8 features
  };

  // Extract stats from the content
  const extractStats = () => {
    const defaultStats = [
      { value: '1,000+', label: 'Channels' },
      { value: '2,335+', label: 'Movies' },
      { value: '324+', label: 'Series' },
      { value: '99.9%', label: 'Uptime' }
    ];
    
    // Try to find stats in the content
    const contentText = panel.content.rendered;
    
    // Look for common stat patterns in the content
    const patterns = [
      { regex: /(\d+[.,]?\d*\+?)\s*channels?/i, label: 'Channels' },
      { regex: /(\d+[.,]?\d*\+?)\s*movies?/i, label: 'Movies' },
      { regex: /(\d+[.,]?\d*\+?)\s*series?/i, label: 'Series' },
      { regex: /(\d+[.,]?\d*%)\s*uptime/i, label: 'Uptime' },
      { regex: /(\d+[.,]?\d*\+?)\s*users?/i, label: 'Users' },
      { regex: /(\d+[.,]?\d*\+?)\s*devices?/i, label: 'Devices' },
      { regex: /(\d+[.,]?\d*\+?)\s*vod/i, label: 'VODs' }
    ];
    
    const foundStats = [];
    for (const pattern of patterns) {
      const match = contentText.match(pattern.regex);
      if (match) {
        foundStats.push({ value: match[1], label: pattern.label });
      }
    }
    
    // If we found some stats, use them; otherwise, use defaults
    return foundStats.length > 0 ? foundStats.slice(0, 4) : defaultStats; // Limit to 4 stats
  };

  const panelFeatures = extractFeatures();
  const panelStats = extractStats();
  
  // Convert the panel content to use relative URLs
  const processedContent = convertHtmlUrlsToRelative(panel.content.rendered);
  
  // Process the excerpt for relative URLs
  const processedExcerpt = panel.excerpt?.rendered ? 
    convertAbsoluteUrlsToRelative(parser.parseFromString(panel.excerpt.rendered, 'text/html').body.textContent || '') : 
    '';

  // Pricing plans
  const pricingPlans = [
    { name: 'Monthly', price: '$10', savings: '', popular: false },
    { name: 'Quarterly', price: '$27', savings: 'Save 10%', popular: true },
    { name: '6-Month', price: '$50', savings: 'Save 17%', popular: false },
    { name: 'Annual', price: '$65', savings: 'Save 46%', popular: false }
  ];

  // Calculate price based on credits (example: $1.58 per credit)
  const calculatePrice = (creditAmount: number) => {
    const price = creditAmount * 1.58;
    return `$${price.toFixed(2)}`;
  };

  // Custom component to render HTML content with client-side navigation
  const HtmlContentWithLinks: React.FC<{ content: string }> = ({ content }) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    React.useEffect(() => {
      if (contentRef.current) {
        // Find all elements with data-link-to attribute
        const linkElements = contentRef.current.querySelectorAll('[data-link-to]');
        linkElements.forEach(element => {
          const linkTo = element.getAttribute('data-link-to');
          if (linkTo) {
            // Add click event listener for client-side navigation
            element.addEventListener('click', (e) => {
              e.preventDefault();
              navigate(linkTo);
            });
            
            // Change cursor to pointer to indicate it's clickable
            (element as HTMLElement).style.cursor = 'pointer';
          }
        });
      }
    }, [content, navigate]);
    
    return (
      <div 
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: content }} 
        className="text-lg text-gray-300 prose prose-invert max-w-none"
      />
    );
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Behind Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-black py-32 pt-64 overflow-hidden -mt-20 pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-0">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/3 flex justify-center">
                {panel._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <img 
                    src={panel._embedded['wp:featuredmedia'][0].source_url} 
                    alt={panel._embedded['wp:featuredmedia'][0].alt_text || panel.title.rendered}
                    className="w-64 h-64 object-contain rounded-2xl border border-gray-700 p-4 bg-gray-900/50"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-800 rounded-2xl border border-gray-700 flex items-center justify-center">
                    <div className="text-5xl font-bold text-amber-500">
                      {panel.title.rendered.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:w-2/3 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4 pt-8">
                  <h1 className="text-4xl md:text-5xl font-bold">{panel.title.rendered}</h1>
                  <div className="flex items-center gap-2 bg-green-900/30 border border-green-800/50 rounded-full px-4 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-400 text-sm font-medium">Verified Provider</span>
                  </div>
                </div>
                <p className="text-lg text-gray-300 mb-6 max-w-3xl">
                  {processedExcerpt || 'Premium IPTV panel solution with advanced features and reliable performance.'}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link to="#features" className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">
                    View Features
                  </Link>
                  <Link to="#pricing" className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors">
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-12 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {panelStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Back Link */}
          <div className="mb-8">
            <Link to="/panels" className="text-white hover:text-gray-300 flex items-center gap-2 font-medium">
              ← Back to providers
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 mb-10">
            <button
              className={`py-4 px-6 font-medium text-lg ${
                activeTab === 'features'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg ${
                activeTab === 'channels'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('channels')}
            >
              Channels
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg ${
                activeTab === 'pricing'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('pricing')}
            >
              Pricing
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg ${
                activeTab === 'support'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('support')}
            >
              Support
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* About This Panel */}
                <div className="mb-12" id="features">
                  <h2 className="text-3xl font-bold mb-8">About This Panel</h2>
                  <div className="mb-8">
                    {/* Render the actual content from WordPress with relative URLs */}
                    <HtmlContentWithLinks content={processedContent} />
                  </div>
                  
                  {/* Render features if we have them */}
                  {panelFeatures.length > 0 && (
                    <>
                      <h2 className="text-3xl font-bold mb-8">Key Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {panelFeatures.map((feature, index) => (
                          <div key={index} className="flex items-start gap-4 p-5 bg-gray-900/30 rounded-xl border border-gray-800 hover:border-white/30 transition-colors">
                            <div className="mt-1 text-white flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white text-lg">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Why Choose This Panel */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6">Why Choose {panel.title.rendered}?</h2>
                  <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
                    <p className="text-lg text-gray-300 mb-6">
                      Our management system is designed to empower resellers with automation, growth tools, and profitability features. 
                      We focus on providing the tools you need to build and expand your IPTV business.
                    </p>
                    <p className="text-lg text-gray-300">
                      With real-time analytics and stable performance, you can confidently manage your subscriptions and grow your customer base.
                    </p>
                  </div>
                </div>

                {/* Panel Features Summary */}
                <div>
                  <h2 className="text-3xl font-bold mb-8">Panel Features Summary</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {
                      [
                        "User-Friendly Interface",
                        "Credit-Based System",
                        "Free Applications",
                        "Subscription Management",
                        "Reseller Support",
                        "Multi-Device Compatibility",
                        "EPG Integration",
                        "Real-Time Analytics"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-4 p-5 bg-gray-900/30 rounded-xl border border-gray-800">
                          <div className="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-white text-lg">{feature}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              <div>
                {/* Partnership Section */}
                <div className="bg-gradient-to-br from-gray-800/20 to-black rounded-2xl border border-gray-700/50 p-6 mb-8">
                  <h3 className="text-2xl font-bold mb-6">Partnership</h3>
                  <p className="text-gray-300 mb-6">
                    Provided exclusively by Reselleriptv.com, offering real-time analytics and enterprise-grade stability.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white">Fast Deployment</div>
                        <div className="text-gray-400 text-sm">Get started in minutes</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white">Secure & Reliable</div>
                        <div className="text-gray-400 text-sm">Enterprise-grade security</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12a7 7 0 11-14 0 7 7 0 0114 0zm0 0H5" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white">24/7 Support</div>
                        <div className="text-gray-400 text-sm">Always here to help</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Guarantee */}
                <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800">
                  <h3 className="font-bold text-xl mb-4 text-center">Quality Guarantee</h3>
                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <div className="text-white mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <span className="text-sm">4K/HD Streaming</span>
                    </div>
                    <div className="text-center">
                      <div className="text-white mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M19 12a7 7 0 11-14 0 7 7 0 0114 0zm0 0H5" />
                        </svg>
                      </div>
                      <span className="text-sm">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-8">Flexible Pricing Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pricingPlans.map((plan, index) => (
                    <div 
                      key={index} 
                      className={`relative rounded-2xl p-6 border ${
                        plan.popular 
                          ? 'bg-gradient-to-br from-gray-700/30 to-gray-800/10 border-white' 
                          : 'bg-gray-900/30 border-gray-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs font-bold px-4 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-3xl font-bold text-white">{plan.price}</div>
                        {plan.savings && (
                          <p className="text-gray-300 mt-2">{plan.savings}</p>
                        )}
                      </div>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Full feature access</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>24/7 Support</span>
                        </li>
                        <li className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Regular Updates</span>
                        </li>
                      </ul>
                      <button className={`w-full py-3 rounded-lg font-bold ${
                        plan.popular 
                          ? 'bg-white text-black hover:bg-gray-200' 
                          : 'bg-gray-800 text-white border border-gray-700 hover:border-white'
                      } transition-colors`}>
                        Subscribe Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Recharge Panel Credits */}
                <div className="bg-gradient-to-br from-gray-800/20 to-black rounded-2xl border border-gray-700/50 p-6">
                  <h2 className="text-2xl font-bold mb-6">Recharge Panel Credits</h2>
                  
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Panel Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Enter your panel username"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Select Credits: {credits} credits (${(credits * 1.58).toFixed(2)})
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="500"
                      step="10"
                      value={credits}
                      onChange={(e) => setCredits(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>60</span>
                      <span>500</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 px-6 rounded-xl transition duration-300">
                    Recharge Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold mb-8">Available Channels</h2>
                
                {/* Search Input */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                
                <div className="flex flex-col gap-6">
                  {Object.entries(channelsByCategory)
                    .filter(([category, channelData]) => {
                      // Filter categories based on search term
                      if (!searchTerm) return true;
                      return channelData.channels.some(channel => 
                        channel.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                    })
                    .map(([category, channelData]) => {
                      // Filter channels within each category based on search term
                      const filteredChannels = searchTerm 
                        ? channelData.channels.filter(channel => 
                            channel.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                        : channelData.channels;
                      
                      // Only show category if it has matching channels
                      if (searchTerm && filteredChannels.length === 0) return null;
                      
                      return (
                        <div key={channelData.id} className="flex flex-col h-full">
                          <div 
                            className="flex justify-between items-center bg-gray-900/30 border border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                            onClick={() => toggleCategory(channelData.name)}
                          >
                            <div className="flex items-center">
                              <img 
                                src={channelData.logo} 
                                alt={channelData.name} 
                                className="w-8 h-8 rounded-full mr-3 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <div>
                                <h2 className="text-lg font-bold text-white">
                                  {channelData.name}
                                </h2>
                                <span className="text-xs text-gray-400">
                                  {searchTerm 
                                    ? `${filteredChannels.length} of ${channelData.channels.length} channels`
                                    : `${channelData.channels.length} channels`
                                  }
                                </span>
                              </div>
                            </div>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                                expandedCategories[channelData.name] ? 'rotate-180' : ''
                              }`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          
                          {/* Channels List - shown when category is expanded */}
                          {expandedCategories[channelData.name] && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                              {filteredChannels.map((channel, idx) => (
                                <div 
                                  key={idx} 
                                  className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                                      <span className="text-white text-xs font-bold">
                                        {idx + 1}
                                      </span>
                                    </div>
                                    <h3 className="text-sm font-medium text-white truncate">
                                      {channel}
                                    </h3>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-8">Support & Resources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="p-6 bg-gray-900/30 rounded-2xl border border-gray-800">
                    <div className="text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Live Chat Support</h3>
                    <p className="text-gray-400 mb-4">Get instant help from our support team 24/7</p>
                    <button className="text-white font-medium">Start Chat →</button>
                  </div>
                  
                  <div className="p-6 bg-gray-900/30 rounded-2xl border border-gray-800">
                    <div className="text-white mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Documentation</h3>
                    <p className="text-gray-400 mb-4">Comprehensive guides and tutorials</p>
                    <button className="text-white font-medium">View Docs →</button>
                  </div>
                </div>
                
                <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
                  <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {
                      [
                        {
                          question: "How do I get started with the panel?",
                          answer: "Simply choose a plan, create your account, and follow our setup wizard to configure your panel in minutes."
                        },
                        {
                          question: "What devices are supported?",
                          answer: "Our panel works with all major devices including MAG boxes, Android boxes, Smart TVs, and mobile devices."
                        },
                        {
                          question: "How often are updates released?",
                          answer: "We release regular updates with new features and improvements on a monthly basis."
                        }
                      ].map((faq, index) => (
                        <div key={index} className="border-b border-gray-800 pb-4">
                          <h4 className="font-bold text-lg mb-2">{faq.question}</h4>
                          <p className="text-gray-400">{faq.answer}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gradient-to-br from-gray-800/20 to-black rounded-2xl border border-gray-700/50 p-6">
                  <h3 className="text-xl font-bold mb-4">Contact Support</h3>
                  <p className="text-gray-300 mb-6">Need help? Our support team is here for you.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>support@reselleriptv.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span>+1 (800) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>24/7 Support</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-white text-black hover:bg-gray-200 font-bold py-3 px-4 rounded-lg transition duration-300">
                    Open Support Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Latest News & Updates */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Latest News & Updates</h2>
            <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
              <p className="text-gray-400 text-center py-8">No news for this panel yet. Check back soon for updates!</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default PanelPage;