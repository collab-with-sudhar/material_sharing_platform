import React from 'react';
import Navbar from '../components/layouts/Navbar';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyUploads } from '../hooks/useMaterials';
import MaterialCard from '../components/ui/MaterialCard';

const MyUploads = () => {
  const { uploads, loading, error } = useMyUploads();

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-32 md:h-40"></div>

      <main className="px-4 md:px-8 pb-16 max-w-5xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 animate-fade-in transition-colors"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold">My Uploads</h1>
            <p className="text-gray-500 mt-2">
              {loading ? 'Loading...' : `${uploads?.length || 0} materials uploaded`}
            </p>
          </div>
          
          <Link 
            to="/upload"
            className="h-11 px-5 bg-black text-white text-sm font-medium uppercase flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload New
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your uploads...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-16 text-center animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        )}

        {/* Materials Grid */}
        {!loading && !error && uploads && uploads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            {uploads.map((upload) => (
              <MaterialCard 
                key={upload._id} 
                material={upload}
                showSave={false}
                linkTo={`/material/${upload._id}`}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!uploads || uploads.length === 0) && (
          <div className="border border-gray-200 py-16 text-center bg-white animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" strokeWidth={1} />
            <p className="text-gray-500 mb-4">You haven't uploaded any materials yet</p>
            <Link 
              to="/upload"
              className="inline-flex items-center gap-2 h-11 px-5 bg-black text-white text-sm font-medium uppercase hover:bg-gray-800 transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload Your First Material
            </Link>
          </div>
        )}
      </main>
      
    </div>
  );
};

export default MyUploads;