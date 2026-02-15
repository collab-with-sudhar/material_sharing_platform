import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavButton from '../ui/NavButton';
import { X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <>
      <nav className="fixed top-8 left-4 md:left-8 z-[2000] flex items-center gap-0">
        {/* Logo Icon */}
        <Link to="/" className="bg-black h-[34px] w-[34px] border border-black flex items-center justify-center hover:bg-neon-pink transition-colors overflow-hidden rounded-md">
          <img 
            src="/logo.png" 
            alt="TCE Materials Logo" 
            className="w-full h-full object-cover"
          />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <NavButton href="/" active={isActive('/')}>HOME</NavButton>
          <NavButton href="/browse" active={isActive('/browse')}>BROWSE</NavButton>
          
          {isAuthenticated ? (
            <>
              <NavButton href="/upload" active={isActive('/upload')}>UPLOAD</NavButton>
              <NavButton href="/dashboard" active={isActive('/dashboard')}>DASHBOARD</NavButton>
              <NavButton onClick={handleLogout}>SIGN OUT</NavButton>
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
          <span className="relative z-10">MENU</span>
          <span className="absolute inset-0 bg-neon-pink translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
        </button>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[3000] md:hidden animate-fade-in">
          {/* Close Button Header - Black background */}
          <div className="bg-black h-32 flex items-center justify-center">
            <button 
              onClick={closeMobileMenu}
              className="text-neon-pink text-sm font-medium uppercase tracking-wider"
            >
              CLOSE
            </button>
          </div>
          
          {/* Menu Items - White background */}
          <div className="bg-white flex-1 h-[calc(100vh-8rem)] flex flex-col">
            <Link 
              to="/" 
              onClick={closeMobileMenu} 
              className="flex-1 flex items-center justify-center border-b border-gray-200 text-lg font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              HOME
            </Link>
            <Link 
              to="/browse" 
              onClick={closeMobileMenu} 
              className="flex-1 flex items-center justify-center border-b border-gray-200 text-lg font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              BROWSE
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/upload" 
                  onClick={closeMobileMenu} 
                  className="flex-1 flex items-center justify-center border-b border-gray-200 text-lg font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  UPLOAD
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={closeMobileMenu} 
                  className="flex-1 flex items-center justify-center border-b border-gray-200 text-lg font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  DASHBOARD
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex-1 flex items-center justify-center text-lg font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu} 
                  className="flex-1 flex items-center justify-center border-b border-gray-200 text-lg font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  SIGN IN
                </Link>
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu} 
                  className="flex-1 flex items-center justify-center text-lg font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;