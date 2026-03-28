import { MetalRate, MediaItem, AppSettings } from '../types';

// API Service using PHP backend
// All data is stored via api.php in 'data/store.json' and 'data/uploads/'

export const dbService = {
  // --- Settings ---
  async saveSettings(settings: AppSettings) {
    try {
      const formData = new FormData();
      formData.append('action', 'save_settings');
      formData.append('settings', JSON.stringify(settings));

      await fetch('/api.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  async getSettings(): Promise<AppSettings | null> {
    try {
      const res = await fetch('/api.php?action=get_data', { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.settings || null;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return null;
    }
  },

  // --- Rates ---
  async saveRates(rates: MetalRate[]) {
    try {
      const formData = new FormData();
      formData.append('action', 'save_rates');
      formData.append('rates', JSON.stringify(rates));

      await fetch('/api.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to save rates:', error);
    }
  },

  async getRates(): Promise<MetalRate[] | null> {
    try {
      const res = await fetch('/api.php?action=get_data', { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.rates && data.rates.length > 0 ? data.rates : null;
    } catch (error) {
      console.error('Failed to get rates:', error);
      return null;
    }
  },

  // --- Files (Uploads) ---
  async uploadFile(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('action', 'upload_file');
      formData.append('file', file);
      
      const res = await fetch('/api.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        console.error('Upload failed with status', res.status);
        return null;
      }
      
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        return data.url; // Returns the server path e.g., "/data/uploads/filename.jpg"
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        return null;
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      return null;
    }
  },
  
  async deleteFile(url: string) {
    try {
      const formData = new FormData();
      formData.append('action', 'delete_file');
      formData.append('url', url);

      await fetch('/api.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  },

  // --- Media Items ---
  async saveMediaItems(items: MediaItem[]) {
    try {
      const formData = new FormData();
      formData.append('action', 'save_media');
      formData.append('mediaItems', JSON.stringify(items));

      await fetch('/api.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to save media items:', error);
    }
  },

  async getMediaItems(): Promise<MediaItem[]> {
    try {
      const res = await fetch('/api.php?action=get_data', { credentials: 'include' });
      if (!res.ok) return [];
      const data = await res.json();
      return data.mediaItems || [];
    } catch (error) {
      console.error('Failed to get media items:', error);
      return [];
    }
  }
};

