import React from 'react';
import { FileText, BookOpen, Eye, Download, Calendar } from 'lucide-react';

const MaterialCard = ({ title, subject, type, semester, year, views, downloads, date, href, delay }) => {
  return (
    <div className="animate-fade-in" style={{ animationDelay: delay, animationFillMode: 'both' }}>
      <a 
        href={href} 
        className="group block border border-black hover:border-neon-pink transition-colors bg-white"
      >
        {/* Card Header */}
        <div className="p-4 border-b border-black group-hover:border-neon-pink transition-colors">
          <div className="flex items-start gap-3">
            {/* Icon Box */}
            <div className="p-3 border border-black group-hover:bg-neon-pink group-hover:border-neon-pink transition-colors">
              <FileText className="w-6 h-6 group-hover:text-white transition-colors" />
            </div>
            
            {/* Title & Subject */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg leading-tight line-clamp-2 group-hover:text-neon-pink transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {subject}
              </p>
            </div>
          </div>
        </div>

        {/* Card Body & Footer */}
        <div className="p-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 text-xs font-medium uppercase bg-blue-100 text-blue-800">{type}</span>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">{semester}</span>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">{year}</span>
          </div>

          {/* Stats Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {views} views
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" /> {downloads} downloads
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {date}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default MaterialCard;