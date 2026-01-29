import React from 'react';

const FilterSection = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium uppercase mb-3">{label}</label>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

const FilterButton = ({ label, isSquare = false }) => (
  <button 
    className={`
      ${isSquare ? 'w-10 h-10' : 'px-3 py-1'} 
      text-sm border border-black transition-colors bg-white hover:bg-gray-50
    `}
  >
    {label}
  </button>
);

const BrowseFilters = () => {
  return (
    <section className="px-4 md:px-8 pb-8 animate-fade-in">
      <div className="max-w-6xl mx-auto border border-black p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Category Column */}
          <FilterSection label="Category">
            {['Assignments', 'Handwritten Notes', 'Lab Manuals', 'Other', 'Question Papers', 'Reference Books'].map((item) => (
              <FilterButton key={item} label={item} />
            ))}
          </FilterSection>

          {/* Type Column */}
          <FilterSection label="Type">
            {['notes', 'question paper', 'other'].map((item) => (
              <FilterButton key={item} label={item} />
            ))}
          </FilterSection>

          {/* Semester Column */}
          <FilterSection label="Semester">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <FilterButton key={sem} label={sem} isSquare={true} />
            ))}
          </FilterSection>

        </div>
      </div>
    </section>
  );
};

export default BrowseFilters;