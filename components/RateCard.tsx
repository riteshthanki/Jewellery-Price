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
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-between h-full transform transition-transform hover:-translate-y-1 duration-300 border-b-4 border-slate-100">
      <div className="flex flex-col items-center mb-4">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3 ${rate.colorClass}`}
        >
          {rate.purityLabel}
        </div>
        <div className="text-slate-700 font-semibold text-lg">
          {rate.purityPercentage} Purity
        </div>
      </div>
      
      <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-center">
        <span className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight block">
          {formatPrice(rate.price)}
        </span>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 block">
          Per {rate.unit}
        </span>
      </div>
    </div>
  );
};

export default RateCard;