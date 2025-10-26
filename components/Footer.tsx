import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GitHubIcon } from './icons/GitHubIcon';
import { RedditIcon } from './icons/RedditIcon';
import { TelegramIcon } from './icons/TelegramIcon';
import { TwitterIcon } from './icons/TwitterIcon';

// Define the menu item interface
interface MenuItem {
  id: number;
  name: string;
  href: string;
  menu_item_parent: string;
  icon_image: string;
  children: MenuItem[];
}

const FooterLink: React.FC<{href: string, children: React.ReactNode}> = ({ href, children }) => (
    <a href={href} className="text-[15px] text-white/80 hover:text-white transition-colors duration-200">{children}</a>
);

const FooterHeader: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-5">{children}</h3>
);

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

const Footer: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch menu items from WordPress API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://blrparis.com/wp-json/wp/v2/menu/footer-menu');
        if (response.ok) {
          const data: MenuItem[] = await response.json();
          // Convert URLs to relative slugs
          const processedMenuItems = data.map(item => ({
            ...item,
            href: convertWordPressUrlToRelativeSlug(item.href)
          }));
          setMenuItems(processedMenuItems);
        }
      } catch (error) {
        console.error('Error fetching footer menu:', error);
        // Fallback to hardcoded menu if API fails
        setMenuItems([
          { id: 1, name: 'Privacy Policy', href: '/privacy-policy/', menu_item_parent: '0', icon_image: '', children: [] },
          { id: 2, name: 'Disclaimer', href: '/disclaimer/', menu_item_parent: '0', icon_image: '', children: [] },
          { id: 3, name: 'Cookies Policy', href: '/cookies-policy/', menu_item_parent: '0', icon_image: '', children: [] },
          { id: 4, name: 'Terms of use', href: '/terms-of-use/', menu_item_parent: '0', icon_image: '', children: [] },
          { id: 5, name: 'About us', href: '/about-us/', menu_item_parent: '0', icon_image: '', children: [] }
        ]);
      }
    };

    fetchMenu();
  }, []);

  return (
    <footer className="bg-black pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="border-t border-white/10 my-10"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <a href="#" className="text-white/50 hover:text-white transition-colors"><TwitterIcon /></a>
            <a href="#" className="text-white/50 hover:text-white transition-colors"><GitHubIcon /></a>
            <a href="#" className="text-white/50 hover:text-white transition-colors"><RedditIcon /></a>
            <a href="#" className="text-white/50 hover:text-white transition-colors"><TelegramIcon /></a>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/50">
            {menuItems.map((item) => (
              <Link key={item.id} to={item.href} className="hover:text-white/80">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="text-xs text-white/50">
            © {new Date().getFullYear()} BITR. Made with <span className="text-red-500">❤️</span>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-white/30 max-w-3xl mx-auto leading-relaxed">
           BITR is not responsible for third-party apps. Their developers are solely responsible for their performance, features, and security.
        </div>
      </div>
    </footer>
  );
};

export default Footer;