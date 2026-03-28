import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '../types';

interface MediaCarouselProps {
  media: MediaItem[];
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ media }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (media.length === 0) return;
    setActiveIndex((current) => (current + 1) % media.length);
  }, [media.length]);

  const prevSlide = () => {
    if (media.length === 0) return;
    setActiveIndex((current) => (current - 1 + media.length) % media.length);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (media.length <= 1) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide, media.length]);

  // Reset index if media changes and index is out of bounds
  useEffect(() => {
    if (activeIndex >= media.length) {
      setActiveIndex(0);
    }
  }, [media.length, activeIndex]);

  if (!media.length) {
    return (
      <div className="w-full max-w-full mx-auto mt-8 xl:mt-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-2xl aspect-video md:aspect-[21/9] portrait:aspect-[4/3] portrait:md:aspect-[4/3] transition-colors duration-300">
        <p className="text-slate-500 font-serif text-lg xl:text-3xl">No media available to display.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto mt-8 xl:mt-12 relative group">
      {/* Main Display Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-slate-200 dark:bg-slate-900 aspect-video md:aspect-[21/9] portrait:aspect-[4/3] portrait:md:aspect-[4/3] transition-colors duration-300">
        {media.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.title || 'Jewelry display'}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={item.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Gradient Overlay & Title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-8 md:pb-12 xl:pb-20">
              {item.title && (
                <h3 className="text-white text-2xl md:text-4xl xl:text-6xl 2xl:text-7xl portrait:text-5xl portrait:md:text-7xl font-serif font-bold tracking-wider drop-shadow-lg transform transition-transform duration-700 translate-y-0 opacity-100">
                  {item.title}
                </h3>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 xl:p-4 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 xl:w-10 xl:h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 xl:p-4 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 xl:w-10 xl:h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Indicators */}
        {media.length > 1 && (
          <div className="absolute bottom-4 xl:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2 xl:space-x-4">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 xl:w-4 xl:h-4 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-amber-500 w-8 xl:w-12' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCarousel;