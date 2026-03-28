import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RateCard from './components/RateCard';
import MediaCarousel from './components/MediaCarousel';
import UpdateRatesModal from './components/UpdateRatesModal';
import ManageMediaModal from './components/ManageMediaModal';
import SettingsModal from './components/SettingsModal';
import AdminPanel from './components/AdminPanel';
import { MetalRate, MediaItem, AppSettings } from './types';
import { dbService } from './utils/db';
import { FESTIVAL_THEMES, getAutoFestivalTheme } from './utils/festivalTheme';

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
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  shopName: 'Jay Mataji Jewellers',
  logoUrl: '',
  darkLogoUrl: '',
  themePreference: 'auto'
};

const App: React.FC = () => {
  const [rates, setRates] = useState<MetalRate[]>(INITIAL_RATES);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; 
  });

  // Derived Festival Theme
  const currentThemeId = settings.themePreference === 'auto' || !settings.themePreference 
    ? getAutoFestivalTheme() 
    : settings.themePreference;
  
  const activeTheme = FESTIVAL_THEMES[currentThemeId] || FESTIVAL_THEMES['default'];
  
  // Custom Background Style
  const customBgStyle = (settings.themePreference === 'custom' && settings.customBackgroundUrl) 
    ? { backgroundImage: `url(${settings.customBackgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
    : {};

  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // --- Data Loading Logic ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load Settings
        const localSettings = await dbService.getSettings();
        if (localSettings) {
           // Ensure themePreference exists
           if (!localSettings.themePreference) {
             localSettings.themePreference = 'auto';
           }
           setSettings(localSettings);
        }

        // 2. Load Rates
        const localRates = await dbService.getRates();
        if (localRates) {
          // Filter out Silver to ensure it's removed even if previously saved
          const filteredRates = localRates.filter(rate => rate.metal !== 'Silver');
          setRates(filteredRates);
        }

        // 3. Load Media
        const localMedia = await dbService.getMediaItems();
        if (localMedia && localMedia.length > 0) {
          setMediaItems(localMedia);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // --- Handlers ---

  const handleUpdateRates = async (updatedRates: MetalRate[]) => {
    setRates(updatedRates);
    await dbService.saveRates(updatedRates);
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await dbService.saveSettings(newSettings);
  }

  const handleUploadLogo = async (file: File): Promise<string | null> => {
    try {
      const url = await dbService.uploadFile(file);
      if (url) {
        const newSettings = { ...settings, logoUrl: url };
        setSettings(newSettings);
        await dbService.saveSettings(newSettings);
      }
      return url;
    } catch (e) {
      console.error("Logo upload failed", e);
      return null;
    }
  };

  const handleUploadDarkLogo = async (file: File): Promise<string | null> => {
    try {
      const url = await dbService.uploadFile(file);
      if (url) {
        const newSettings = { ...settings, darkLogoUrl: url };
        setSettings(newSettings);
        await dbService.saveSettings(newSettings);
      }
      return url;
    } catch (e) {
      console.error("Dark logo upload failed", e);
      return null;
    }
  };

  const handleUploadBackground = async (file: File): Promise<string | null> => {
    try {
      const url = await dbService.uploadFile(file);
      if (url) {
        const newSettings = { ...settings, customBackgroundUrl: url };
        setSettings(newSettings);
        await dbService.saveSettings(newSettings);
      }
      return url;
    } catch (e) {
      console.error("Background upload failed", e);
      return null;
    }
  };

  const handleUploadMedia = async (files: FileList) => {
    const newMediaItems: MediaItem[] = [];
    const filesArray = Array.from(files);

    // Process all files
    for (const file of filesArray) {
        const id = 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        
        // Upload File
        const url = await dbService.uploadFile(file);
        
        if (url) {
          // Create Metadata
          const newItem: MediaItem = {
              id,
              type: type as 'image' | 'video',
              url: url,
              title: file.name.split('.')[0]
          };
          newMediaItems.push(newItem);
        }
    }

    // Update State
    const updatedList = [...mediaItems, ...newMediaItems];
    setMediaItems(updatedList);
    
    // Save Metadata
    await dbService.saveMediaItems(updatedList);
  };

  const handleDeleteMedia = async (id: string) => {
    const itemToDelete = mediaItems.find(item => item.id === id);
    const updatedList = mediaItems.filter(item => item.id !== id);
    setMediaItems(updatedList);
    
    // Remove from DB
    await dbService.saveMediaItems(updatedList);
    
    // Delete file from server if it exists
    if (itemToDelete && itemToDelete.url) {
      await dbService.deleteFile(itemToDelete.url);
    }
  };

  const handleReorderMedia = async (reorderedItems: MediaItem[]) => {
    setMediaItems(reorderedItems);
    await dbService.saveMediaItems(reorderedItems);
  };

  return (
    <div 
      className={`min-h-screen font-sans relative transition-colors duration-500 text-slate-900 dark:text-white ${settings.themePreference !== 'custom' ? activeTheme.backgroundClass : ''}`}
      style={customBgStyle}
    >
      
      {/* Optional Overlay for patterns - Only if not custom */}
      {settings.themePreference !== 'custom' && activeTheme.overlayClass && (
        <div className={`absolute inset-0 pointer-events-none ${activeTheme.overlayClass}`} />
      )}
      
      {/* Dark overlay for custom background readability */}
      {settings.themePreference === 'custom' && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      )}

      <div className="w-full max-w-[120rem] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12 xl:py-16 pb-24 relative z-10">
        {/* Header Section */}
        <DashboardHeader settings={settings} isDarkMode={isDarkMode} />

        {/* Main Grid for Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 portrait:grid-cols-1 gap-6 xl:gap-10 portrait:gap-8 mb-12 xl:mb-20 portrait:mb-12">
          {rates.map((rate) => (
            <RateCard key={rate.id} rate={rate} />
          ))}
        </div>

        {/* Media Carousel Section */}
        <MediaCarousel media={mediaItems} />
      </div>

      {/* Single Floating Admin Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsAdminPanelOpen(true)}
          className="bg-slate-800 hover:bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:shadow-amber-500/30 transition-all border border-slate-700 group transform hover:scale-110 active:scale-95"
          title="Admin Controls"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>

      {/* Admin Panel Modal (Central Menu) */}
      <AdminPanel 
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onOpenRates={() => setIsRatesModalOpen(true)}
        onOpenMedia={() => setIsMediaModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Feature Modals */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onBack={() => { setIsSettingsModalOpen(false); setIsAdminPanelOpen(true); }}
        currentSettings={settings}
        onSave={handleUpdateSettings}
        onUploadLogo={handleUploadLogo}
        onUploadDarkLogo={handleUploadDarkLogo}
        onUploadBackground={handleUploadBackground}
      />

      <ManageMediaModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onBack={() => { setIsMediaModalOpen(false); setIsAdminPanelOpen(true); }}
        mediaItems={mediaItems}
        onUpload={handleUploadMedia}
        onDelete={handleDeleteMedia}
        onReorder={handleReorderMedia}
      />

      <UpdateRatesModal 
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
        onBack={() => { setIsRatesModalOpen(false); setIsAdminPanelOpen(true); }}
        currentRates={rates}
        onSave={handleUpdateRates}
      />
      
    </div>
  );
};

export default App;