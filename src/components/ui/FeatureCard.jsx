import React from 'react';

const FeatureCard = ({ icon: Icon, title, subtitle, href }) => (
  <a 
    href={href || "#"}
    className="group relative overflow-hidden border border-black p-6 flex items-center gap-4 hover:bg-black transition-colors duration-300"
  >
    <Icon className="w-6 h-6 group-hover:text-white transition-colors" />
    <div>
      <h3 className="font-medium group-hover:text-white transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">{subtitle}</p>
    </div>
  </a>
);

export default FeatureCard;