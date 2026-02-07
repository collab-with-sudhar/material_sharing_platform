import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import { UploadCloud, X, FileText, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadMaterial } from '../api/materialApi';
import { useAuth } from '../context/AuthContext';

// Custom Dropdown Component with animation
const CustomSelect = ({ label, required, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-12 px-4 pr-10 border rounded-lg text-sm text-left bg-white transition-all duration-200 flex items-center justify-between
            ${isOpen ? 'border-gray-400 ring-2 ring-gray-100' : 'border-gray-200 hover:border-gray-300'}
            ${!value ? 'text-gray-400' : 'text-gray-900'}`}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Dropdown Menu */}
        <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top
          ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange({ target: { name: option.name, value: option.value } });
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-sm text-left transition-colors duration-150 hover:bg-blue-50
                ${value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const UploadMaterial = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subject: '',
    semester: '',
    description: '',
    tags: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to upload materials');
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Drag handlers
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
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF and Word documents are allowed');
      return;
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error('File size should not exceed 100MB');
      return;
    }

    setFile(selectedFile);
    toast.success('File selected successfully');
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const compressWithMicroservice = async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // We'll simulate progress since fetch doesn't support upload progress natively
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + 5, 90);
        onProgress(progress);
      }, 200);

      const COMPRESSION_SERVICE_URL = import.meta.env.VITE_COMPRESSION_SERVICE_URL || 'http://localhost:8000/compress';
      const response = await fetch(COMPRESSION_SERVICE_URL, {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error('Compression service failed');
      }

      const blob = await response.blob();
      onProgress(100);

      return new File([blob], file.name, {
        type: 'application/pdf',
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error('Microservice compression error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.subject || !formData.category || !formData.semester) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    let fileToUpload = file;
    let microserviceStats = null;

    // Use Python Microservice for PDF compression
    if (file.type === 'application/pdf') {
      try {
        const handleProgress = (p) => {
          // Map 0-100 compression progress to 0-50 total progress
          setUploadProgress(Math.floor(p / 2));
        };

        toast.info('Compressing file via optimization service...');
        const compressedFile = await compressWithMicroservice(file, handleProgress);

        if (compressedFile.size < file.size) {
          microserviceStats = {
            originalSize: formatFileSize(file.size),
            finalSize: formatFileSize(compressedFile.size),
            compressionRatio: Math.round((1 - compressedFile.size / file.size) * 100)
          };
          fileToUpload = compressedFile;
          toast.success(`Compressed: ${microserviceStats.originalSize} -> ${microserviceStats.finalSize}`);
        } else {
          toast.info('File already optimized, uploading original.');
        }
      } catch (error) {
        console.error('Compression failed:', error);
        toast.warning('Compression service unavailable, uploading original file.');
      }
    }

    setUploadProgress(50);

    try {
      // Create FormData
      const uploadFormData = new FormData();
      uploadFormData.append('file', fileToUpload);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('subject', formData.subject.trim());
      uploadFormData.append('category', formData.category);
      uploadFormData.append('semester', formData.semester);
      
      if (formData.description) {
        uploadFormData.append('description', formData.description.trim());
      }
      
      if (formData.tags) {
        uploadFormData.append('tags', formData.tags);
      }

      setUploadProgress(30);

      // Upload
      const response = await uploadMaterial(uploadFormData);

      setUploadProgress(100);

      if (response.success) {
        toast.success(
          <div>
            <p className="font-semibold">Material uploaded successfully!</p>
            {(microserviceStats || response.compression?.compressed) && (
              <p className="text-xs mt-1">
                Compressed from {microserviceStats ? microserviceStats.originalSize : response.compression?.originalSize} to {microserviceStats ? microserviceStats.finalSize : response.compression?.finalSize}
                ({microserviceStats ? microserviceStats.compressionRatio : response.compression?.compressionRatio}% reduction)
              </p>
            )}
          </div>
        );

        // Reset form
        setFormData({
          title: '',
          category: '',
          subject: '',
          semester: '',
          description: '',
          tags: ''
        });
        setFile(null);

        // Navigate to material detail
        setTimeout(() => {
          navigate(`/material/${response.material._id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload material');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-32 md:h-40"></div>

      <main className="px-4 md:px-8 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <h1 className="text-3xl md:text-4xl font-medium">Upload Material</h1>
            <p className="text-gray-500 mt-2">Share your study materials with the community</p>
          </div>

          {/* Upload Form Card */}
          <div className="bg-white animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Category & Semester Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomSelect
                    label="Category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Select category"
                    options={[
                      { value: 'Notes', label: 'Notes', name: 'category' },
                      { value: 'Question Paper', label: 'Question Paper', name: 'category' },
                      { value: 'Assignment', label: 'Assignment', name: 'category' },
                    ]}
                  />
                  <CustomSelect
                    label="Semester"
                    required
                    value={formData.semester}
                    onChange={handleInputChange}
                    placeholder="Select semester"
                    options={[
                      { value: 'Semester 1', label: 'Semester 1', name: 'semester' },
                      { value: 'Semester 2', label: 'Semester 2', name: 'semester' },
                      { value: 'Semester 3', label: 'Semester 3', name: 'semester' },
                      { value: 'Semester 4', label: 'Semester 4', name: 'semester' },
                      { value: 'Semester 5', label: 'Semester 5', name: 'semester' },
                      { value: 'Semester 6', label: 'Semester 6', name: 'semester' },
                      { value: 'Semester 7', label: 'Semester 7', name: 'semester' },
                      { value: 'Semester 8', label: 'Semester 8', name: 'semester' },
                    ]}
                  />
                </div>

                {/* Subject & Tags Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g., Data Structures"
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition-all bg-white hover:border-gray-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-700">Tags</label>
                    <input 
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., arrays, sorting"
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition-all bg-white hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* Material Title */}
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Data Structures Mid-Term 2024"
                    className="w-full h-12 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition-all bg-white hover:border-gray-300"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-700">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add a brief description about this material..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition-all bg-white resize-none hover:border-gray-300"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-700">
                    File Upload <span className="text-red-500">*</span>
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 
                      ${dragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}
                      ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !uploading && document.getElementById('file-upload').click()}
                  >
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      disabled={uploading}
                    />
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <UploadCloud className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="font-medium text-sm text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">PDF or DOCX (max. 100MB)</p>
                    <p className="text-xs text-gray-400 mt-1">Files will be automatically compressed to save space</p>
                  </div>
                </div>

                {/* File Preview */}
                {file && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-700">Selected File</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                          <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 shrink-0">
                            <FileText className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        {!uploading && (
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeFile(); }}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Uploading...</span>
                      <span className="text-gray-600 font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2 transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      {uploadProgress < 30 ? 'Preparing file...' : 
                       uploadProgress < 60 ? 'Compressing and uploading...' : 
                       uploadProgress < 100 ? 'Finalizing...' : 
                       'Upload complete!'}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={uploading || !file}
                  className="w-full h-12 bg-black text-white text-sm font-medium uppercase tracking-wide rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Upload Material
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadMaterial;
