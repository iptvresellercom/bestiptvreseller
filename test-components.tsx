import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import FeatureSection from './components/FeatureSection';
import SuperpowersSection from './components/SuperpowersSection';
import AppStore from './components/AppStore';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import PanelPage from './pages/PanelPage';

// Mock data for testing
const mockPanels = [
  {
    id: 1,
    slug: "premium-iptv-panel",
    title: {
      rendered: "Premium IPTV Panel"
    },
    content: {
      rendered: "<p>Our premium IPTV panel offers the best streaming experience with over 10,000 channels and 50,000 VODs.</p><p>Features include:</p><ul><li>HD and 4K streaming</li><li>EPG support</li><li>VOD library</li><li>Multi-device support</li></ul>"
    },
    panel_data: {
      logo: "https://placehold.co/100x100/333333/FFFFFF?text=PIP"
    },
    _embedded: {
      "wp:featuredmedia": [
        {
          "source_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        }
      ]
    }
  },
  {
    id: 2,
    slug: "ultimate-streaming-solution",
    title: {
      rendered: "Ultimate Streaming Solution"
    },
    content: {
      rendered: "<p>The ultimate streaming solution for resellers and end users alike.</p><p>Key benefits:</p><ul><li>99.9% uptime guarantee</li><li>24/7 customer support</li><li>Easy integration</li><li>Affordable pricing</li></ul>"
    },
    panel_data: {
      logo: "https://placehold.co/100x100/333333/FFFFFF?text=USS"
    },
    _embedded: {
      "wp:featuredmedia": [
        {
          "source_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        }
      ]
    }
  }
];

// Mock the fetch function for testing
(global as any).fetch = (jest.fn((url) => {
  if (url.includes('/wp-json/wp/v2/iptv-panels')) {
    if (url.includes('slug=')) {
      // Return a single panel by slug
      const slug = url.split('slug=')[1].split('&')[0];
      const panel = mockPanels.find(p => p.slug === slug);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(panel ? [panel] : [])
      });
    } else {
      // Return all panels
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPanels)
      });
    }
  }
  return Promise.reject(new Error('Not found'));
}) as any);

const TestApp: React.FC = () => {
  return (
    <Router>
      <div className="bg-black text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProductGrid />
                <FeatureSection />
                <SuperpowersSection />
                <AppStore />
              </>
            } />
            <Route path="/panels/:panelSlug" element={<PanelPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
};

export default TestApp;