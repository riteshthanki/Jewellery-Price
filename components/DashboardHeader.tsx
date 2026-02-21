import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';

interface DashboardHeaderProps {
  settings: AppSettings;
  isDarkMode?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ settings, isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${day} ${month} ${year} at ${hours}:${strMinutes} ${ampm}`;
  };

  // Determine which logo to show
  const displayLogoUrl = (isDarkMode && settings.darkLogoUrl) ? settings.darkLogoUrl : settings.logoUrl;

  return (
    <div className="w-full flex flex-col items-center justify-center mb-12 animate-fade-in relative z-10">
      {displayLogoUrl ? (
        <div className="mb-8 relative group">
           <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
           <img 
            src={displayLogoUrl} 
            alt={settings.shopName || "Shop Logo"} 
            className="relative h-32 md:h-40 w-auto object-contain drop-shadow-2xl transform transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : (
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 tracking-wider uppercase mb-6 text-center drop-shadow-sm">
          {settings.shopName}
        </h1>
      )}
      
      <div className="flex items-center space-x-4 bg-white/50 dark:bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 dark:border-white/10 shadow-sm">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <p className="text-slate-700 dark:text-slate-200 font-mono text-sm md:text-base tracking-wide">
          {formatDate(currentDate)}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;