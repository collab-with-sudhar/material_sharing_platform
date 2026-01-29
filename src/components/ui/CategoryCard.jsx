import React from 'react';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ icon: Icon, title, subtitle, href, delay }) => (
  <div className="animate-fade-in" style={{ animationDelay: delay, animationFillMode: 'both' }}>
    <a 
      href={href || "#"}
      className="group relative border border-black p-6 flex flex-col gap-4 hover:bg-black transition-colors duration-300 h-full"
    >
      <div className="text-black group-hover:text-neon-pink transition-colors">
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium text-lg group-hover:text-white transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium group-hover:text-neon-pink transition-colors">
        <span>Browse</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  </div>
);

export default CategoryCard;