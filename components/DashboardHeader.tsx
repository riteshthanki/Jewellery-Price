import React, { useState, useEffect } from 'react';

const DashboardHeader: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    // Mimic format: "13 February 2026 at 03:52 pm"
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${day} ${month} ${year} at ${hours}:${strMinutes} ${ampm}`;
  };

  return (
    <div className="w-full flex justify-center mb-8">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-lg w-full max-w-3xl text-center border-t-4 border-amber-500">
        <div className="flex justify-center mb-4">
          <img 
            src="/logo.png" 
            alt="Jay Mataji Jewellers" 
            className="h-28 md:h-40 object-contain mx-auto"
            onError={(e) => {
              // Fallback to text if logo.png is missing or fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const text = document.createElement('h1');
                text.className = "text-3xl md:text-5xl font-serif font-bold text-amber-600 mb-2 tracking-wide uppercase";
                text.innerText = "Jay Mataji Jewellers";
                parent.appendChild(text);
              }
            }}
          />
        </div>
        <p className="text-slate-600 font-medium text-lg md:text-xl">
          {formatDate(currentDate)}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;