// app/utils/storage/mmkvStorage.ts
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Single MMKV instance for the entire app
export const mmkvStorage = new MMKV({
  id: 'app-storage',
});

// Zustand storage adapter
export const zustandMMKVStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = mmkvStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkvStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkvStorage.delete(name);
  },
};

// Helper function to clear all storage
export const clearAllStorage = () => {
  mmkvStorage.clearAll();
};