import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from 'app/utils/local-storage/localStorage';

interface FavoritesState {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (productId) => 
        set({ favorites: [...get().favorites, productId] }),
      removeFavorite: (productId) => 
        set({ favorites: get().favorites.filter(id => id !== productId) }),
      isFavorite: (productId) => 
        get().favorites.includes(productId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);