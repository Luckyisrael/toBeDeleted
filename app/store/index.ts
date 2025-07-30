import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
    id: 'app-storage',
    encryptionKey: "demo-setup",
});

export const APP_MMKVStorage: StateStorage = {
  setItem: (name: string, value: any) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};