import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import BrowseHeader from '../components/browse/BrowseHeader';
import BrowseFilters from '../components/browse/BrowseFilters';
import BrowseGrid from '../components/browse/BrowseGrid';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    department: '',
    semester: '',
    search: ''
  });

  const departments = ['IT', 'CSE', 'EEE', 'ECE', 'CIVIL', 'MECH', 'CSBS', 'ARCH', 'DATA SCIENCE', 'AIML'];

  // Check if department is already selected in session storage
  useEffect(() => {
    // Use generic key for guest users, will be cleared on login/logout
    const savedDepartment = sessionStorage.getItem('selectedDepartment');
    if (savedDepartment) {
      setFilters(prev => ({ ...prev, department: savedDepartment }));
    } else {
      // Show department modal only if no department is selected
      const categoryFromUrl = searchParams.get('category');
      if (!categoryFromUrl) {
        setShowDepartmentModal(true);
      }
    }
  }, [searchParams]);

  // Read category from URL query params on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
      setShowFilters(true); // Show filters if coming from category link
    }
  }, [searchParams]);

  const handleDepartmentSelect = (department) => {
    setFilters(prev => ({ ...prev, department }));
    sessionStorage.setItem('selectedDepartment', department);
    setShowDepartmentModal(false);
    setShowFilters(true);
  };

  const handleSkipDepartment = () => {
    setShowDepartmentModal(false);
  };

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
      
      {/* Department Selection Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-8 relative animate-fade-in">
            <button
              onClick={handleSkipDepartment}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-medium mb-2">Select Your Department</h2>
            <p className="text-gray-600 mb-6">Choose your department to see relevant materials</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => handleDepartmentSelect(dept)}
                  className="px-4 py-3 border border-black hover:bg-black hover:text-white transition-colors font-medium text-sm"
                >
                  {dept}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleSkipDepartment}
              className="mt-6 w-full py-3 text-sm text-gray-600 hover:text-black transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
      
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