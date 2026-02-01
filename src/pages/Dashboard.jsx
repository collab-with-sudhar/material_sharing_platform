import React from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { Upload, Eye, Download, FileText, Bookmark, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const SavedMaterialItem = ({ title, subject, category, semester, year, views, downloads, date }) => (
  <div className="border border-gray-200 p-4 bg-white">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 border border-gray-200 flex items-center justify-center bg-gray-50">
        <FileText className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Bookmark className="w-3 h-3" /> {subject}
        </p>
      </div>
    </div>
    <p className="text-sm text-gray-600 mt-3">{/* description */}</p>
    <div className="flex items-center gap-2 mt-3">
      <span className={`px-2 py-0.5 text-xs font-medium uppercase ${category === 'QUESTION PAPER' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
        {category}
      </span>
      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600">Sem {semester}</span>
      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600">{year}</span>
    </div>
    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {views} views</span>
        <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {downloads} downloads</span>
      </div>
      <span className="flex items-center gap-1">📅 {date}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const savedMaterials = []; // Empty for now, can be populated from API

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-32 md:h-40"></div>
      
      <main className="px-4 md:px-8 pb-16 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-4xl md:text-5xl font-semibold mb-2">Welcome!</h1>
          <p className="text-gray-500">Manage your saved materials and track your contributions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="UPLOADS" value="2" icon={FileText} iconBgColor="bg-pink-500" delay="0.2s" />
          <StatCard label="TOTAL VIEWS" value="0" icon={Eye} iconBgColor="bg-blue-500" delay="0.3s" />
          <StatCard label="DOWNLOADS" value="0" icon={Download} iconBgColor="bg-green-500" delay="0.4s" />
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
          </h2>
          
          <div className="border border-gray-200 bg-white">
            {savedMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {savedMaterials.map((material, idx) => (
                  <SavedMaterialItem key={idx} {...material} />
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
      <Footer />
    </div>
  );
};

export default Dashboard;