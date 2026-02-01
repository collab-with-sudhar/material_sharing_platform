import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layouts/Navbar';
import { X } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <Navbar />
      
      {/* Close button - top right */}
      <Link 
        to="/" 
        className="fixed top-8 right-4 md:right-8 z-[2000] text-white hover:text-neon-pink transition-colors"
      >
        <X className="w-6 h-6" />
      </Link>

      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md animate-fade-in">
          <div className="p-6 md:p-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3 italic">Sign Up</h1>
            <p className="text-gray-400 mb-8">Join the community to share and discover materials</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your name"
                  className="w-full h-14 px-4 bg-[#2a2a2a] border-0 rounded-none text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="your@email.com"
                  className="w-full h-14 px-4 bg-[#2a2a2a] border-0 rounded-none text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full h-14 px-4 bg-[#2a2a2a] border-0 rounded-none text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full h-14 bg-neon-pink text-black font-semibold uppercase tracking-wider hover:bg-pink-400 transition-colors mt-4"
              >
                Create Account
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <Link to="/login" className="text-neon-pink hover:text-pink-400 transition-colors">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;