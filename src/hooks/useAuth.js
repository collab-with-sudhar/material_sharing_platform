import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  loginUser,
  registerUser,
  googleLogin,
  logoutUser,
  checkAuth,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectInitialCheckDone,
} from '../store/slices/authSlice';

/**
 * Custom hook for authentication with Redux
 * Provides a clean API for auth operations
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const initialCheckDone = useSelector(selectInitialCheckDone);

  // Check authentication status on mount
  useEffect(() => {
    if (!initialCheckDone) {
      dispatch(checkAuth());
    }
  }, [dispatch, initialCheckDone]);

  // Login handler
  const login = async (email, password) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // After successful login, fetch full user details
      await dispatch(checkAuth());
      return true;
    } catch {
      return false;
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      // After successful registration, fetch full user details
      await dispatch(checkAuth());
      return true;
    } catch {
      return false;
    }
  };

  // Google login handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      await dispatch(googleLogin(credentialResponse)).unwrap();
      // After successful login, fetch full user details
      await dispatch(checkAuth());
      return true;
    } catch {
      return false;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  // Clear error handler
  const clearAuthError = () => {
    dispatch(clearError());
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      await dispatch(checkAuth()).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    initialCheckDone,
    auth,
    
    // Actions
    login,
    register,
    googleLogin: handleGoogleLogin,
    logout,
    clearError: clearAuthError,
    refreshUser,
  };
};

export default useAuth;
