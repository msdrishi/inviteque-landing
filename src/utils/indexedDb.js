/**
 * IndexedDB storage utility for wedding templates.
 * Provides hundreds of megabytes of persistent storage, avoiding localStorage quota errors.
 */

const DB_NAME = 'InvitequeCustomTemplatesDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_templates';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function setPersistentItem(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ key, value, updatedAt: Date.now() });

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn('IndexedDB setItem notice:', err);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (lsErr) {}
    return false;
  }
}

export async function getPersistentItem(key) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = (e) => {
        if (e.target.result && e.target.result.value) {
          resolve(e.target.result.value);
        } else {
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem(key);
            resolve(raw ? JSON.parse(raw) : null);
          } catch {
            resolve(null);
          }
        }
      };

      request.onerror = () => {
        try {
          const raw = localStorage.getItem(key);
          resolve(raw ? JSON.parse(raw) : null);
        } catch {
          resolve(null);
        }
      };
    });
  } catch (err) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
