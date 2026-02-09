import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.loginUser(email, password);
      if (response.success) {
        setIsAuthenticated(true);
        await checkAuth(); // Fetch full user details
        
        // Clear generic department key (if exists from guest browsing)
        sessionStorage.removeItem('selectedDepartment');
        
        toast.success('Successfully signed in!');
        return true;
      }
      toast.error('Invalid credentials');
      return false;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const googleLoginHandler = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error('Google did not return a credential.');
        return false;
      }

      // Decode JWT credential from Google
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const userData = JSON.parse(jsonPayload);
      
      // Extract user information from decoded token
      const googleUserData = {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        googleId: userData.sub,
      };

      const response = await authApi.googleLogin(googleUserData);
      if (response.success) {
        setIsAuthenticated(true);
        await checkAuth(); // Fetch full user details
        
        // Clear generic department key (if exists from guest browsing)
        sessionStorage.removeItem('selectedDepartment');
        
        toast.success('Google login successful!');
        return true;
      }
      toast.error('Google login failed');
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed');
      return false;
    }
  };

  const signup = async (data) => {
    try {
      const response = await authApi.registerUser(data);
      if (response.success) {
        toast.success('Account created successfully! Please sign in.');
        return true;
      }
      toast.error('Registration failed');
      return false;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logoutUser();
      
      // Clear all department preferences on logout
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('selectedDepartment')) {
          sessionStorage.removeItem(key);
        }
      });
      
      setIsAuthenticated(false);
      setUser(null);
      toast.info('Signed out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading,
      login, 
      googleLoginHandler,
      signup, 
      logout,
      refreshUser,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);