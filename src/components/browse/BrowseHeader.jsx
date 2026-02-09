import React from 'react';
import { Search, Filter } from 'lucide-react';

const BrowseHeader = ({ showFilters, toggleFilters, filters, onFilterChange }) => {
  return (
    <section className="pt-32 md:pt-40 pb-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          Browse Materials
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={filters?.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="flex w-full rounded-md border bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 border-black h-12" 
              placeholder="Search by title, subject..." 
            />
          </div>
          
          {/* Filter Button - Updated Styles */}
          <button 
            onClick={toggleFilters}
            className={`
              flex items-center justify-center gap-2 px-6 h-12 border border-black font-medium uppercase text-sm transition-colors 
              ${showFilters ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'}
            `}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseHeader;