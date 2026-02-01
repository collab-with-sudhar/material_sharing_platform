import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { UploadCloud, X, FileText, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

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
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    materialType: '',
    category: '',
    subject: '',
    year: '',
    description: ''
  });

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
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
      toast.success("Files added successfully");
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }
    toast.success("Material uploaded successfully!");
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
              
              {/* Form Fields Container */}
              <div className="space-y-6">
                
                {/* Material Type & Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomSelect
                    label="Material Type"
                    required
                    value={formData.materialType}
                    onChange={handleInputChange}
                    placeholder="Select type"
                    options={[
                      { value: 'notes', label: 'Notes', name: 'materialType' },
                      { value: 'question-paper', label: 'Question Paper', name: 'materialType' },
                      { value: 'lab-manual', label: 'Lab Manual', name: 'materialType' },
                      { value: 'assignment', label: 'Assignment', name: 'materialType' },
                      { value: 'reference', label: 'Reference Book', name: 'materialType' },
                    ]}
                  />
                  <CustomSelect
                    label="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Select category"
                    options={[
                      { value: 'assignments', label: 'Assignments', name: 'category' },
                      { value: 'handwritten-notes', label: 'Handwritten Notes', name: 'category' },
                      { value: 'lab-manuals', label: 'Lab Manuals', name: 'category' },
                      { value: 'other', label: 'Other', name: 'category' },
                      { value: 'question-papers', label: 'Question Papers', name: 'category' },
                      { value: 'reference-books', label: 'Reference Books', name: 'category' },
                    ]}
                  />
                </div>

                {/* Subject & Year Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-700">Subject</label>
                    <input 
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g., Data Structures"
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400 transition-all bg-white hover:border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-700">Year</label>
                    <input 
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2024"
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

                {/* Drag and Drop Zone */}
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-700">
                    File Upload <span className="text-red-500">*</span>
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 
                      ${dragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleChange} 
                    />
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <UploadCloud className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="font-medium text-sm text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">PDF, DOCX, JPG or PNG (max. 10MB)</p>
                  </div>
                </div>

                {/* File Preview List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-700">Selected Files</label>
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors animate-fade-in">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 shrink-0">
                              <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium text-gray-700 truncate max-w-[200px] md:max-w-[300px]">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full h-12 bg-black text-white text-sm font-medium uppercase tracking-wide rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadMaterial;