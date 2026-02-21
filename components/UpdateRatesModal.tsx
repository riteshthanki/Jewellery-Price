import React, { useState, useEffect } from 'react';
import { MetalRate } from '../types';

interface UpdateRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  currentRates: MetalRate[];
  onSave: (updatedRates: MetalRate[]) => void;
}

const UpdateRatesModal: React.FC<UpdateRatesModalProps> = ({ isOpen, onClose, onBack, currentRates, onSave }) => {
  const [editedRates, setEditedRates] = useState<MetalRate[]>(currentRates);

  useEffect(() => {
    setEditedRates(currentRates);
  }, [currentRates, isOpen]);

  if (!isOpen) return null;

  const handleChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    setEditedRates(prev => prev.map(rate => 
      rate.id === id ? { ...rate, price: isNaN(price) ? 0 : price } : rate
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedRates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
        <div className="bg-slate-800 px-6 py-4 flex items-center gap-4">
          <button onClick={onBack || onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 className="text-xl font-bold text-white font-serif">Update Daily Rates</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {editedRates.map((rate) => (
              <div key={rate.id} className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                  <span>{rate.metal} <span className={`${rate.metal === 'Gold' ? 'text-amber-600' : 'text-slate-500'}`}>{rate.purityLabel}</span></span>
                  <span className="text-slate-400 font-normal text-xs uppercase tracking-wide">{rate.unit}</span>
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-amber-500 transition-colors">₹</span>
                  <input
                    type="number"
                    value={rate.price}
                    onChange={(e) => handleChange(rate.id, e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono text-lg text-slate-800"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex gap-3">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRatesModal;