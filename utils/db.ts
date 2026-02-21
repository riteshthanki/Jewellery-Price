import { MetalRate, MediaItem, AppSettings } from '../types';

const DB_NAME = 'JewelleryDashboardDB';
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store for App Settings (Shop Name, Logo)
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      
      // Store for Rates
      if (!db.objectStoreNames.contains('rates')) {
        db.createObjectStore('rates', { keyPath: 'id' }); // 'rates' as a single blob or individual items
      }
      
      // Store for Media Metadata (order, titles)
      if (!db.objectStoreNames.contains('mediaItems')) {
        db.createObjectStore('mediaItems', { keyPath: 'id' });
      }

      // Store for actual Media Files (Blobs)
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }
    };
  });
};

export const dbService = {
  async saveSettings(settings: AppSettings) {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      tx.objectStore('settings').put({ key: 'appSettings', value: settings });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getSettings(): Promise<AppSettings | null> {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get('appSettings');
      req.onsuccess = () => resolve(req.result?.value || null);
      req.onerror = () => resolve(null);
    });
  },

  async saveRates(rates: MetalRate[]) {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('rates', 'readwrite');
      const store = tx.objectStore('rates');
      // We store the whole array as one object for simplicity in this use case
      store.put({ id: 'currentRates', value: rates });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getRates(): Promise<MetalRate[] | null> {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction('rates', 'readonly');
      const req = tx.objectStore('rates').get('currentRates');
      req.onsuccess = () => resolve(req.result?.value || null);
      req.onerror = () => resolve(null);
    });
  },

  async saveFile(id: string, file: Blob) {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put({ id, data: file });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getFile(id: string): Promise<Blob | null> {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction('files', 'readonly');
      const req = tx.objectStore('files').get(id);
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    });
  },

  async deleteFile(id: string) {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
  },

  async saveMediaItems(items: MediaItem[]) {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('mediaItems', 'readwrite');
      const store = tx.objectStore('mediaItems');
      // Clear old list first to handle deletions/reorders purely
      store.clear(); 
      // Add all items
      items.forEach(item => {
        // We do NOT store the URL in DB if it is a blob URL, we reconstruct it on load
        // But for simplicity, we store the metadata. 
        // If it's an external URL (initial data), we keep it.
        // If it's local, we just need the ID to fetch the blob from 'files' store.
        store.put(item);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getMediaItems(): Promise<MediaItem[]> {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction('mediaItems', 'readonly');
      const req = tx.objectStore('mediaItems').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }
};
