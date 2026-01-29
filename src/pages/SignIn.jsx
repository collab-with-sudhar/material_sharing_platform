import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layouts/Navbar';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="border border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-medium mb-2">Welcome back</h1>
            <p className="text-gray-500 mb-8">Enter your credentials to access your account</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all"
                  placeholder="name@example.com" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium uppercase">Password</label>
                  <a href="#" className="text-xs text-gray-500 hover:text-black">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all"
                  placeholder="••••••••" 
                />
              </div>
              
              <button type="submit" className="w-full h-12 bg-black text-white font-medium uppercase hover:bg-neon-pink hover:text-black transition-colors border border-black mt-2">
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              Don't have an account? <Link to="/signup" className="underline font-medium hover:text-neon-pink">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;