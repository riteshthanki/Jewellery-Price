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
    <div className="w-full flex flex-col items-center justify-center mb-6 md:mb-10 lg:mb-12 xl:mb-16 animate-fade-in relative z-10 px-4">
      {displayLogoUrl ? (
        <div className="mb-6 md:mb-8 xl:mb-12 relative group w-full flex justify-center">
           <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
           <img 
            src={displayLogoUrl} 
            alt={settings.shopName || "Shop Logo"} 
            className="relative h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 2xl:h-64 portrait:h-48 portrait:md:h-64 w-auto max-w-full object-contain drop-shadow-2xl transform transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : (
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl portrait:text-6xl portrait:md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 tracking-wider uppercase mb-4 md:mb-6 xl:mb-10 portrait:mb-8 text-center drop-shadow-sm break-words max-w-full leading-tight">
          {settings.shopName}
        </h1>
      )}
      
      <div className="flex items-center space-x-2 md:space-x-4 xl:space-x-6 bg-white/50 dark:bg-black/50 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 xl:px-8 xl:py-3 rounded-full border border-white/20 dark:border-white/10 shadow-sm transition-all hover:bg-white/60 dark:hover:bg-black/60">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 xl:w-3 xl:h-3 rounded-full bg-red-500 animate-pulse shrink-0"></div>
        <p className="text-slate-700 dark:text-slate-200 font-mono text-xs sm:text-sm md:text-base xl:text-xl 2xl:text-2xl portrait:text-xl portrait:md:text-3xl tracking-wide whitespace-nowrap">
          {formatDate(currentDate)}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;