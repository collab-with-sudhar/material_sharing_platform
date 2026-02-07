import apiClient from './axios';

// Get all materials with filters
export const getMaterials = async (params) => {
  try {
    const response = await apiClient.get('/api/materials', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch materials');
  }
};

// Get single material by ID
export const getMaterialById = async (id) => {
  try {
    const response = await apiClient.get(`/api/materials/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch material');
  }
};

// Upload new material
export const uploadMaterial = async (formData) => {
  try {
    const response = await apiClient.post('/api/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload material');
  }
};

// Update material
export const updateMaterial = async (id, data) => {
  try {
    const response = await apiClient.put(`/api/materials/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update material');
  }
};

// Delete material
export const deleteMaterial = async (id) => {
  try {
    const response = await apiClient.delete(`/api/materials/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete material');
  }
};

// Toggle save/unsave material
export const toggleSaveMaterial = async (id) => {
  try {
    const response = await apiClient.post(`/api/materials/${id}/save`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save/unsave material');
  }
};

// Get saved materials
export const getSavedMaterials = async () => {
  try {
    const response = await apiClient.get('/api/materials/saved');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch saved materials');
  }
};

// Get user's uploaded materials
export const getMyUploads = async () => {
  try {
    const response = await apiClient.get('/api/materials/my-uploads');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch uploads');
  }
};

// Track material download
export const trackDownload = async (id) => {
  try {
    const response = await apiClient.post(`/api/materials/${id}/download`);
    return response.data;
  } catch (error) {
    // Silent fail - don't throw error for tracking
    console.warn('Failed to track download:', error);
  }
};
