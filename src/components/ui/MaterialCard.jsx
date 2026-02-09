import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Eye, Download, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toggleSaveMaterial } from '../../api/materialApi';
import { toast } from 'sonner';
import { format } from 'date-fns';

const MaterialCard = ({
  material,
  isSaved: initialSaved,
  onSaveToggle,
  delay,
  showSave = true,
  linkTo,
  onClick,
}) => {
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
      <div className="relative border border-gray-200 bg-white hover:shadow-md transition-shadow">
        {/* Department Badge - Top Right */}
        {material.department && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black text-white text-[10px] font-semibold uppercase z-20">
            {material.department}
          </div>
        )}
        
        {showSave && (
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`absolute ${material.department ? 'top-12' : 'top-3'} right-3 z-10 p-2 border transition-colors ${
              isSaved
                ? 'bg-black border-black text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isSaved ? 'Unsave material' : 'Save material'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        <Link
          to={linkTo || `/material/${material._id}`}
          className="block"
          onClick={onClick}
        >
          <div className={showSave ? 'p-4 pb-3 pr-14' : 'p-4 pb-3'}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 border border-gray-200 flex items-center justify-center bg-gray-50 shrink-0">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{material.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Bookmark className="w-3 h-3" /> {material.subject}
                </p>
              </div>
            </div>
          </div>

          {material.description && (
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
            </div>
          )}

          <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase border ${getCategoryStyle(material.category)}`}>
              {material.category}
            </span>
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 border border-gray-200">
              {material.semester || 'N/A'}
            </span>
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 border border-gray-200">
              {material.year || new Date().getFullYear()}
            </span>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {material.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> {material.downloads || 0}
              </span>
            </div>
            <span>{formattedDate}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MaterialCard;