export interface MetalRate {
  id: string;
  metal: 'Gold' | 'Silver';
  purityLabel: string; // e.g., "24K", "22K", "Ag"
  purityPercentage: string; // e.g., "99.5%", "91.6%"
  price: number;
  currency: string;
  unit: string; // e.g. "10 Grams", "1 Kg"
  trend?: 'up' | 'down' | 'stable';
  colorClass: string; // Tailwind color class key for background
}

export interface ProductBreakdown {
  id: string;
  item: string;
  purity: string;
  weight: string;
  makingCharges: string;
  tax: string;
  total: number;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
}