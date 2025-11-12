import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { data as channelsData } from '../constants/chnls.ts';

interface CreditPackage {
  credits: number;
  price: string;
  months: number;
}

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
    verified_provider: boolean;
    panel_url: string;
    statistics: {
      channels: number;
      movies: number;
      series: number;
      uptime: string;
    };
    pricing: {
      packages: CreditPackage[];
    };
    whatsapp_number: string;
    partnership: {
      title: string;
      description: string;
      fast_deployment: {
        title: string;
        description: string;
      };
      secure_reliable: {
        title: string;
        description: string;
      };
      support: {
        title: string;
        description: string;
      };
    };
    quality_guarantee: {
      money_back_guarantee: boolean;
      secure_payment: boolean;
    };
    why_choose: {
      instant_access: boolean;
      unlimited_customers: boolean;
      secure_management: boolean;
    };
    features: {
      user_friendly: boolean;
      subscription_management: boolean;
      credit_based: boolean;
      reseller_support: boolean;
      free_applications: boolean;
    };
  };
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text?: string;
    }[];
  };
}

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
  const [credits, setCredits] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'features' | 'pricing' | 'support' | 'channels'>('features');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState<number>(0);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPanel = async () => {
      try {
        setLoading(true);
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

  const transformedChannels: Channel[] = channelsData.map((category, index) => ({
    id: index,
    name: category.name,
    category: category.name,
    logo: category.image,
    channels: category.sublist,
    isPopular: index < 3
  }));

  const channelsByCategory: Record<string, Channel> = {};
  transformedChannels.forEach(channel => {
    channelsByCategory[channel.category] = channel;
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleViewFeatures = () => {
    setActiveTab('features');
    setTimeout(() => {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleViewPricing = () => {
    if (panel?.panel_data?.panel_url) {
      window.open(panel.panel_data.panel_url, '_blank');
    }
  };

  // Get credit packages from WordPress
  const creditPackages = panel?.panel_data?.pricing?.packages || [];

  // Get current selected package based on slider index
  const getCurrentPackage = () => {
    if (creditPackages.length === 0) return null;
    return creditPackages[selectedPackageIndex] || creditPackages[0];
  };

  // Handle slider change - update to selected package
  const handleSliderChange = (index: number) => {
    setSelectedPackageIndex(index);
    if (creditPackages[index]) {
      setCredits(creditPackages[index].credits);
    }
  };

  // Set initial credits when packages are loaded
  useEffect(() => {
    if (panel?.panel_data?.pricing?.packages?.length > 0 && credits === 0) {
      setCredits(panel.panel_data.pricing.packages[0].credits);
    }
  }, [panel, credits]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-6"></div>
              <p className="text-white/70 text-xl">Loading panel...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !panel) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-white mb-6">Error</h1>
              <p className="text-white/70 mb-8 text-xl">{error || 'Panel not found'}</p>
              <Link to="/" className="text-white hover:text-white/80 underline text-lg font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(panel.content.rendered, 'text/html');

  const convertAbsoluteUrlsToRelative = (content: string): string => {
    return content
      .replace(/https?:\/\/[^\/]*blrparis\.com\/wp-content\/uploads\//g, '/wp-content/uploads/')
      .replace(/https?:\/\/[^\/]*blrparis\.com\//g, '/')
      .replace(/https?:\/\/[^\/]*bestiptvreseller\.com\//g, '/');
  };

  const convertWordPressUrlToRelativeSlug = (url: string): string => {
    const blrparisPattern = /https?:\/\/[^\/]*blrparis\.com\/([^?]*)/;
    const wwwblrparisPattern = /https?:\/\/www\.blrparis\.com\/([^?]*)/;
    
    const blrparisMatch = url.match(blrparisPattern);
    if (blrparisMatch && blrparisMatch[1]) {
      const slug = blrparisMatch[1];
      return slug.startsWith('/') ? slug : `/${slug}`;
    }
    
    const wwwblrparisMatch = url.match(wwwblrparisPattern);
    if (wwwblrparisMatch && wwwblrparisMatch[1]) {
      const slug = wwwblrparisMatch[1];
      return slug.startsWith('/') ? slug : `/${slug}`;
    }
    
    return url;
  };

  const convertHtmlUrlsToRelative = (htmlContent: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const links = doc.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        if (href.includes('blrparis.com') || href.includes('bestiptvreseller.com')) {
          const relativeSlug = convertWordPressUrlToRelativeSlug(href);
          link.removeAttribute('href');
          link.setAttribute('data-link-to', relativeSlug);
          link.classList.add('wordpress-link');
        }
      }
    });
    
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

  const extractFeatures = () => {
    const features: string[] = [];
    
    const listItems = doc.querySelectorAll('li');
    listItems.forEach(item => {
      const text = item.textContent?.trim();
      if (text && text.length > 5) {
        features.push(text);
      }
    });
    
    if (features.length >= 4) {
      return features.slice(0, 8);
    }
    
    const boldElements = doc.querySelectorAll('strong, b');
    boldElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 5) {
        features.push(text);
      }
    });
    
    if (features.length < 4) {
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const text = heading.textContent?.trim();
        if (text && text.length > 5 && !features.includes(text)) {
          features.push(text);
        }
      });
    }
    
    if (features.length < 4) {
      const paras = doc.querySelectorAll('p');
      paras.forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 20 && !features.includes(text)) {
          features.push(text);
        }
      });
    }
    
    return features.slice(0, 8);
  };

  const panelFeatures = extractFeatures();
  
  // Get stats from WordPress data
  const panelStats = [
    { value: `${panel.panel_data?.statistics?.channels || 0}+`, label: 'Channels' },
    { value: `${panel.panel_data?.statistics?.movies || 0}+`, label: 'Movies' },
    { value: `${panel.panel_data?.statistics?.series || 0}+`, label: 'Series' },
    { value: panel.panel_data?.statistics?.uptime || '99.9%', label: 'Uptime' }
  ];

  const processedContent = convertHtmlUrlsToRelative(panel.content.rendered);
  
  const processedExcerpt = panel.excerpt?.rendered ? 
    convertAbsoluteUrlsToRelative(parser.parseFromString(panel.excerpt.rendered, 'text/html').body.textContent || '') : 
    '';

  // Calculate price per credit based on packages
  const calculatePrice = (creditsAmount: number): string => {
    if (creditPackages.length === 0) {
      return `${(creditsAmount * 1.58).toFixed(2)}`;
    }

    // First check if creditsAmount matches any package exactly
    const matchingPackage = creditPackages.find(pkg => pkg.credits === creditsAmount);
    if (matchingPackage) {
      return matchingPackage.price;
    }

    // If no exact match, calculate proportionally based on first package
    let pricePerCredit = 0;
    
    if (creditPackages.length > 0) {
      // Use the first package as base
      const basePackage = creditPackages[0];
      const basePrice = parseFloat(basePackage.price.replace(/[^0-9.]/g, ''));
      pricePerCredit = basePrice / basePackage.credits;
    }

    const calculatedPrice = creditsAmount * pricePerCredit;
    const currencySymbol = creditPackages[0]?.price.replace(/[0-9.]/g, '') || '€';
    
    return `${calculatedPrice.toFixed(2)}${currencySymbol}`;
  };

  // Handle credit recharge submission
  const handleRechargeSubmit = async () => {
    // Validation
    if (!username.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter your panel username' });
      return;
    }

    if (!whatsapp.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter your WhatsApp number' });
      return;
    }

    // Basic WhatsApp validation (should start with + and contain only digits)
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
    if (!whatsappRegex.test(whatsapp.trim())) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid WhatsApp number (e.g., +1234567890)' });
      return;
    }

    if (credits === 0 || !getCurrentPackage()) {
      setSubmitMessage({ type: 'error', text: 'Please select a credit package' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const calculatedPrice = calculatePrice(credits);
      const requestData = {
        username: username.trim(),
        whatsapp: whatsapp.trim(),
        credits: credits,
        price: calculatedPrice,
        panel_name: panel.title.rendered,
      };

      console.log('Sending order:', requestData); // Debug log

      const response = await fetch('https://blrparis.com/wp-json/wp/v2/credit-orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok && data.success) {
        setSubmitMessage({ 
          type: 'success', 
          text: `✅ Order submitted successfully! Order ID: #${data.order_id}. We will contact you on WhatsApp soon.` 
        });
        
        // Send email notification via backend service
        console.log('Attempting to send email notification via backend service');
        const rechargeDetails = {
          username: username.trim(),
          whatsapp: whatsapp.trim(),
          credits: credits,
          price: calculatedPrice,
          panel_name: panel.title.rendered,
          order_id: data.order_id
        };
        
        // Send email notification to backend service
        fetch('http://localhost:3001/send-recharge-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rechargeDetails)
        }).then(response => {
          if (response.ok) {
            console.log('Email notification request sent successfully');
          } else {
            console.error('Failed to send email notification request');
          }
        }).catch(error => {
          console.error('Error sending email notification request:', error);
          // Don't show error to user since this is a background operation
          // The main order submission was successful
        });
        
        // Reset form
        setUsername('');
        setWhatsapp('');
        setSelectedPackageIndex(0);
        if (creditPackages.length > 0) {
          setCredits(creditPackages[0].credits);
        }
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitMessage(null);
        }, 5000);
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: data.message || 'Failed to submit order. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error submitting order:', error); // Debug log
      setSubmitMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Default features for pricing cards
  const pricingFeatures = [
    '+60,000 TV Channels',
    '+66,000 Movies & Series',
    '4K / Ultra HD Picture Quality',
    'FREE Channels & VOD Updates',
    '99.9% Server Uptime',
    'All Devices are Supported',
    '24/7 Technical Assistance'
  ];

  const HtmlContentWithLinks: React.FC<{ content: string }> = ({ content }) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    React.useEffect(() => {
      if (contentRef.current) {
        const linkElements = contentRef.current.querySelectorAll('[data-link-to]');
        linkElements.forEach(element => {
          const linkTo = element.getAttribute('data-link-to');
          if (linkTo) {
            element.addEventListener('click', (e) => {
              e.preventDefault();
              navigate(linkTo);
            });
            
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

  // Get enabled features
  const whyChooseFeatures = [];
  if (panel.panel_data?.why_choose?.instant_access) whyChooseFeatures.push('⚡ Instant Panel Access');
  if (panel.panel_data?.why_choose?.unlimited_customers) whyChooseFeatures.push('👥 Unlimited Customers');
  if (panel.panel_data?.why_choose?.secure_management) whyChooseFeatures.push('🔒 Secure Management');

  const panelFeaturesEnabled = [];
  if (panel.panel_data?.features?.user_friendly) panelFeaturesEnabled.push('User-Friendly Interface');
  if (panel.panel_data?.features?.subscription_management) panelFeaturesEnabled.push('Subscription Management');
  if (panel.panel_data?.features?.credit_based) panelFeaturesEnabled.push('Credit-Based System');
  if (panel.panel_data?.features?.reseller_support) panelFeaturesEnabled.push('Reseller Support');
  if (panel.panel_data?.features?.free_applications) panelFeaturesEnabled.push('Free Applications');

  // Add default features if not enough from WP
  const allPanelFeatures = [
    ...panelFeaturesEnabled,
    'Multi-Device Compatibility',
    'EPG Integration',
    'Real-Time Analytics'
  ].slice(0, 8);

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 py-32 pt-64 overflow-hidden -mt-20 pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-0">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/3 flex justify-center">
                {panel._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <div className="relative group">
                    <img 
                      src={panel._embedded['wp:featuredmedia'][0].source_url} 
                      alt={panel._embedded['wp:featuredmedia'][0].alt_text || panel.title.rendered}
                      className="w-72 h-72 object-contain rounded-3xl border-2 border-gray-600/50 p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-72 h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border-2 border-gray-600/50 flex items-center justify-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {panel.title.rendered.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:w-2/3 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 pt-8">
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {panel.title.rendered}
                  </h1>
                  {panel.panel_data?.verified_provider && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/50 rounded-full px-5 py-2 backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-400 text-sm font-semibold">Verified Provider</span>
                    </div>
                  )}
                </div>
                <p className="text-xl text-gray-300 mb-8 max-w-4xl leading-relaxed">
                  {processedExcerpt || 'Premium IPTV panel solution with advanced features and reliable performance.'}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  <button 
                    onClick={handleViewFeatures}
                    className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                  >
                    View Features
                  </button>
                  <button 
                    onClick={handleViewPricing}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                  >
                    View Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {panelStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-lg font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16" ref={featuresRef}>
          {/* Back Link */}
          <div className="mb-12">
            <Link to="/panels" className="text-white hover:text-gray-300 flex items-center gap-3 font-medium text-lg group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to providers
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="mb-12 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max border-b-2 border-gray-800 pb-2">
              <button
                className={`py-3 px-6 font-semibold text-base rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'features'
                    ? 'text-white bg-gray-800 border-b-2 border-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
              <button
                className={`py-3 px-6 font-semibold text-base rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'channels'
                    ? 'text-white bg-gray-800 border-b-2 border-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }`}
                onClick={() => setActiveTab('channels')}
              >
                Channels
              </button>
              <button
                className={`py-3 px-6 font-semibold text-base rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'pricing'
                    ? 'text-white bg-gray-800 border-b-2 border-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }`}
                onClick={() => setActiveTab('pricing')}
              >
                Pricing
              </button>
              <button
                className={`py-3 px-6 font-semibold text-base rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'support'
                    ? 'text-white bg-gray-800 border-b-2 border-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }`}
                onClick={() => setActiveTab('support')}
              >
                Support
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {/* About This Panel */}
                <div className="mb-16" id="features">
                  <h2 className="text-4xl font-bold mb-10">About This Panel</h2>
                  <div className="mb-12 bg-gray-900/40 rounded-2xl p-8 border border-gray-700/50">
                    <HtmlContentWithLinks content={processedContent} />
                  </div>
                  
                  {panelFeatures.length > 0 && (
                    <>
                      <h2 className="text-4xl font-bold mb-10">Key Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {panelFeatures.map((feature, index) => (
                          <div key={index} className="flex items-start gap-5 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-white/40 transition-all duration-300">
                            <div className="mt-1 text-white flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white text-lg font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Why Choose This Panel */}
                {whyChooseFeatures.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-4xl font-bold mb-8">Why Choose {panel.title.rendered}?</h2>
                    <div className="bg-gray-800/50 rounded-2xl p-10 border border-gray-700/50">
                      <div className="grid grid-cols-1 gap-6">
                        {whyChooseFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-5">
                            <span className="text-white text-xl font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel Features Summary */}
                <div>
                  <h2 className="text-4xl font-bold mb-10">Panel Features Summary</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {allPanelFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-5 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-white/40 transition-all duration-300">
                        <div className="text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white text-lg font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Partnership Section */}
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl border border-purple-500/30 p-8 mb-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Trusted Partnership
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-8 text-base leading-relaxed">
                    Powered by <span className="font-bold text-white">BestIPTVReseller</span> - Your trusted partner in IPTV excellence, delivering enterprise-grade solutions with proven reliability.
                  </p>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4 group">
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-3 rounded-xl border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg mb-1">Lightning-Fast Deployment</div>
                        <div className="text-gray-400 text-sm">Get your panel up and running in under 5 minutes with our automated setup wizard</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg mb-1">Enterprise-Grade Security</div>
                        <div className="text-gray-400 text-sm">Bank-level encryption and 99.9% uptime guarantee for your peace of mind</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-3 rounded-xl border border-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg mb-1">24/7 Expert Support</div>
                        <div className="text-gray-400 text-sm">Dedicated support team ready to assist you anytime, anywhere</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">Trusted by 10,000+ Resellers Worldwide</span>
                    </div>
                  </div>
                </div>

                {/* Quality Guarantee */}
                <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50">
                  <h3 className="font-bold text-2xl mb-6 text-center">Quality Guarantee</h3>
                  <div className="flex justify-center gap-12">
                    {panel.panel_data?.quality_guarantee?.money_back_guarantee && (
                      <div className="text-center">
                        <div className="text-white mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Money Back</span>
                      </div>
                    )}
                    {panel.panel_data?.quality_guarantee?.secure_payment && (
                      <div className="text-center">
                        <div className="text-white mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Secure Payment</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <h2 className="text-4xl font-bold mb-12 text-center">Credit Packages & Recharge</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LEFT COLUMN - Pricing Packages */}
                <div>
                  {/* <h3 className="text-2xl font-bold mb-8">Available Packages</h3> */}
                  {creditPackages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {creditPackages.map((pkg, index) => (
                        <div 
                          key={index} 
                          className="relative rounded-2xl border-2 border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm hover:border-white/30 transition-all duration-300 overflow-hidden p-5"
                        >
                          {/* ONE TIME Label */}
                          <div className="text-center mb-2">
                            <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                              One Time
                            </span>
                          </div>

                          {/* Credits Amount */}
                          <div className="text-center mb-3">
                            <h3 className="text-xl font-bold text-white">
                              {pkg.credits} Credits
                            </h3>
                          </div>

                          {/* Price */}
                          <div className="text-center mb-2">
                            <div className="text-4xl font-bold text-white">
                              {pkg.price}
                            </div>
                          </div>

                          {/* Credits = Months */}
                          <div className="text-center mb-4 pb-3 border-b border-gray-700/50">
                            <p className="text-xs font-semibold text-gray-400">
                              {pkg.credits} CREDITS = {pkg.months} MONTHS
                            </p>
                          </div>

                          {/* Features List - Compact */}
                          <ul className="space-y-2 mb-4">
                            {pricingFeatures.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-300 text-xs leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Order Button */}
                          <button 
                            onClick={handleViewPricing}
                            className="w-full py-3 bg-white hover:bg-gray-100 text-black font-bold text-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            ORDER NOW
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-800/40 rounded-2xl border border-gray-700/50">
                      <p className="text-gray-400 text-lg">No pricing packages available.</p>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN - Recharge Form */}
                <div>
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border-2 border-gray-700/50 p-8 sticky top-24">
                    <h3 className="text-2xl font-bold mb-8 text-center text-white">Recharge Panel Credits</h3>
                    
                    {/* Success/Error Messages */}
                    {submitMessage && (
                      <div className={`mb-6 p-4 rounded-xl border-2 ${
                        submitMessage.type === 'success' 
                          ? 'bg-green-900/20 border-green-500 text-green-400' 
                          : 'bg-red-900/20 border-red-500 text-red-400'
                      }`}>
                        <div className="flex items-start gap-3">
                          {submitMessage.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <span className="font-medium text-sm leading-relaxed">{submitMessage.text}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Username Field */}
                    <div className="mb-6">
                      <label className="block text-base font-semibold mb-3 text-white">
                        Panel Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-gray-900/80 border-2 border-gray-600/50 rounded-xl px-5 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 placeholder-gray-500"
                        placeholder="Enter your username"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    {/* WhatsApp Field */}
                    <div className="mb-6">
                      <label className="block text-base font-semibold mb-3 text-white">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-gray-900/80 border-2 border-gray-600/50 rounded-xl px-5 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 placeholder-gray-500"
                        placeholder="+1234567890"
                        disabled={isSubmitting}
                        required
                      />
                      <p className="text-xs text-gray-400 mt-2">Include country code (e.g., +1 for US)</p>
                    </div>
                    
                    {/* Credits Slider */}
                    <div className="mb-8">
                      <label className="block text-base font-semibold mb-4 text-white">
                        Select Package
                      </label>
                      <div className="text-center mb-6">
                        <span className="text-5xl font-bold text-green-400">{credits}</span>
                        <span className="text-xl text-gray-400 ml-2">credits</span>
                        <div className="text-4xl font-bold text-white mt-3">
                          {calculatePrice(credits)}
                        </div>
                      </div>
                      {creditPackages.length > 1 ? (
                        <>
                          <input
                            type="range"
                            min="0"
                            max={creditPackages.length - 1}
                            step="1"
                            value={selectedPackageIndex}
                            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white mb-3"
                            disabled={isSubmitting}
                          />
                          <div className="flex justify-between text-sm text-gray-400 font-medium px-1">
                            {creditPackages.map((pkg, index) => (
                              <span key={index} className="text-xs">
                                {pkg.credits}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : creditPackages.length === 1 ? (
                        <div className="text-center text-gray-400 text-sm py-4 bg-gray-800/50 rounded-lg">
                          Only one package available
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 text-sm py-4 bg-gray-800/50 rounded-lg">
                          No packages available
                        </div>
                      )}
                    </div>
                    
                    {/* Recharge Button */}
                    <button 
                      onClick={handleRechargeSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Recharge Now'
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                      <span className="text-red-500">*</span> Required fields
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
              <div className="lg:col-span-1">
                <h2 className="text-4xl font-bold mb-12">Available Channels</h2>
                
                {/* Search Input */}
                <div className="mb-8">
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900/80 border-2 border-gray-600/50 rounded-xl px-6 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300"
                  />
                </div>
                
                <div className="flex flex-col gap-6">
                  {Object.entries(channelsByCategory)
                    .filter(([category, channelData]) => {
                      if (!searchTerm) return true;
                      return channelData.channels.some(channel => 
                        channel.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                    })
                    .map(([category, channelData]) => {
                      const filteredChannels = searchTerm 
                        ? channelData.channels.filter(channel => 
                            channel.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                        : channelData.channels;
                      
                      if (searchTerm && filteredChannels.length === 0) return null;
                      
                      return (
                        <div key={channelData.id} className="flex flex-col h-full">
                          <div 
                            className="flex justify-between items-center bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:border-white/40"
                            onClick={() => toggleCategory(channelData.name)}
                          >
                            <div className="flex items-center">
                              <img 
                                src={channelData.logo} 
                                alt={channelData.name} 
                                className="w-12 h-12 rounded-xl mr-4 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <div>
                                <h2 className="text-xl font-bold text-white">
                                  {channelData.name}
                                </h2>
                                <span className="text-sm text-gray-400 font-medium">
                                  {searchTerm 
                                    ? `${filteredChannels.length} of ${channelData.channels.length} channels`
                                    : `${channelData.channels.length} channels`
                                  }
                                </span>
                              </div>
                            </div>
                            <svg 
                              className={`w-6 h-6 text-gray-400 transform transition-all duration-300 ${
                                expandedCategories[channelData.name] ? 'rotate-180' : ''
                              }`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          
                          {expandedCategories[channelData.name] && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                              {filteredChannels.map((channel, idx) => (
                                <div 
                                  key={idx} 
                                  className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 transition-all duration-300 hover:border-white/30 hover:scale-105"
                                >
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center mr-4 flex-shrink-0">
                                      <span className="text-white text-sm font-bold">
                                        {idx + 1}
                                      </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-white truncate">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-4xl font-bold mb-12">Support & Resources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  <div className="p-8 bg-gray-800/50 rounded-3xl border border-gray-700/50 hover:border-white/40 transition-all duration-300">
                    <div className="text-white mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Live Chat Support</h3>
                    <p className="text-gray-400 mb-6 text-lg">Get instant help from our support team 24/7</p>
                    <button className="bg-white text-black hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                      Start Chat →
                    </button>
                  </div>
                  
                  <div className="p-8 bg-gray-800/50 rounded-3xl border border-gray-700/50 hover:border-white/40 transition-all duration-300">
                    <div className="text-white mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Documentation</h3>
                    <p className="text-gray-400 mb-6 text-lg">Comprehensive guides and tutorials</p>
                    <button className="bg-white text-black hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                      View Docs →
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-3xl p-10 border border-gray-700/50">
                  <h3 className="text-3xl font-bold mb-8">Frequently Asked Questions</h3>
                  <div className="space-y-6">
                    {[
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
                      <div key={index} className="border-b border-gray-700/50 pb-6">
                        <h4 className="font-bold text-xl mb-3 text-white">{faq.question}</h4>
                        <p className="text-gray-400 text-lg leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-800/40 rounded-3xl border border-gray-700/50 p-8">
                  <h3 className="text-2xl font-bold mb-6">Contact Support</h3>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">Need help? Our support team is here for you.</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-lg font-medium">support@bestiptvreseller.com</span>
                    </div>
                    {panel.panel_data?.whatsapp_number && (
                      <div className="flex items-center gap-4">
                        <div className="text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-lg font-medium">{panel.panel_data.whatsapp_number}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-lg font-medium">24/7 Support</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-8 bg-white text-black hover:bg-gray-100 font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 hover:scale-105">
                    Open Support Ticket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Add CSS for horizontal scroll */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PanelPage;