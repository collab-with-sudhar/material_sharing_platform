import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * PublicRoute component
 * Redirects authenticated users away from auth pages (login/signup)
 * Prevents authenticated users from accessing login/signup
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, initialCheckDone } = useAuth();

  // Show loading spinner during initial auth check
  if (!initialCheckDone || loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-pink animate-spin" />
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render public content (login/signup pages)
  return children;
};

export default PublicRoute;
