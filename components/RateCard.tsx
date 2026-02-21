import React from 'react';
import { MetalRate } from '../types';

interface RateCardProps {
  rate: MetalRate;
}

const RateCard: React.FC<RateCardProps> = ({ rate }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: rate.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isGold = rate.metal === 'Gold';

  return (
    <div className="relative group h-full transform transition-all duration-500 hover:-translate-y-2">
      {/* Subtle Shadow instead of colored glow */}
      <div className="absolute -inset-0.5 bg-slate-200 rounded-2xl opacity-50 group-hover:opacity-100 blur-sm transition duration-500"></div>
      
      {/* Main Card Content - Pure White */}
      <div className="relative h-full bg-white rounded-2xl p-6 flex flex-col items-center justify-between border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Header: Metal Type & Purity */}
        <div className="w-full flex flex-col items-center z-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase mb-2 text-slate-400">
            {rate.metal}
          </span>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-serif font-bold text-slate-800">
              {rate.purityLabel}
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
              {rate.purityPercentage}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="w-full py-8 flex flex-col items-center z-10">
          <div className="text-5xl font-bold text-slate-900 tracking-tighter">
            {formatPrice(rate.price)}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wide">
            Per {rate.unit}
          </p>
        </div>

        {/* Footer / Action (Visual only) */}
        <div className="w-full h-px bg-slate-100"></div>
      </div>
    </div>
  );
};

export default RateCard;