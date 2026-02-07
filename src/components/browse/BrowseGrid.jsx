import React, { useState, useEffect } from 'react';
import MaterialCard from '../ui/MaterialCard';
import { useMaterials } from '../../hooks/useMaterials';
import { useAuth } from '../../context/AuthContext';
import { FileText } from 'lucide-react';

const BrowseGrid = () => {
  const { materials, loading, error, fetchMaterials } = useMaterials();
  const { user, refreshUser } = useAuth();
  const [localSavedMaterials, setLocalSavedMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  useEffect(() => {
    if (user?.savedMaterials) {
      setLocalSavedMaterials(user.savedMaterials.map(m => m._id || m));
    }
  }, [user]);

  const handleSaveToggle = async (materialId, isSaved) => {
    // Optimistically update the UI
    setLocalSavedMaterials(prev => 
      isSaved 
        ? [...prev, materialId]
        : prev.filter(id => id !== materialId)
    );
    
    // Refresh user data from server to sync state
    await refreshUser();
  };

  if (loading) {
    return (
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-500">Loading materials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="py-16 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" strokeWidth={1} />
            <p className="text-gray-500">No materials found</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material, index) => (
            <MaterialCard 
              key={material._id} 
              material={material}
              isSaved={localSavedMaterials.includes(material._id)}
              onSaveToggle={handleSaveToggle}
              delay={`${0.4 + (index * 0.1)}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseGrid;