import React, { useEffect, useState } from 'react';
import Navbar from '../components/layouts/Navbar';
import { Upload, Eye, Download, FileText, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSavedMaterials, useMyUploads } from '../hooks/useMaterials';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon: Icon, iconBgColor, delay }) => (
  <div 
    className="border border-gray-200 p-6 bg-white flex items-center gap-4 animate-fade-in" 
    style={{ animationDelay: delay, animationFillMode: 'both' }}
  >
    <div className={`w-12 h-12 ${iconBgColor} flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h3 className="text-3xl font-semibold">{value}</h3>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

const SavedMaterialItem = ({ material, onClick }) => {
  const formattedDate = material.createdAt 
    ? format(new Date(material.createdAt), 'MMM d, yyyy')
    : 'N/A';

  return (
    <div 
      className="border border-gray-200 p-4 bg-white hover:border-gray-400 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 border border-gray-200 flex items-center justify-center bg-gray-50">
          <FileText className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{material.title}</h4>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Bookmark className="w-3 h-3" /> {material.subject}
          </p>
        </div>
      </div>
      {material.description && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{material.description}</p>
      )}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className={`px-2 py-0.5 text-xs font-medium uppercase ${
          material.category === 'Question Paper' ? 'bg-pink-100 text-pink-600' : 
          material.category === 'Assignment' ? 'bg-purple-100 text-purple-600' : 
          'bg-blue-100 text-blue-600'
        }`}>
          {material.category}
        </span>
        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600">
          {material.semester}
        </span>
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {material.views || 0} views
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" /> {material.downloads || 0} downloads
          </span>
        </div>
        <span>📅 {formattedDate}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { savedMaterials, loading: savedLoading, fetchSavedMaterials } = useSavedMaterials();
  const { uploads, totalUploads, loading: uploadsLoading } = useMyUploads();
  const navigate = useNavigate();

  const computeStats = () => {
    if (uploads && uploads.length > 0) {
      const totalViews = uploads.reduce((sum, material) => sum + (material.views || 0), 0);
      const totalDownloads = uploads.reduce((sum, material) => sum + (material.downloads || 0), 0);
      return {
        totalUploads: totalUploads || uploads.length,
        totalViews,
        totalDownloads,
      };
    }
    return {
      totalUploads: user?.totalUploads || 0,
      totalViews: 0,
      totalDownloads: 0,
    };
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Refresh saved materials when user data changes (e.g., after saving/unsaving)
  useEffect(() => {
    if (user) {
      fetchSavedMaterials();
    }
  }, [user?.savedMaterials?.length, fetchSavedMaterials]);

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        fetchSavedMaterials();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, fetchSavedMaterials]);

  const handleMaterialClick = (materialId) => {
    navigate(`/material/${materialId}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-32 md:h-40"></div>
      
      <main className="px-4 md:px-8 pb-16 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-4xl md:text-5xl font-semibold mb-2">
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-gray-500">Manage your saved materials and track your contributions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            label="UPLOADS" 
            value={computeStats().totalUploads} 
            icon={FileText} 
            iconBgColor="bg-pink-500" 
            delay="0.2s" 
          />
          <StatCard 
            label="TOTAL VIEWS" 
            value={computeStats().totalViews} 
            icon={Eye} 
            iconBgColor="bg-blue-500" 
            delay="0.3s" 
          />
          <StatCard 
            label="DOWNLOADS" 
            value={computeStats().totalDownloads} 
            icon={Download} 
            iconBgColor="bg-green-500" 
            delay="0.4s" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-12 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <Link 
            to="/upload" 
            className="h-11 px-5 bg-black text-white text-sm font-medium uppercase flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload New Material
          </Link>
          <Link 
            to="/my-uploads" 
            className="h-11 px-5 bg-white text-black text-sm font-medium uppercase flex items-center gap-2 border border-black hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" /> View My Uploads
          </Link>
        </div>

        {/* Saved Materials Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Bookmark className="w-5 h-5" /> Saved Materials
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({savedMaterials?.length || 0})
            </span>
          </h2>
          
          <div className="border border-gray-200 bg-white">
            {savedLoading ? (
              <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-500">Loading saved materials...</p>
              </div>
            ) : savedMaterials && savedMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {savedMaterials.map((material) => (
                  <SavedMaterialItem 
                    key={material._id} 
                    material={material}
                    onClick={() => handleMaterialClick(material._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" strokeWidth={1} />
                <p className="text-gray-500 mb-2">No saved materials yet</p>
                <Link to="/browse" className="text-pink-500 hover:text-pink-600 transition-colors">
                  Browse materials to save
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
