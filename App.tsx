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
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  shopName: 'Jay Mataji Jewellers',
  logoUrl: '',
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
        // 1. Load Settings (including local logo blob)
        const localSettings = await dbService.getSettings();
        if (localSettings) {
           // If we have a local logo ID/Url, check if we need to regenerate Blob URL
           let activeSettings = { ...localSettings };
           
           // Load Light Logo
           const logoBlob = await dbService.getFile('shop_logo');
           if (logoBlob) {
             activeSettings.logoUrl = URL.createObjectURL(logoBlob);
           }

           // Load Dark Logo
           const darkLogoBlob = await dbService.getFile('shop_dark_logo');
           if (darkLogoBlob) {
             activeSettings.darkLogoUrl = URL.createObjectURL(darkLogoBlob);
           }
           
           // Load Custom Background
           const bgBlob = await dbService.getFile('custom_bg');
           if (bgBlob) {
             activeSettings.customBackgroundUrl = URL.createObjectURL(bgBlob);
           }

           // Ensure themePreference exists
           if (!activeSettings.themePreference) {
             activeSettings.themePreference = 'auto';
           }
           setSettings(activeSettings);
        }

        // 2. Load Rates
        const localRates = await dbService.getRates();
        if (localRates) {
          setRates(localRates);
        } else {
            // If no local rates, try fetch from data.json (server fallback)
            try {
                const res = await fetch('data.json?t=' + Date.now());
                if(res.ok) {
                    const data = await res.json();
                    if(data.rates) setRates(data.rates);
                }
            } catch(e) { /* ignore */ }
        }

        // 3. Load Media
        const localMedia = await dbService.getMediaItems();
        if (localMedia && localMedia.length > 0) {
          // Reconstruct Blob URLs for local files
          const loadedMedia = await Promise.all(localMedia.map(async (item) => {
            // Check if we have a stored file for this item
            const fileBlob = await dbService.getFile(item.id);
            if (fileBlob) {
                return { ...item, url: URL.createObjectURL(fileBlob) };
            }
            return item; // Return as is (likely external URL)
          }));
          setMediaItems(loadedMedia);
        } else {
             // Fallback to constants only if DB is truly empty (first run)
             // We don't fetch data.json for media to avoid conflict with local DB persistence priority
             // setMediaItems(DEFAULT_MEDIA); // Optional: keep default
        }
      } catch (error) {
        console.error("Error loading local data:", error);
      }
    };

    loadData();
  }, []);

  // --- Handlers ---

  const handleUpdateRates = async (updatedRates: MetalRate[]) => {
    setRates(updatedRates);
    // 1. Save locally (Source of Truth)
    await dbService.saveRates(updatedRates);
    
    // 2. Try Sync to Server (Optional/Secondary)
    try {
      const formData = new FormData();
      formData.append('action', 'update_rates');
      formData.append('rates', JSON.stringify(updatedRates));
      fetch('api.php', { method: 'POST', body: formData }).catch(() => {});
    } catch (e) {
      console.warn("Server sync failed, but local save worked.");
    }
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    // If the logoUrl is a blob URL, we keep it as is in state, 
    // but we save the settings object to DB.
    // The logo BLOB itself is saved separately in handleUploadLogo.
    setSettings(newSettings);
    await dbService.saveSettings(newSettings);

    try {
      const formData = new FormData();
      formData.append('action', 'update_settings');
      formData.append('settings', JSON.stringify(newSettings));
      fetch('api.php', { method: 'POST', body: formData }).catch(() => {});
    } catch(e) {
      console.warn("Server sync failed.");
    }
  }

  const handleUploadLogo = async (file: File): Promise<string | null> => {
    try {
      // 1. Save to Local DB
      await dbService.saveFile('shop_logo', file);
      
      // 2. Create URL
      const localUrl = URL.createObjectURL(file);
      
      // 3. Update Settings immediately
      const newSettings = { ...settings, logoUrl: localUrl };
      setSettings(newSettings);
      await dbService.saveSettings(newSettings);

      // 4. Try upload to server (Secondary)
      const formData = new FormData();
      formData.append('action', 'upload_logo');
      formData.append('logo', file);
      fetch('api.php', { method: 'POST', body: formData }).catch(() => {});

      return localUrl;
    } catch (e) {
      console.error("Local logo save failed", e);
      return null;
    }
  };

  const handleUploadDarkLogo = async (file: File): Promise<string | null> => {
    try {
      // 1. Save to Local DB
      await dbService.saveFile('shop_dark_logo', file);
      
      // 2. Create URL
      const localUrl = URL.createObjectURL(file);
      
      // 3. Update Settings immediately
      const newSettings = { ...settings, darkLogoUrl: localUrl };
      setSettings(newSettings);
      await dbService.saveSettings(newSettings);

      return localUrl;
    } catch (e) {
      console.error("Local dark logo save failed", e);
      return null;
    }
  };

  const handleUploadBackground = async (file: File): Promise<string | null> => {
    try {
      // 1. Save to Local DB
      await dbService.saveFile('custom_bg', file);
      
      // 2. Create URL
      const localUrl = URL.createObjectURL(file);
      
      // 3. Update Settings immediately
      const newSettings = { ...settings, customBackgroundUrl: localUrl, themePreference: 'custom' };
      setSettings(newSettings);
      await dbService.saveSettings(newSettings);

      return localUrl;
    } catch (e) {
      console.error("Local background save failed", e);
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
        
        // 1. Save File Blob to DB
        await dbService.saveFile(id, file);

        // 2. Create Metadata
        const newItem: MediaItem = {
            id,
            type: type as 'image' | 'video',
            url: URL.createObjectURL(file), // Immediate display
            title: file.name.split('.')[0]
        };
        newMediaItems.push(newItem);
    }

    // Update State
    const updatedList = [...mediaItems, ...newMediaItems];
    setMediaItems(updatedList);
    
    // Save Metadata to DB
    await dbService.saveMediaItems(updatedList);

    // Try Server Sync (Optional)
    try {
        const formData = new FormData();
        formData.append('action', 'upload_media');
        filesArray.forEach(f => formData.append('files[]', f));
        fetch('api.php', { method: 'POST', body: formData }).catch(console.error);
    } catch(e) {}
  };

  const handleDeleteMedia = async (id: string) => {
    const updatedList = mediaItems.filter(item => item.id !== id);
    setMediaItems(updatedList);
    
    // Remove from DB
    await dbService.saveMediaItems(updatedList); // Update list
    await dbService.deleteFile(id); // Remove blob

    // Server Sync
    try {
        const formData = new FormData();
        formData.append('action', 'delete_media');
        formData.append('id', id);
        fetch('api.php', { method: 'POST', body: formData }).catch(console.error);
    } catch(e) {}
  };

  const handleReorderMedia = async (reorderedItems: MediaItem[]) => {
    setMediaItems(reorderedItems);
    await dbService.saveMediaItems(reorderedItems);
    
    // Server Sync
    try {
        const formData = new FormData();
        formData.append('action', 'reorder_media');
        formData.append('media', JSON.stringify(reorderedItems));
        fetch('api.php', { method: 'POST', body: formData }).catch(console.error);
    } catch(e) {}
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

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24 relative z-10">
        {/* Header Section */}
        <DashboardHeader settings={settings} isDarkMode={isDarkMode} />

        {/* Main Grid for Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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