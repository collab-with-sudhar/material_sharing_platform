import React from 'react';
import FeatureCard from '../ui/FeatureCard';
import { FEATURE_CARDS } from '../../data/mockData';

const ActionGrid = () => (
  <section className="px-4 md:px-8 pb-12">
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
        {FEATURE_CARDS.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  </section>
);

export default ActionGrid;