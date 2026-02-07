import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, BookOpen, Eye, Download, Calendar, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toggleSaveMaterial } from '../../api/materialApi';
import { toast } from 'sonner';
import { format } from 'date-fns';

const MaterialCard = ({ material, isSaved: initialSaved, onSaveToggle, delay }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(initialSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when prop changes
  React.useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  // Safety check - return null if no material
  if (!material) {
    return null;
  }

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to save materials');
      navigate('/signin');
      return;
    }

    setIsSaving(true);
    try {
      const response = await toggleSaveMaterial(material._id);
      const newSavedState = response.isSaved;
      setIsSaved(newSavedState);
      toast.success(response.message);
      
      // Notify parent component
      if (onSaveToggle) {
        onSaveToggle(material._id, newSavedState);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save material');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = material?.createdAt 
    ? format(new Date(material.createdAt), 'MMM d, yyyy')
    : 'N/A';

  return (
    <div className="animate-fade-in" style={{ animationDelay: delay, animationFillMode: 'both' }}>
      <div className="group relative border border-black hover:border-neon-pink transition-colors bg-white">
        {/* Save Button - Top Right */}
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`absolute top-3 right-3 z-10 p-2 border transition-all duration-200 ${
            isSaved 
              ? 'bg-pink-500 border-pink-500 text-white' 
              : 'bg-white border-black hover:bg-gray-50'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isSaved ? 'Unsave material' : 'Save material'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        <Link 
          to={`/material/${material._id}`}
          className="block"
        >
          {/* Card Header */}
          <div className="p-4 pr-14 border-b border-black group-hover:border-neon-pink transition-colors">
            <div className="flex items-start gap-3">
              {/* Icon Box */}
              <div className="p-3 border border-black group-hover:bg-neon-pink group-hover:border-neon-pink transition-colors">
                <FileText className="w-6 h-6 group-hover:text-white transition-colors" />
              </div>
              
              {/* Title & Subject */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg leading-tight line-clamp-2 group-hover:text-neon-pink transition-colors">
                  {material.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {material.subject}
                </p>
              </div>
            </div>
          </div>

          {/* Card Body & Footer */}
          <div className="p-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs font-medium uppercase bg-blue-100 text-blue-800">
                {material.category || 'Document'}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                Sem {material.semester || 'N/A'}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                {material.year || new Date().getFullYear()}
              </span>
            </div>

            {/* Stats Footer */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {material.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" /> {material.downloads || 0}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formattedDate}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MaterialCard;