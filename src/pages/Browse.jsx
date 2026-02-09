import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import BrowseHeader from '../components/browse/BrowseHeader';
import BrowseFilters from '../components/browse/BrowseFilters';
import BrowseGrid from '../components/browse/BrowseGrid';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    department: '',
    semester: '',
    search: ''
  });

  // Read category from URL query params on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
      setShowFilters(true); // Show filters if coming from category link
    }
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({
        category: '',
        department: '',
        semester: '',
        search: ''
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar />
      
      <main>
        <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <BrowseHeader 
            showFilters={showFilters} 
            toggleFilters={() => setShowFilters(!showFilters)}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          {/* Conditionally render the filters */}
          {showFilters && (
            <BrowseFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}
          
          <BrowseGrid filters={filters} />
        </div>
      </main>
    </div>
  );
};

export default Browse;