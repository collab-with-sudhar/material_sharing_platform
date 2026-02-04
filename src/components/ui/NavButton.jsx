import React from 'react';
import { Link } from 'react-router-dom';

const NavButton = ({ children, href, active, onClick }) => {
  if (href) {
    return (
      <Link 
        to={href}
        className={`relative overflow-hidden bg-white text-black h-[34px] px-3 flex items-center text-[11px] font-medium uppercase border border-black leading-none group ${active ? '' : 'border-l-0'}`}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 bg-neon-pink translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
      </Link>
    );
  }
  
  return (
    <button 
      onClick={onClick}
      className={`relative overflow-hidden bg-white text-black h-[34px] px-3 flex items-center text-[11px] font-medium uppercase border border-black leading-none group border-l-0`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-neon-pink translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
    </button>
  );
};

export default NavButton;