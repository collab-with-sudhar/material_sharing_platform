import React from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { BarChart, Upload, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon, delay }) => (
  <div className="border border-black p-6 hover:bg-neon-pink/10 transition-colors animate-fade-in" style={{ animationDelay: delay }}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-500 uppercase font-medium">{label}</p>
        <h3 className="text-3xl font-medium mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-black text-white">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main className="pt-32 md:pt-40 px-4 md:px-8 pb-16 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium">Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back! Here's an overview of your activity.</p>
          </div>
          <Link to="/upload" className="mt-4 md:mt-0 px-6 py-3 bg-black text-white border border-black uppercase text-sm font-medium hover:bg-white hover:text-black transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload New
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Total Uploads" value="12" icon={Upload} delay="0.1s" />
          <StatCard label="Total Views" value="1,234" icon={Eye} delay="0.2s" />
          <StatCard label="Downloads" value="892" icon={Download} delay="0.3s" />
        </div>

        {/* Recent Activity */}
        <div className="border border-black animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="p-6 border-b border-black flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-medium">Recent Uploads</h2>
            <Link to="/uploads" className="text-sm underline hover:text-neon-pink">View All</Link>
          </div>
          <div className="divide-y divide-black">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-black flex items-center justify-center bg-white">
                    <BarChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Quantitative Analysis Notes {item}</h4>
                    <p className="text-xs text-gray-500">Uploaded 2 days ago • Sem 6</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 24</span>
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" /> 12</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;