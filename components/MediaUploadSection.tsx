import React, { useRef } from 'react';
import { MediaItem } from '../types';

interface MediaUploadSectionProps {
  mediaItems: MediaItem[];
  onUpload: (files: FileList) => void;
  onDelete: (id: string) => void;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({ mediaItems, onUpload, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4 md:mb-0">
            Manage Gallery
          </h2>
          
          <button
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Media
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="relative group aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
              {item.type === 'image' ? (
                <img src={item.url} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <video src={item.url} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-all"
                  title="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                 <span className="text-white text-xs font-medium uppercase tracking-wider">
                   {item.type}
                 </span>
              </div>
            </div>
          ))}
          
          {/* Empty State / Add Place holder */}
          <button 
            onClick={triggerFileInput}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 flex flex-col items-center justify-center text-slate-400 hover:text-amber-600 transition-colors bg-slate-50 hover:bg-amber-50"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
             </svg>
             <span className="text-sm font-semibold">Add New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadSection;