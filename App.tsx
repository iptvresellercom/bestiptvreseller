import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import FeatureSection from './components/FeatureSection';
import SuperpowersSection from './components/SuperpowersSection';
import AppStore from './components/AppStore';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import PanelPage from './pages/PanelPage';
import PanelsPage from './pages/PanelsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import WordPressPage from './pages/WordPressPage';
import ReviewSection from './components/ReviewSection';
import PremiumResellerHero from './components/PremiumResellerHero';

function App() {
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
                <PremiumResellerHero />
                <AppStore />
                <ReviewSection />
              </>
            } />
            <Route path="/blog/:postSlug" element={<BlogPostPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/panels/:panelSlug" element={<PanelPage />} />
            <Route path="/panels" element={<PanelsPage />} />
            <Route path="/:pageSlug" element={<WordPressPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;