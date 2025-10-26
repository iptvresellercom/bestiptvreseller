import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

interface WordPressPage {
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
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text?: string;
    }[];
  };
}

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

// Function to convert absolute WordPress URLs to relative paths
const convertAbsoluteUrlsToRelative = (content: string): string => {
  // Convert absolute URLs to relative paths
  return content
    .replace(/https?:\/\/[^\/]*blrparis\.com\/wp-content\/uploads\//g, '/wp-content/uploads/')
    .replace(/https?:\/\/[^\/]*blrparis\.com\//g, '/')
    .replace(/https?:\/\/[^\/]*reselleriptv\.com\//g, '/');
};

// Custom component to render HTML content with client-side navigation
const HtmlContentWithLinks: React.FC<{ content: string }> = ({ content }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
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

const WordPressPage: React.FC = () => {
  const { pageSlug } = useParams<{ pageSlug: string }>();
  const [page, setPage] = useState<WordPressPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // List of reserved slugs that should not be handled by this component
    const reservedSlugs = ['blog', 'panels'];
    
    // If the slug is reserved, don't try to fetch it as a WordPress page
    if (pageSlug && reservedSlugs.includes(pageSlug)) {
      setError('Page not found');
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        // Fetch the specific page by slug
        const response = await fetch(`https://blrparis.com/wp-json/wp/v2/pages?slug=${pageSlug}&_embed`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: WordPressPage[] = await response.json();
        
        if (data.length > 0) {
          setPage(data[0]);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (pageSlug) {
      fetchPage();
    }
  }, [pageSlug]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p className="text-white/70">Loading page...</p>
            </div>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
              <p className="text-white/70 mb-6">{error || 'Page not found'}</p>
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

  // Process the content to use relative URLs
  const processedContent = convertHtmlUrlsToRelative(page.content.rendered);
  
  // Process the excerpt for relative URLs
  const parser = new DOMParser();
  const excerptText = page.excerpt?.rendered ? 
    parser.parseFromString(page.excerpt.rendered, 'text/html').body.textContent || '' : 
    'Learn more about our services and offerings';

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Behind Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-black py-32 pt-44 overflow-hidden -mt-20 pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-0">
            <div className="text-center pt-20">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{page.title.rendered}</h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-16" id="content">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <HtmlContentWithLinks content={processedContent} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default WordPressPage;