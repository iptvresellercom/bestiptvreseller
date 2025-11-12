import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BITRIcon } from './icons/BITRIcon';

// Define the menu item interface
interface MenuItem {
  id: number;
  name: string;
  href: string;
  menu_item_parent: string;
  icon_image: string;
  children: MenuItem[];
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

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  // Check if the href is an external link
  if (href.startsWith('http')) {
    return (
      <a 
        href={href} 
        className="text-sm text-white hover:opacity-75 transition-opacity duration-200"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  
  // For internal links, use React Router Link
  return (
    <Link to={convertWordPressUrlToRelativeSlug(href)} className="text-sm text-white hover:opacity-75 transition-opacity duration-200">
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Fetch menu items from WordPress API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://www.blrparis.com/wp-json/wp/v2/menu/main');
        if (response.ok) {
          const data: MenuItem[] = await response.json();
          // Convert URLs to relative slugs for non-external links
          const processedMenuItems = data.map(item => {
            // Process the main item
            const processedItem = {
              ...item,
              href: item.href.startsWith('http') && (item.href.includes('blrparis.com') || item.href.includes('reselleriptv.com')) 
                ? convertWordPressUrlToRelativeSlug(item.href) 
                : item.href
            };
            
            // Process children if they exist
            if (processedItem.children && processedItem.children.length > 0) {
              processedItem.children = processedItem.children.map(child => ({
                ...child,
                href: child.href.startsWith('http') && (child.href.includes('blrparis.com') || child.href.includes('reselleriptv.com')) 
                  ? convertWordPressUrlToRelativeSlug(child.href) 
                  : child.href
              }));
            }
            
            return processedItem;
          });
          setMenuItems(processedMenuItems);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        // Fallback to hardcoded menu if API fails
        setMenuItems([
          { id: 1, name: 'Home', href: '/', menu_item_parent: '0', icon_image: '', children: [] },
          { id: 2, name: 'Channels', href: '/channels', menu_item_parent: '0', icon_image: '', children: [] },
          { id: 3, name: 'Panels', href: '/panels', menu_item_parent: '0', icon_image: '', children: [] },
          { 
            id: 4, 
            name: 'Tools', 
            href: '#', 
            menu_item_parent: '0', 
            icon_image: '', 
            children: [
              { id: 5, name: 'MP3 Player', href: 'https://mp3.iptvreseller.space', menu_item_parent: '4', icon_image: '', children: [] }
            ] 
          },
          { id: 6, name: 'Contact', href: '/contact', menu_item_parent: '0', icon_image: '', children: [] }
        ]);
      }
    };

    fetchMenu();
  }, []);

  // Render a single menu item
  const renderMenuItem = (item: MenuItem) => {
    // Check if this is an external link
    const isExternal = item.href.startsWith('http');
    
    if (item.children && item.children.length > 0) {
      return (
        <div key={item.id} className="relative group">
          {isExternal ? (
            <a 
              href={item.href} 
              className="flex items-center gap-1 text-sm text-white hover:opacity-75 transition-opacity duration-200 cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          ) : (
            <span className="flex items-center gap-1 text-sm text-white hover:opacity-75 transition-opacity duration-200 cursor-pointer">
              {item.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-1">
            {item.children.map((child) => {
              const isChildExternal = child.href.startsWith('http');
              return isChildExternal ? (
                <a 
                  key={child.id} 
                  href={child.href} 
                  className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {child.name}
                </a>
              ) : (
                <Link 
                  key={child.id} 
                  to={convertWordPressUrlToRelativeSlug(child.href)} 
                  className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-md"
                >
                  {child.name}
                </Link>

              );
            })}
          </div>
        </div>
      );
    }

    // For items without children
    if (isExternal) {
      return (
        <a 
          key={item.id} 
          href={item.href} 
          className="text-sm text-white hover:opacity-75 transition-opacity duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.name}
        </a>
      );
    }

    return (
      <NavLink key={item.id} href={convertWordPressUrlToRelativeSlug(item.href)}>
        {item.name}
      </NavLink>
    );
  };

  return (
    <header className="fixed top-4 w-full flex justify-center z-50 px-4">
      <nav className={`
        w-full max-w-5xl rounded-full flex items-center justify-between gap-6 px-6 py-2 border 
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-gradient-to-r from-black via-blue-950/40 to-black backdrop-blur-md border-blue-900/30' 
          : 'bg-gradient-to-r from-black via-blue-950/40 to-black border-blue-900/30'
        }
      `}>
        <Link to="/" aria-label="BITR Home" className="p-1">
          <BITRIcon />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center gap-6">
          {menuItems.map(renderMenuItem)}
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="xl:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay - Fixed positioning */}
            <div 
              className="xl:hidden fixed inset-0 bg-black/70 z-[100] animate-slide-down"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            ></div>
            
            {/* Menu Drawer - Fixed positioning with solid background */}
            <div 
              className="xl:hidden fixed top-0 right-0 bottom-0 w-80 bg-[#0f172a] z-[101] flex flex-col shadow-2xl animate-slide-in-right overflow-hidden"
              style={{ 
                position: 'fixed',
                height: '100vh',
                maxHeight: '100vh'
              }}
            >
              {/* Header - Solid background */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-[#0f172a] flex-shrink-0">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Menu</h2>
                <button 
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Items - Scrollable with solid background */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#0f172a]">
                <div className="flex flex-col gap-2">
                  {menuItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="w-full"
                      style={{ 
                        animation: `slideInRight 0.3s ease-out ${index * 0.05}s both` 
                      }}
                    >
                      <div className="flex flex-col">
                        {/* Main Menu Item */}
                        <div className="group">
                          {item.href.startsWith('http') ? (
                            <a
                              href={item.href}
                              className="flex items-center justify-between px-4 py-3 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 group-hover:pl-6"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="text-base">{item.name}</span>
                              {item.children && item.children.length > 0 && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </a>
                          ) : (
                            <Link
                              to={convertWordPressUrlToRelativeSlug(item.href)}
                              className="flex items-center justify-between px-4 py-3 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 group-hover:pl-6"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="text-base">{item.name}</span>
                              {item.children && item.children.length > 0 && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </Link>
                          )}
                        </div>
                        
                        {/* Sub Menu Items */}
                        {item.children && item.children.length > 0 && (
                          <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-700/50 pl-4">
                            {item.children.map((child) => {
                              const isChildExternal = child.href.startsWith('http');
                              return (
                                <div key={child.id}>
                                  {isChildExternal ? (
                                    <a 
                                      href={child.href} 
                                      className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {child.name}
                                    </a>
                                  ) : (
                                    <Link 
                                      to={convertWordPressUrlToRelativeSlug(child.href)} 
                                      className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {child.name}
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer - Solid background */}
              <div className="p-6 border-t border-gray-700/50 bg-[#0f172a] flex-shrink-0">
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-white text-black text-center font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>
      
      {/* Keyframes for animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slideInFromRight 0.3s ease-out;
        }
        
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-down {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
