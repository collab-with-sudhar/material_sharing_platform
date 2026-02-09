import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import Navbar from '../components/layouts/Navbar';
import { X, Loader2 } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, googleLoginHandler, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await signup(formData);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    try {
      const success = await googleLoginHandler(credentialResponse);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign Up Failed');
  };

  // Show loading state during initial auth check
  if (loading && !isSubmitting) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-pink animate-spin" />
      </div>
    );
  }

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
            <p className="text-gray-400 mb-8">Join to upload materials and help your fellow mates</p>
            
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
                disabled={isSubmitting}
                className="w-full h-14 bg-neon-pink text-black font-semibold uppercase tracking-wider hover:bg-pink-400 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1a1a] text-gray-400">OR</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                size="large"
                text="signup_with"
                shape="rectangular"
                width={350}
              />
            </div>
            
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