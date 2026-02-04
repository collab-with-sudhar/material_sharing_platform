import React from 'react';

// Layout Components
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import RotatingBadge from '../components/ui/RotatingBadge';

// Landing Page Specific Components
import Hero from '../components/landing/Hero';
import RecentMaterials from '../components/landing/RecentMaterials';
import ActionGrid from '../components/landing/ActionGrid';
import MaterialTicker from '../components/landing/MaterialTicker';
import CategoryGrid from '../components/landing/CategoryGrid';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      <Navbar />
      
      
      <main>
        <Hero />
        <ActionGrid />
        <RecentMaterials />
        
        <CategoryGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;