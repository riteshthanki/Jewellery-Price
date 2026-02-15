import React from 'react';
import { ProductBreakdown } from '../types';

const mockData: ProductBreakdown[] = [
  { id: '1', item: 'Gold Ring', purity: '22K', weight: '5.00 g', makingCharges: '12%', tax: '3%', total: 38500 },
  { id: '2', item: 'Gold Chain', purity: '22K', weight: '12.50 g', makingCharges: '10%', tax: '3%', total: 95400 },
  { id: '3', item: 'Silver Anklet', purity: '92.5%', weight: '25.00 g', makingCharges: '₹500', tax: '3%', total: 2850 },
  { id: '4', item: 'Diamond Pendant', purity: '18K', weight: '2.30 g', makingCharges: '15%', tax: '3%', total: 42100 },
];

const DetailedBreakdown: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-800 py-4 px-6 border-b border-slate-700">
        <h2 className="text-2xl font-serif font-bold text-white text-center">Detailed Price Breakdown</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Item</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Purity</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Making Charges</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Tax (GST)</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">Est. Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockData.map((row) => (
              <tr key={row.id} className="hover:bg-amber-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">{row.item}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{row.purity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{row.weight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{row.makingCharges}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{row.tax}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-amber-700 font-bold">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-6 py-3 text-right text-xs text-slate-400 italic border-t border-slate-100">
        * Prices are indicative and subject to market fluctuations.
      </div>
    </div>
  );
};

export default DetailedBreakdown;