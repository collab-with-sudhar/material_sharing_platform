import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import { UploadCloud, X, FileText, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
  const { isAuthenticated } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(''); // 'uploading' | 'finalizing'
  const [uploadSpeed, setUploadSpeed] = useState(0); // bytes per second
  const [uploadEta, setUploadEta] = useState(null); // seconds remaining
  const [retryCount, setRetryCount] = useState(0);
  const xhrRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subject: '',
    semester: '',
    department: '',
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
    // Validate file exists
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    const isValidType = allowedTypes.includes(selectedFile.type);
    const isValidExtension = allowedExtensions.includes(fileExtension);
    
    if (!isValidType && !isValidExtension) {
      toast.error('Only PDF, Word, and PowerPoint documents are allowed');
      return;
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error('File size should not exceed 100MB');
      return;
    }

    // Validate minimum file size (1KB)
    if (selectedFile.size < 1024) {
      toast.error('File appears to be empty or corrupted');
      return;
    }

    // Validate filename
    if (!selectedFile.name || selectedFile.name.trim() === '') {
      toast.error('Invalid filename');
      return;
    }

    setFile(selectedFile);
    toast.success(`Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`);
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };



  const uploadWithProgress = async (formData, attempt = 1) => {
    const MAX_RETRIES = 3;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      
      let startTime = Date.now();
      let lastLoaded = 0;
      let lastTime = startTime;

      // Track upload progress with speed and ETA
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
          
          // Calculate speed and ETA
          const now = Date.now();
          const timeDiff = (now - lastTime) / 1000; // seconds
          if (timeDiff >= 0.5) { // Update every 500ms
            const bytesDiff = e.loaded - lastLoaded;
            const speed = bytesDiff / timeDiff; // bytes/sec
            setUploadSpeed(speed);
            
            const remaining = e.total - e.loaded;
            if (speed > 0) {
              setUploadEta(Math.ceil(remaining / speed));
            }
            
            lastLoaded = e.loaded;
            lastTime = now;
          }
        }
      });

      xhr.addEventListener('load', () => {
        xhrRef.current = null;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error('Invalid server response'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      const handleRetryableError = (errorMsg) => {
        xhrRef.current = null;
        if (attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000); // 1s, 2s, 4s
          setRetryCount(attempt);
          toast.info(`Upload interrupted. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            uploadWithProgress(formData, attempt + 1).then(resolve).catch(reject);
          }, delay);
        } else {
          reject(new Error(errorMsg));
        }
      };

      xhr.addEventListener('error', () => {
        handleRetryableError('Network error during upload. Please check your connection.');
      });

      xhr.addEventListener('abort', () => {
        xhrRef.current = null;
        reject(new Error('Upload cancelled'));
      });

      xhr.addEventListener('timeout', () => {
        handleRetryableError('Upload timed out. Retrying with extended timeout...');
      });

      // Configure request with cookies for authentication
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
      xhr.open('POST', `${API_BASE}/api/materials`);
      
      // CRITICAL: Enable credentials (cookies) for authentication
      xhr.withCredentials = true;
      
      // Adaptive timeout: base 2min + 1min per 10MB, capped at 15min
      const fileSizeMB = formData.get('file')?.size || 0;
      const baseTimeout = 120000; // 2 minutes base
      const sizeTimeout = Math.ceil((fileSizeMB / (10 * 1024 * 1024))) * 60000; // 1min per 10MB
      const retryMultiplier = attempt; // Increase timeout on retries
      xhr.timeout = Math.min((baseTimeout + sizeTimeout) * retryMultiplier, 900000); // cap 15min
      
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.subject || !formData.category || !formData.semester || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setCurrentStage('');
    setUploadSpeed(0);
    setUploadEta(null);
    setRetryCount(0);

    // Show info for PDF files that compression will happen server-side
    if (file.type === 'application/pdf') {
      toast.info('Uploading PDF....');
    }

    try {
      // Create FormData
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('subject', formData.subject.trim());
      uploadFormData.append('category', formData.category);
      uploadFormData.append('semester', formData.semester);
      uploadFormData.append('department', formData.department);
      
      if (formData.description) {
        uploadFormData.append('description', formData.description.trim());
      }
      
      if (formData.tags) {
        uploadFormData.append('tags', formData.tags);
      }

      setCurrentStage('uploading');
      setUploadProgress(0);

      // Upload with real progress tracking
      const response = await uploadWithProgress(uploadFormData);

      setCurrentStage('finalizing');

      if (response.success) {
        toast.success(
          <div>
            <p className="font-semibold">Material uploaded successfully!</p>
            {response.compression?.compressed && (
              <p className="text-xs mt-1">
                Compressed: {response.compression.originalSize} → {response.compression.finalSize} ({response.compression.compressionRatio}% reduction)
              </p>
            )}
            {response.compression?.error && (
              <p className="text-xs mt-1 text-amber-600">
                Note: Compression unavailable, uploaded original file
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
          department: '',
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
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to upload material';
      let shouldRedirect = false;
      
      if (error.message.includes('Login') || error.message.includes('auth') || error.message.includes('Unauthorized')) {
        errorMessage = 'Session expired. Please sign in again.';
        shouldRedirect = true;
      } else if (error.message.includes('Network') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
        errorMessage = 'Upload timed out. Please try again or use a smaller file.';
      } else if (error.message.includes('exceed') || error.message.includes('large')) {
        errorMessage = 'File is too large. Maximum size is 100MB.';
      } else if (error.message.includes('format') || error.message.includes('type')) {
        errorMessage = 'Invalid file format. Only PDF, Word, and PowerPoint documents are allowed.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      if (shouldRedirect) {
        setTimeout(() => navigate('/signin'), 2000);
      }
      
      setUploadProgress(0);
      setCurrentStage('');
      setUploadSpeed(0);
      setUploadEta(null);
      setRetryCount(0);
    } finally {
      setUploading(false);
      xhrRef.current = null;
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
            <p className="text-gray-500 mt-2">Share your Handwritten Notes and other study materials.</p>
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

                {/* Department */}
                <CustomSelect
                  label="Department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Select department"
                  options={[
                    { value: 'IT', label: 'IT', name: 'department' },
                    { value: 'CSE', label: 'CSE', name: 'department' },
                    { value: 'EEE', label: 'EEE', name: 'department' },
                    { value: 'ECE', label: 'ECE', name: 'department' },
                    { value: 'CIVIL', label: 'CIVIL', name: 'department' },
                    { value: 'MECH', label: 'MECH', name: 'department' },
                    { value: 'CSBS', label: 'CSBS', name: 'department' },
                    { value: 'ARCH', label: 'ARCH', name: 'department' },
                    { value: 'DATA SCIENCE', label: 'DATA SCIENCE', name: 'department' },
                    { value: 'AIML', label: 'AIML', name: 'department' },
                  ]}
                />

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
                      placeholder="e.g., arrays, sorting(seperated by commas)"
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
                    placeholder="e.g., Data Structures Module 1 Notes"
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
                    placeholder="Add a description about this material..."
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
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleChange}
                      disabled={uploading}
                    />
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <UploadCloud className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="font-medium text-sm text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">PDF, DOCX, or PPTX (max. 100MB)</p>
                    <p className="text-xs text-gray-400 mt-1">Compress the PDF before upload if the size is larger than 100MB</p>
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
                  <div className="space-y-4">
                    {/* Upload Progress */}
                    {currentStage === 'uploading' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 font-medium">
                            {retryCount > 0 ? `Uploading (retry ${retryCount})...` : 'Uploading...'}
                          </span>
                          <span className="text-gray-600 font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {uploadProgress < 30 ? 'Uploading file to server...' :
                             uploadProgress < 70 ? 'Compressing and processing...' :
                             uploadProgress < 100 ? 'Saving to cloud storage...' : 
                             'Upload complete!'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {uploadSpeed > 0 && uploadProgress < 100 && (
                              <>
                                {uploadSpeed >= 1024 * 1024 
                                  ? `${(uploadSpeed / (1024 * 1024)).toFixed(1)} MB/s`
                                  : `${(uploadSpeed / 1024).toFixed(0)} KB/s`}
                                {uploadEta != null && uploadEta > 0 && (
                                  <> · {uploadEta >= 60 
                                    ? `${Math.floor(uploadEta / 60)}m ${uploadEta % 60}s left`
                                    : `${uploadEta}s left`}</>
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Finalizing */}
                    {currentStage === 'finalizing' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 font-medium">Finalizing...</span>
                          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 w-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Creating database entry and updating metadata...
                        </p>
                      </div>
                    )}
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