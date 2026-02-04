import React, { useEffect, useState } from 'react';
import MaterialCard from '../ui/MaterialCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const RecentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentMaterials();
  }, []);

  const fetchRecentMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/materials?limit=6&page=1`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      
      const data = await response.json();
      
      // Transform API data to match MaterialCard props
      const transformedMaterials = data.materials?.map(material => ({
        id: material._id,
        title: material.title,
        subject: material.subject,
        type: material.category.toLowerCase(),
        semester: material.classInfo,
        year: new Date(material.createdAt).getFullYear().toString(),
        views: material.views || 0,
        downloads: material.downloads || 0,
        date: formatDate(material.createdAt),
        href: `/material/${material._id}`
      })) || [];
      
      setMaterials(transformedMaterials);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Recently Uploaded</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out the latest materials shared by your peers
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 bg-white animate-pulse">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Recently Uploaded</h2>
          <p className="text-red-500 mb-4">Failed to load materials. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (materials.length === 0) {
    return (
      <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Recently Uploaded</h2>
          <p className="text-gray-600 mb-8">No materials uploaded yet. Be the first to share!</p>
          <Link 
            to="/upload" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-neon-pink transition-colors"
          >
            Upload Material
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Recently Uploaded</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out the latest materials shared by your peers
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {materials.map((material, index) => (
            <MaterialCard 
              key={material.id} 
              {...material} 
              delay={`${0.1 + (index * 0.1)}s`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <Link 
            to="/browse" 
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-black hover:bg-black hover:text-white transition-all group"
          >
            View All Materials
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentMaterials;
