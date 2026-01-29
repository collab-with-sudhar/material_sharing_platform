import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-9xl font-bold text-gray-100 select-none">404</h1>
        <div className="absolute animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-medium mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-medium uppercase hover:bg-neon-pink hover:text-black transition-colors border border-black">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;