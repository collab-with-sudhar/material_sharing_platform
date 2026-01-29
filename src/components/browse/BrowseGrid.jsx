import React from 'react';
import MaterialCard from '../ui/MaterialCard';
import { MATERIALS } from '../../data/mockData';

const BrowseGrid = () => {
  return (
    <section className="px-4 md:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MATERIALS.map((material, index) => (
            <MaterialCard 
              key={material.id} 
              {...material} 
              delay={`${0.4 + (index * 0.1)}s`} // Staggered animation
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseGrid;