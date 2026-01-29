import React from 'react';

const NavButton = ({ children, href, active, onClick }) => {
  const Component = href ? 'a' : 'button';
  
  return (
    <Component 
      href={href}
      onClick={onClick}
      className={`relative overflow-hidden bg-white text-black h-[34px] px-3 flex items-center text-[11px] font-medium uppercase border border-black leading-none group ${active ? '' : 'border-l-0'}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-neon-pink translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
    </Component>
  );
};

export default NavButton;