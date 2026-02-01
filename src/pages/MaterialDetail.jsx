import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  Calendar
} from 'lucide-react';
import Navbar from '../components/layouts/Navbar';
import { toast } from 'sonner';

// Dummy data - replace with API call later
const dummyMaterial = {
  id: '1a33a5f0-225b-4a7b-a363-5b66742f5e6b',
  title: 'sudhar_1a',
  subject: 'mad',
  description: 'hbwjwb',
  type: 'question paper',
  category: 'Question Papers',
  semester: 'Semester 6',
  year: '2025',
  college: 'tce',
  size: '0.43 MB',
  views: 0,
  downloads: 0,
  uploadedBy: 'Anonymous',
  uploadDate: 'Feb 1, 2026',
  fileUrl: 'https://fpypunwdglnbbxqgraon.supabase.co/storage/v1/object/public/materials/63f8a0d9-61bc-441e-be5c-31377f11ef96/1769968153670-8445hh.pdf'
};

const MaterialDetail = () => {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  
  // TODO: In real implementation, fetch material by id from API
  // Example: useEffect(() => { fetchMaterial(id) }, [id]);
  console.log('Material ID:', id); // Using id to avoid lint warning
  const material = dummyMaterial;

  const handleDownload = () => {
    // Open file URL in new tab for download
    window.open(material.fileUrl, '_blank');
    toast.success('Download started!');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved materials' : 'Saved to your collection!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white font-host-grotesk">
      <Navbar />
      
      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/browse" 
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-[#FA76FF] transition-colors animate-fade-in"
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
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm hover:bg-[#1A1A1A] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button 
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm transition-colors ${
                      isSaved ? 'bg-[#FA76FF] text-white border-[#FA76FF]' : 'hover:bg-gray-50'
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
                </div>
              </div>

              {/* PDF Viewer */}
              <div 
                className="animate-fade-in" 
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
              >
                <div className="border border-black">
                  <div className="relative bg-gray-100" style={{ height: '70vh' }}>
                    <iframe 
                      src={`${material.fileUrl}#toolbar=0`}
                      className="w-full h-full"
                      title="PDF Viewer"
                    />
                  </div>
                  <div className="p-4 border-t border-black flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>PDF Document</span>
                    </div>
                    <a 
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium hover:text-[#FA76FF] transition-colors"
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
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="text-sm font-medium capitalize">{material.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="text-sm font-medium">{material.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Semester</span>
                      <span className="text-sm font-medium">{material.semester}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Year</span>
                      <span className="text-sm font-medium">{material.year}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">College</span>
                      <span className="text-sm font-medium">{material.college}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Size</span>
                      <span className="text-sm font-medium">{material.size}</span>
                    </div>
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
                      <p className="text-2xl font-medium">{material.views}</p>
                      <p className="text-xs text-gray-500 uppercase">Views</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50">
                      <Download className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-2xl font-medium">{material.downloads}</p>
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
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{material.uploadedBy}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {material.uploadDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div 
                  className="border border-black p-6 animate-fade-in"
                  style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
                >
                  <h3 className="font-medium uppercase text-sm mb-4">Description</h3>
                  <p className="text-sm text-gray-600">{material.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaterialDetail;
