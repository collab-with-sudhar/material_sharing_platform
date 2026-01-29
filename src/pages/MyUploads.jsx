import React from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { Trash2, Edit, FileText } from 'lucide-react';
import { toast } from 'sonner';

const MyUploads = () => {
  const handleDelete = () => {
    toast.success("Material deleted successfully");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 md:pt-40 px-4 md:px-8 pb-16 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-medium mb-8 animate-fade-in">My Uploads</h1>
        
        <div className="border border-black animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-black">
                <tr>
                  <th className="p-4 font-medium uppercase text-sm">Title</th>
                  <th className="p-4 font-medium uppercase text-sm">Category</th>
                  <th className="p-4 font-medium uppercase text-sm">Date</th>
                  <th className="p-4 font-medium uppercase text-sm">Stats</th>
                  <th className="p-4 font-medium uppercase text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Engineering Physics Unit {i}</span>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium uppercase">Notes</span></td>
                    <td className="p-4 text-sm text-gray-600">Jan 1{i}, 2026</td>
                    <td className="p-4 text-sm text-gray-600">2{i} Views</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={handleDelete} className="p-2 hover:bg-red-500 hover:text-white border border-transparent hover:border-red-500 transition-all text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyUploads;