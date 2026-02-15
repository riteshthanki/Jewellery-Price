import React, { useRef, useState } from 'react';
import { MediaItem } from '../types';

interface ManageMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  onUpload: (files: FileList) => void;
  onDelete: (id: string) => void;
  onReorder: (items: MediaItem[]) => void;
}

const ManageMediaModal: React.FC<ManageMediaModalProps> = ({ 
  isOpen, 
  onClose, 
  mediaItems, 
  onUpload, 
  onDelete,
  onReorder
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      const input = e.target;
      
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate network upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5; // Random increment
        if (progress > 95) progress = 95; // Hold at 95 until done
        setUploadProgress(progress);
      }, 100);

      // Finish simulation after 1.5 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Brief pause at 100% before processing
        setTimeout(() => {
          onUpload(files);
          setIsUploading(false);
          setUploadProgress(0);
          if (input) input.value = '';
        }, 300);
      }, 1500);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Optional: Set custom drag image if needed, for now default is fine
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItemIndex === null) return;
    if (draggedItemIndex === dropIndex) return;

    const newItems = [...mediaItems];
    const [draggedItem] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    onReorder(newItems);
    setDraggedItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-white font-serif">Manage Gallery</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow bg-slate-50">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <p className="text-slate-600">Drag items to reorder. Add photos and videos to the main display carousel.</p>
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                multiple
                className="hidden"
                disabled={isUploading}
              />
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                disabled={isUploading}
              />
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleFileChange}
                accept="video/*"
                multiple
                className="hidden"
                disabled={isUploading}
              />
              
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm text-sm sm:text-base ${
                  isUploading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photo
              </button>
              
              <button
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm text-sm sm:text-base ${
                  isUploading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-600 hover:bg-slate-700 text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Upload Video
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Uploading media...</span>
                <span className="text-sm font-bold text-amber-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`relative group aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-move transition-all duration-200 ${
                  draggedItemIndex === index ? 'opacity-50 scale-95 ring-2 ring-amber-500' : 'hover:shadow-md'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt="Thumbnail" className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <div className="w-full h-full relative bg-black">
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover opacity-80 pointer-events-none" 
                      muted 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                       </div>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-all shadow-lg cursor-pointer"
                    title="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider pl-1 flex items-center gap-1">
                    {item.type === 'video' && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>}
                    {item.type}
                  </span>
                </div>
                
                {/* Drag Handle Indicator (Optional visual cue) */}
                <div className="absolute top-2 right-2 bg-black/20 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
            ))}
            
            {/* Add New Placeholder Button - Works for both via fileInputRef */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
                isUploading
                ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                : 'border-slate-300 hover:border-amber-500 text-slate-400 hover:text-amber-600 bg-white hover:bg-amber-50'
              }`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
               </svg>
               <span className="text-sm font-semibold">Add New</span>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};

export default ManageMediaModal;