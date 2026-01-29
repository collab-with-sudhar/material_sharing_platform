import React, { useState } from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import BrowseHeader from '../components/browse/BrowseHeader';
import BrowseFilters from '../components/browse/BrowseFilters'; // Import new component
import BrowseGrid from '../components/browse/BrowseGrid';

const Browse = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar />
      
      <main>
        <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <BrowseHeader 
            showFilters={showFilters} 
            toggleFilters={() => setShowFilters(!showFilters)} 
          />
          
          {/* Conditionally render the filters */}
          {showFilters && <BrowseFilters />}
          
          <BrowseGrid />
        </div>
      </main>
    </div>
  );
};

export default Browse;