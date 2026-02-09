import React from 'react';

const FilterSection = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium uppercase mb-3">{label}</label>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

const FilterButton = ({ label, isSquare = false, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      ${isSquare ? 'w-10 h-10' : 'px-3 py-1'} 
      text-sm border border-black transition-colors
      ${isActive ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}
    `}
  >
    {label}
  </button>
);

const BrowseFilters = ({ filters, onFilterChange }) => {
  const categories = ['Notes', 'Question Paper', 'Assignment'];
  const departments = ['IT', 'CSE', 'EEE', 'ECE', 'CIVIL', 'MECH', 'CSBS', 'ARCH', 'DATA SCIENCE', 'AIML'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleCategoryClick = (category) => {
    onFilterChange('category', filters.category === category ? '' : category);
  };

  const handleDepartmentClick = (department) => {
    onFilterChange('department', filters.department === department ? '' : department);
  };

  const handleSemesterClick = (semester) => {
    const semValue = `Semester ${semester}`;
    onFilterChange('semester', filters.semester === semValue ? '' : semValue);
  };

  const handleClearAll = () => {
    onFilterChange('clear');
  };

  return (
    <section className="px-4 md:px-8 pb-8 animate-fade-in">
      <div className="max-w-6xl mx-auto border border-black p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium uppercase">Filters</h2>
          <button 
            onClick={handleClearAll}
            className="text-xs uppercase text-gray-600 hover:text-black transition-colors"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Category Column */}
          <FilterSection label="Category">
            {categories.map((item) => (
              <FilterButton 
                key={item} 
                label={item} 
                isActive={filters.category === item}
                onClick={() => handleCategoryClick(item)}
              />
            ))}
          </FilterSection>

          {/* Department Column */}
          <FilterSection label="Department">
            {departments.map((item) => (
              <FilterButton 
                key={item} 
                label={item}
                isActive={filters.department === item}
                onClick={() => handleDepartmentClick(item)}
              />
            ))}
          </FilterSection>

          {/* Semester Column */}
          <FilterSection label="Semester">
            {semesters.map((sem) => (
              <FilterButton 
                key={sem} 
                label={sem} 
                isSquare={true}
                isActive={filters.semester === `Semester ${sem}`}
                onClick={() => handleSemesterClick(sem)}
              />
            ))}
          </FilterSection>

        </div>
      </div>
    </section>
  );
};

export default BrowseFilters;