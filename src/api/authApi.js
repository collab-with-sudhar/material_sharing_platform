import apiClient from './axios';

// Regular email/password login
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/api/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Google login - sends user data directly (decoded by Google SDK on frontend)
export const googleLogin = async (userData) => {
  try {
    const response = await apiClient.post('/api/users/auth/google', {
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      googleId: userData.googleId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Google login failed');
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const response = await apiClient.get('/api/users/logout');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};
