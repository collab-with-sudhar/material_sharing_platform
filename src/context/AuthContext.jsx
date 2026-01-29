import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Simulating auth state. In real app, check localStorage or Cookie here.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // TODO: Replace with real Backend API call
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ name: 'Student User', email });
      toast.success('Successfully signed in!');
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const signup = (data) => {
    // TODO: Replace with real Backend API call
    setIsAuthenticated(true);
    setUser({ name: data.name, email: data.email });
    toast.success('Account created successfully!');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);