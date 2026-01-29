import React from 'react';
import CategoryCard from '../ui/CategoryCard';
import { CATEGORIES } from '../../data/mockData';

const CategoryGrid = () => (
  <section className="px-4 md:px-8 py-16">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-medium mb-8 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
        Browse by Category
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, index) => (
          <CategoryCard 
            key={cat.id} 
            {...cat} 
            delay={`${1 + (index * 0.1)}s`} 
          />
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;