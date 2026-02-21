import React, { useState, useEffect, useRef } from 'react';
import { AppSettings } from '../types';
import { FESTIVAL_THEMES } from '../utils/festivalTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onUploadLogo: (file: File) => Promise<string | null>;
  onUploadDarkLogo: (file: File) => Promise<string | null>;
  onUploadBackground: (file: File) => Promise<string | null>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onBack,
  currentSettings, 
  onSave, 
  onUploadLogo,
  onUploadDarkLogo,
  onUploadBackground
}) => {
  const [shopName, setShopName] = useState(currentSettings.shopName);
  const [logoUrl, setLogoUrl] = useState(currentSettings.logoUrl);
  const [darkLogoUrl, setDarkLogoUrl] = useState(currentSettings.darkLogoUrl || '');
  const [themePreference, setThemePreference] = useState(currentSettings.themePreference || 'auto');
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState(currentSettings.customBackgroundUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDarkLogoUploading, setIsDarkLogoUploading] = useState(false);
  const [isBgUploading, setIsBgUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const darkLogoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShopName(currentSettings.shopName);
      setLogoUrl(currentSettings.logoUrl);
      setDarkLogoUrl(currentSettings.darkLogoUrl || '');
      setThemePreference(currentSettings.themePreference || 'auto');
      setCustomBackgroundUrl(currentSettings.customBackgroundUrl || '');
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      const url = await onUploadLogo(file);
      setIsUploading(false);
      if (url) {
        setLogoUrl(url);
      } else {
        alert('Failed to upload logo.');
      }
    }
  };

  const handleDarkLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsDarkLogoUploading(true);
      const url = await onUploadDarkLogo(file);
      setIsDarkLogoUploading(false);
      if (url) {
        setDarkLogoUrl(url);
      } else {
        alert('Failed to upload dark mode logo.');
      }
    }
  };

  const handleBackgroundChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsBgUploading(true);
      const url = await onUploadBackground(file);
      setIsBgUploading(false);
      if (url) {
        setCustomBackgroundUrl(url);
        setThemePreference('custom'); // Automatically switch to custom theme
      } else {
        alert('Failed to upload background.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      shopName,
      logoUrl,
      darkLogoUrl,
      themePreference,
      customBackgroundUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-slate-800 px-6 py-4 flex items-center gap-4 shrink-0">
          <button onClick={onBack || onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 className="text-xl font-bold text-white font-serif">Shop Settings</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          
          {/* Shop Name Input */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Shop Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-slate-800 font-serif"
              placeholder="Enter Shop Name"
            />
          </div>

          {/* Theme Selection Section */}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Theme Selection</label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Auto Option */}
              <div 
                className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all h-24 flex flex-col items-center justify-center ${themePreference === 'auto' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => setThemePreference('auto')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 opacity-50"></div>
                <span className="relative z-10 font-medium text-slate-700">Auto Detect</span>
                <span className="relative z-10 text-xs text-slate-500">(Based on Date)</span>
              </div>

              {/* Standard Themes */}
              {Object.values(FESTIVAL_THEMES).map(theme => (
                <div 
                  key={theme.id}
                  className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all h-24 group ${themePreference === theme.id ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200 hover:border-slate-300'}`}
                  onClick={() => setThemePreference(theme.id)}
                >
                  {/* Theme Preview Background */}
                  <div className={`absolute inset-0 ${theme.backgroundClass}`}></div>
                  {theme.overlayClass && <div className={`absolute inset-0 ${theme.overlayClass}`}></div>}
                  
                  {/* Label */}
                  <div className="absolute inset-x-0 bottom-0 bg-white/90 py-1 text-center text-xs font-semibold text-slate-800">
                    {theme.name}
                  </div>
                </div>
              ))}

              {/* Custom Option */}
              <div 
                className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all h-24 flex flex-col items-center justify-center group ${themePreference === 'custom' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => setThemePreference('custom')}
              >
                {customBackgroundUrl ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${customBackgroundUrl})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-white/90 py-1 text-center text-xs font-semibold text-slate-800 z-10">
                  Custom
                </div>
              </div>
            </div>

            {/* Custom Upload Control - Only visible if Custom is selected */}
            {themePreference === 'custom' && (
              <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Custom Background</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => bgInputRef.current?.click()}
                    disabled={isBgUploading}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    {isBgUploading ? (
                      <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    )}
                    Choose Image
                  </button>
                  <input
                    type="file"
                    ref={bgInputRef}
                    onChange={handleBackgroundChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {customBackgroundUrl && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Image Set
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logo Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Mode Logo */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Light Mode Logo</label>
              <div className="flex flex-col gap-3">
                <div 
                  className="w-full aspect-square max-w-[150px] rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500 transition-colors relative mx-auto md:mx-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  ) : logoUrl ? (
                    <img src={logoUrl} alt="Light Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xs text-slate-400 text-center px-1">No Logo</span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors text-sm"
                  >
                    {logoUrl ? 'Change Light Logo' : 'Upload Light Logo'}
                  </button>
                  {logoUrl && (
                    <button 
                      type="button" 
                      onClick={() => setLogoUrl('')}
                      className="text-xs text-red-500 hover:text-red-700 font-medium text-center"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Dark Mode Logo */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Dark Mode Logo</label>
              <div className="flex flex-col gap-3">
                <div 
                  className="w-full aspect-square max-w-[150px] rounded-lg border-2 border-dashed border-slate-600 bg-slate-800 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500 transition-colors relative mx-auto md:mx-0"
                  onClick={() => darkLogoInputRef.current?.click()}
                >
                  {isDarkLogoUploading ? (
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  ) : darkLogoUrl ? (
                    <img src={darkLogoUrl} alt="Dark Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xs text-slate-500 text-center px-1">No Logo</span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={darkLogoInputRef}
                    onChange={handleDarkLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => darkLogoInputRef.current?.click()}
                    disabled={isDarkLogoUploading}
                    className="w-full px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors text-sm"
                  >
                    {darkLogoUrl ? 'Change Dark Logo' : 'Upload Dark Logo'}
                  </button>
                  {darkLogoUrl && (
                    <button 
                      type="button" 
                      onClick={() => setDarkLogoUrl('')}
                      className="text-xs text-red-400 hover:text-red-300 font-medium text-center"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            Recommended size: 200x200px or larger. PNG or JPG.
          </div>

          <div className="pt-4 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 shadow-md hover:shadow-lg transition-all"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;