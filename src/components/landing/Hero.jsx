import React from 'react';

const AnimatedText = ({ text, delay, isRounded = false, noBorderLeft = false }) => (
  <span 
    className={`
      ${isRounded ? 'bg-neon-pink rounded-[20px] md:rounded-[40px] -ml-px' : 'bg-white'} 
      border border-black px-3 md:px-6 py-2 md:py-4 
      ${noBorderLeft ? 'border-l-0' : ''}
      animate-fade-in
    `} 
    style={{ animationDelay: delay, animationFillMode: 'both' }}
  >
    {text}
  </span>
);

const Hero = () => (
  <section className="pt-32 md:pt-40 lg:pt-48 pb-6 md:pb-16 lg:pb-24 px-4 md:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-6 md:mb-10 inline-flex flex-col items-center">
        <div className="flex items-center">
          <AnimatedText text="Share &" delay="0.3s" />
          <AnimatedText text="discover" delay="0.4s" isRounded={true} />
        </div>
        <div className="flex items-center -mt-px">
          <AnimatedText text="study" delay="0.5s" />
          <AnimatedText text="materials" delay="0.6s" noBorderLeft={true} />
        </div>
      </h1>
      <p className="text-sm md:text-base lg:text-[18px] text-black max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        Access handwritten notes, previous year question papers, and study materials shared by your college community.
      </p>
    </div>
  </section>
);

export default Hero;