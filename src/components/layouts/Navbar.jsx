import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavButton from '../ui/NavButton'; // Reusing from previous steps
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-8 left-4 md:left-8 z-[200] flex items-center gap-0">
      {/* Logo Icon */}
      <Link to="/" className="bg-black text-white h-[34px] w-[34px] border border-black flex items-center justify-center hover:bg-neon-pink transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
        </svg>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center">
        <NavButton href="/" active={isActive('/')}>HOME</NavButton>
        <NavButton href="/browse" active={isActive('/browse')}>BROWSE</NavButton>
        
        {isAuthenticated ? (
          <>
            <NavButton href="/upload" active={isActive('/upload')}>UPLOAD</NavButton>
            <NavButton href="/dashboard" active={isActive('/dashboard')}>DASHBOARD</NavButton>
            <NavButton onClick={logout}>SIGN OUT</NavButton>
          </>
        ) : (
          <>
            <NavButton href="/login" active={isActive('/login')}>SIGN IN</NavButton>
            <NavButton href="/signup" active={isActive('/signup')}>SIGN UP</NavButton>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden relative overflow-hidden bg-white text-black h-[34px] px-3 border border-l-0 border-black flex items-center justify-center text-[11px] font-medium uppercase leading-none group"
      >
        <span className="relative z-10">{isMobileOpen ? 'CLOSE' : 'MENU'}</span>
        <span className="absolute inset-0 bg-neon-pink translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 top-[calc(2rem+34px)] bg-white/95 backdrop-blur-sm z-50 p-4 flex flex-col gap-4 md:hidden animate-fade-in border-t border-black">
          <Link to="/" onClick={() => setIsMobileOpen(false)} className="text-xl font-medium">Home</Link>
          <Link to="/browse" onClick={() => setIsMobileOpen(false)} className="text-xl font-medium">Browse</Link>
          {isAuthenticated ? (
            <>
              <Link to="/upload" onClick={() => setIsMobileOpen(false)} className="text-xl font-medium">Upload</Link>
              <Link to="/dashboard" onClick={() => setIsMobileOpen(false)} className="text-xl font-medium">Dashboard</Link>
              <button onClick={() => { logout(); setIsMobileOpen(false); }} className="text-xl font-medium text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileOpen(false)} className="text-xl font-medium">Sign In</Link>
              <Link to="/signup" onClick={() => setIsMobileOpen(false)} className="text-xl font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;