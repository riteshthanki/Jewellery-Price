import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RateCard from './components/RateCard';
import MediaCarousel from './components/MediaCarousel';
import UpdateRatesModal from './components/UpdateRatesModal';
import ManageMediaModal from './components/ManageMediaModal';
import { MetalRate, MediaItem } from './types';

const INITIAL_RATES: MetalRate[] = [
  {
    id: '1',
    metal: 'Gold',
    purityLabel: '24K',
    purityPercentage: '99.9%',
    price: 78430,
    currency: 'INR',
    unit: '10 Grams',
    colorClass: 'bg-gold-400',
  },
  {
    id: '2',
    metal: 'Gold',
    purityLabel: '22K',
    purityPercentage: '91.6%',
    price: 72200,
    currency: 'INR',
    unit: '10 Grams',
    colorClass: 'bg-gold-500',
  },
  {
    id: '3',
    metal: 'Gold',
    purityLabel: '18K',
    purityPercentage: '75.0%',
    price: 59730,
    currency: 'INR',
    unit: '10 Grams',
    colorClass: 'bg-gold-600',
  },
  {
    id: '4',
    metal: 'Silver',
    purityLabel: 'Ag',
    purityPercentage: '99.9%',
    price: 91500,
    currency: 'INR',
    unit: '1 Kg',
    colorClass: 'bg-silver-400',
  },
];

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
    title: 'Exquisite Gold Collection'
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    title: 'Timeless Elegance'
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    title: 'Handcrafted Perfection'
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80',
    title: 'Wedding Series'
  }
];

const App: React.FC = () => {
  const [rates, setRates] = useState<MetalRate[]>(INITIAL_RATES);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Load rates and media from localStorage on mount
  useEffect(() => {
    const savedRates = localStorage.getItem('metalRates');
    if (savedRates) {
      try {
        setRates(JSON.parse(savedRates));
      } catch (e) {
        console.error("Failed to parse saved rates", e);
      }
    }

    const savedMedia = localStorage.getItem('mediaItems');
    if (savedMedia) {
      try {
        setMediaItems(JSON.parse(savedMedia));
      } catch (e) {
        console.error("Failed to parse saved media", e);
      }
    }
  }, []);

  const handleUpdateRates = (updatedRates: MetalRate[]) => {
    setRates(updatedRates);
    localStorage.setItem('metalRates', JSON.stringify(updatedRates));
  };

  const handleUploadMedia = (files: FileList) => {
    const newItems: MediaItem[] = Array.from(files).map(file => {
      // Robust check for video type based on mime type or extension
      const isVideo = file.type.startsWith('video/') || 
                      /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: isVideo ? 'video' : 'image',
        url: URL.createObjectURL(file),
        title: file.name.split('.')[0]
      };
    });
    
    setMediaItems(prev => {
      const updated = [...prev, ...newItems];
      localStorage.setItem('mediaItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('mediaItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleReorderMedia = (reorderedItems: MediaItem[]) => {
    setMediaItems(reorderedItems);
    localStorage.setItem('mediaItems', JSON.stringify(reorderedItems));
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans relative">
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24">
        {/* Header Section */}
        <DashboardHeader />

        {/* Main Grid for Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {rates.map((rate) => (
            <RateCard key={rate.id} rate={rate} />
          ))}
        </div>

        {/* Media Carousel Section - Full Width Container */}
        <MediaCarousel media={mediaItems} />
      </div>

      {/* Floating Admin Buttons (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button 
          onClick={() => setIsMediaModalOpen(true)}
          className="bg-white text-slate-600 hover:text-amber-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-slate-200 group relative"
          title="Manage Gallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Manage Gallery
          </span>
        </button>
        <button 
          onClick={() => setIsRatesModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-amber-500 group relative"
          title="Update Rates"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Update Rates
          </span>
        </button>
      </div>

      {/* Modals */}
      <ManageMediaModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        mediaItems={mediaItems}
        onUpload={handleUploadMedia}
        onDelete={handleDeleteMedia}
        onReorder={handleReorderMedia}
      />

      <UpdateRatesModal 
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
        currentRates={rates}
        onSave={handleUpdateRates}
      />
      
    </div>
  );
};

export default App;