import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layouts/Navbar';

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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md animate-fade-in">
          <div className="border border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-medium mb-2">Create an account</h1>
            <p className="text-gray-500 mb-8">Join the community to share and discover materials</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase">Full Name</label>
                <input 
                  type="text" required
                  className="w-full h-12 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase">Email</label>
                <input 
                  type="email" required
                  className="w-full h-12 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase">Password</label>
                <input 
                  type="password" required
                  className="w-full h-12 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <button type="submit" className="w-full h-12 bg-black text-white font-medium uppercase hover:bg-neon-pink hover:text-black transition-colors border border-black mt-2">
                Create Account
              </button>
            </form>
            <div className="mt-6 text-center text-sm">
              Already have an account? <Link to="/login" className="underline font-medium hover:text-neon-pink">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;