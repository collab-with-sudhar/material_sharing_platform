import React, { useState } from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

const UploadMaterial = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    // Convert FileList to Array
    const newFiles = Array.from(fileList);
    setFiles([...files, ...newFiles]);
    toast.success(`${newFiles.length} file(s) added`);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement FormData upload to backend
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Uploading materials...',
      success: 'Materials uploaded successfully!',
      error: 'Error uploading files',
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 md:pt-40 px-4 md:px-8 pb-16 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-medium mb-8 animate-fade-in">Upload Material</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          
          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium uppercase">Subject Title</label>
              <input type="text" required className="w-full h-12 px-3 border border-black focus:ring-2 focus:ring-neon-pink outline-none" placeholder="e.g. Data Structures" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium uppercase">Category</label>
              <select className="w-full h-12 px-3 border border-black focus:ring-2 focus:ring-neon-pink outline-none bg-white">
                <option>Notes</option>
                <option>Question Paper</option>
                <option>Lab Manual</option>
                <option>Assignment</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div 
            className={`border-2 border-dashed border-black p-12 text-center transition-colors ${dragActive ? 'bg-neon-pink/10 border-neon-pink' : 'bg-gray-50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input type="file" multiple className="hidden" id="file-upload" onChange={handleChange} />
            <UploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-medium text-lg">Drag & drop files here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label htmlFor="file-upload" className="inline-block px-6 py-2 border border-black bg-white cursor-pointer hover:bg-black hover:text-white transition-colors uppercase text-sm font-medium">
              Browse Files
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-black bg-white">
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button type="submit" className="px-8 py-3 bg-neon-pink text-black border border-black font-medium uppercase hover:bg-black hover:text-white transition-colors">
              Upload Now
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default UploadMaterial;