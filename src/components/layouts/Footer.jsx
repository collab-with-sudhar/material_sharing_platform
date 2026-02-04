import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-black px-4 md:px-8 py-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="bg-black text-white h-8 w-8 flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="font-medium">TCE Materials</span>
      </div>
      <p className="text-sm text-gray-500">
        Built for students, by students.
      </p>
    </div>
  </footer>
);

export default Footer;