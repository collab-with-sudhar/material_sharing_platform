import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Bookmark, 
  Share2, 
  FileText, 
  ExternalLink,
  Eye,
  User,
  Calendar,
  Trash2
} from 'lucide-react';
import Navbar from '../components/layouts/Navbar';
import { toast } from 'sonner';
import { useMaterial } from '../hooks/useMaterials';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { deleteMaterial } from '../api/materialApi';
import { Helmet } from 'react-helmet-async';
const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { material, loading, toggleSave, trackDownload } = useMaterial(id);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSaved = useMemo(() => {
    if (user && material) {
      const savedMaterialIds = user.savedMaterials || [];
      return savedMaterialIds.some(savedId => 
        savedId === material._id || savedId._id === material._id
      );
    }
    return false;
  }, [user, material]);

  const handleDownload = async () => {
    if (material?.fileURL) {
      // Track download
      await trackDownload();
      
      // Open file in new tab
      window.open(material.fileURL, '_blank');
      toast.success('Download started!');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save materials');
      navigate('/signin');
      return;
    }

    try {
      await toggleSave();
      
      // Refresh user context to sync state across the app
      await refreshUser();
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMaterial(id);
      toast.success('Material deleted successfully');
      navigate('/my-uploads');
    } catch (error) {
      console.error('Failed to delete material:', error);
      toast.error(error.message || 'Failed to delete material');
      setIsDeleting(false);
    }
  };

  const isOwner = user && material && material.uploadedBy?._id === user._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Loading material...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold mb-2">Material not found</h2>
          <p className="text-gray-500 mb-6">The material you're looking for doesn't exist.</p>
          <Link to="/browse" className="text-pink-500 hover:text-pink-600 transition-colors">
            Browse materials
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = material.createdAt 
    ? format(new Date(material.createdAt), 'MMM d, yyyy')
    : 'N/A';

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>{material.title} - TCE Materials</title>
        <meta name="description" content={`Download and explore ${material.title}, a handwritten note, question paper, or assignment for Thiagarajar College of Engineering students.`} />
        <link rel="canonical" href={`https://tcematerials.tech/materials/${material._id}`} />
      </Helmet>
      
      <Navbar />
      
      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/browse" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 animate-fade-in transition-colors"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2">
              {/* Title Section */}
              <div 
                className="animate-fade-in" 
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
              >
                <div className="flex flex-wrap items-start gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2">
                      {material.title}
                    </h1>
                    <p className="text-lg text-gray-500 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {material.subject}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm hover:bg-gray-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button 
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm transition-colors ${
                      isSaved ? 'bg-pink-500 text-white border-pink-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  {isOwner && (
                    <button 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-2 px-6 py-3 border border-red-500 text-red-500 font-medium uppercase text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>

              {/* Document Viewer */}
              <div 
                className="animate-fade-in" 
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
              >
                <div className="border border-black">
                  <div className="relative bg-gray-100" style={{ height: '70vh' }}>
                    {material.fileType === 'application/pdf' ? (
                      <iframe 
                        src={`${material.fileURL}#toolbar=0`}
                        className="w-full h-full"
                        title="PDF Viewer"
                      />
                    ) : (
                      <iframe 
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(material.fileURL)}&embedded=true`}
                        className="w-full h-full"
                        title="Document Viewer"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                      />
                    )}
                  </div>
                  <div className="p-4 border-t border-black flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>
                        {material.fileType === 'application/pdf' ? 'PDF Document' : 
                         material.fileType?.includes('word') || material.fileType?.includes('document') ? 'Word Document' :
                         material.fileType?.includes('presentation') || material.fileType?.includes('powerpoint') ? 'PowerPoint Presentation' :
                         'Document'}
                      </span>
                    </div>
                    <a 
                      href={material.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium hover:text-pink-500 transition-colors"
                    >
                      Open in new tab
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Details Card */}
                <div 
                  className="border border-black p-6 animate-fade-in"
                  style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
                >
                  <h3 className="font-medium uppercase text-sm mb-4">Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="text-sm font-medium">{material.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Semester</span>
                      <span className="text-sm font-medium">{material.semester}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Subject</span>
                      <span className="text-sm font-medium">{material.subject}</span>
                    </div>
                    {material.department && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Department</span>
                        <span className="text-sm font-medium">{material.department}</span>
                      </div>
                    )}
                    {material.tags && material.tags.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500 block mb-2">Tags</span>
                        <div className="flex flex-wrap gap-2">
                          {material.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div 
                  className="border border-black p-6 animate-fade-in"
                  style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
                >
                  <h3 className="font-medium uppercase text-sm mb-4">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50">
                      <Eye className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-2xl font-medium">{material.views || 0}</p>
                      <p className="text-xs text-gray-500 uppercase">Views</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50">
                      <Download className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-2xl font-medium">{material.downloads || 0}</p>
                      <p className="text-xs text-gray-500 uppercase">Downloads</p>
                    </div>
                  </div>
                </div>

                {/* Uploaded By Card */}
                <div 
                  className="border border-black p-6 animate-fade-in"
                  style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
                >
                  <h3 className="font-medium uppercase text-sm mb-4">Uploaded By</h3>
                  <div className="flex items-center gap-3">
                    {material.uploadedBy?.profileImageURL ? (
                      <img 
                        src={material.uploadedBy.profileImageURL} 
                        alt={material.uploadedBy.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{material.uploadedBy?.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                {material.description && (
                  <div 
                    className="border border-black p-6 animate-fade-in"
                    style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
                  >
                    <h3 className="font-medium uppercase text-sm mb-4">Description</h3>
                    <p className="text-sm text-gray-600">{material.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaterialDetail;
