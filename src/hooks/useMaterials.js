import { useState, useEffect, useCallback } from 'react';
import * as materialApi from '../api/materialApi';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export const useMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMaterials: 0,
  });

  const fetchMaterials = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await materialApi.getMaterials(params);
      setMaterials(data.materials || []);
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalMaterials: data.totalMaterials || 0,
      });
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    materials,
    loading,
    error,
    pagination,
    fetchMaterials,
    setMaterials,
  };
};

export const useMaterial = (materialId) => {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchMaterial = useCallback(async () => {
    if (!materialId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await materialApi.getMaterialById(materialId);
      setMaterial(data.material);
      return data.material;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  const toggleSave = useCallback(async () => {
    if (!materialId) return;
    
    try {
      const data = await materialApi.toggleSaveMaterial(materialId);
      toast.success(data.message);
      // Update local material state
      setMaterial(prev => prev ? { ...prev, isSaved: data.isSaved } : null);
      return data.isSaved;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [materialId]);

  const trackDownload = useCallback(async () => {
    if (!materialId) return;
    await materialApi.trackDownload(materialId);
  }, [materialId]);

  const deleteMaterial = useCallback(async () => {
    if (!materialId) return;
    
    try {
      const data = await materialApi.deleteMaterial(materialId);
      toast.success(data.message);
      return true;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [materialId]);

  useEffect(() => {
    if (materialId) {
      fetchMaterial();
    }
  }, [materialId, fetchMaterial]);

  return {
    material,
    loading,
    error,
    fetchMaterial,
    toggleSave,
    trackDownload,
    deleteMaterial,
  };
};

export const useSavedMaterials = () => {
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchSavedMaterials = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await materialApi.getSavedMaterials();
      setSavedMaterials(data.materials || []);
      return data.materials;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSavedMaterials();
  }, [fetchSavedMaterials]);

  return {
    savedMaterials,
    loading,
    error,
    fetchSavedMaterials,
  };
};

export const useMyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalUploads, setTotalUploads] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchMyUploads = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await materialApi.getMyUploads();
      setUploads(data.materials || []);
      setTotalUploads(data.totalUploads || 0);
      return data.materials;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchMyUploads();
  }, [fetchMyUploads]);

  return {
    uploads,
    loading,
    error,
    totalUploads,
    fetchMyUploads,
  };
};
