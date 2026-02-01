import React from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { ArrowLeft, Upload, FileText, Bookmark, Eye, Download, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const MaterialCard = ({ title, subject, description, category, semester, year, views, downloads, date }) => {
  const getCategoryStyle = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'question paper':
        return 'bg-pink-100 text-pink-600 border-pink-200';
      case 'notes':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'lab manual':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'assignment':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 border border-gray-200 flex items-center justify-center bg-gray-50 shrink-0">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Bookmark className="w-3 h-3" /> {subject}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      )}

      {/* Tags */}
      <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase border ${getCategoryStyle(category)}`}>
          {category}
        </span>
        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 border border-gray-200">
          Sem {semester}
        </span>
        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 border border-gray-200">
          {year}
        </span>
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {views} views
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> {downloads} downloads
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> {date}
        </span>
      </div>
    </div>
  );
};

const MyUploads = () => {
  // Sample data matching the screenshot
  const uploads = [
    { 
      title: "sudhar_1a", 
      subject: "mad", 
      description: "hbwjwb",
      category: "Question Paper", 
      semester: "6",
      year: "2025",
      views: "0", 
      downloads: "0",
      date: "Feb 1"
    },
    { 
      title: "sudhar_1b", 
      subject: "cloud computing", 
      description: "wort",
      category: "Notes", 
      semester: "5",
      year: "2026",
      views: "0", 
      downloads: "0",
      date: "Feb 1"
    },
  ];

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
            <p className="text-gray-500 mt-2">{uploads.length} materials uploaded</p>
          </div>
          
          <Link 
            to="/upload"
            className="h-11 px-5 bg-black text-white text-sm font-medium uppercase flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload New
          </Link>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          {uploads.map((upload, idx) => (
            <MaterialCard key={idx} {...upload} />
          ))}
        </div>

        {/* Empty State (shown when no uploads) */}
        {uploads.length === 0 && (
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
      <Footer />
    </div>
  );
};

export default MyUploads;