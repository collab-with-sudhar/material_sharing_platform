import React from 'react';
import { ArrowRight } from 'lucide-react';

const RotatingBadge = () => (
  <div className="fixed top-4 right-4 md:top-8 md:right-8 w-[60px] h-[60px] md:w-[72px] md:h-[72px] lg:w-[154px] lg:h-[154px] cursor-pointer z-40 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
    <div className="w-full h-full animate-spin-slow">
      <div className="w-full h-full rounded-full border border-black bg-white/10 absolute inset-0" />
      <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
        <defs>
          <path id="circlePath" d="M 100, 30 a 70,70 0 1,1 0,140 a 70,70 0 1,1 0,-140" />
        </defs>
        {[0, 20, 40, 60, 80].map((offset) => (
          <text key={offset} className="text-[16px] font-bold uppercase" fill="black">
            <textPath href="#circlePath" startOffset={`${offset}%`}>EXPLORE</textPath>
          </text>
        ))}
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-12 lg:h-12 rotate-90" />
    </div>
  </div>
);

export default RotatingBadge;