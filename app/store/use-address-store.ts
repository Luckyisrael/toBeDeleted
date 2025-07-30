import { zustandMMKVStorage } from 'app/utils/local-storage/localStorage';
import {create }from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


interface AddressState {
  address: string | null;
  postcode: string | null;
  city: string | null; // Added city
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  setAddress: (address: string, postcode: string, city: string, latitude: number, longitude: number) => void;
  clearAddress: () => void;
}

const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: null,
      postcode: null,
      city: null, 
      latitude: null,
      longitude: null,
      isLoading: true,

      setAddress: (address: string, postcode: string, city: string, latitude: number, longitude: number) => {
        set({ 
          address,
          postcode,
          city, 
          latitude,
          longitude 
        });
      },

      clearAddress: () => {
        set({ 
          address: null,
          postcode: null,
          city: null, // Added city
          latitude: null,
          longitude: null 
        });
      },
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({ 
        address: state.address,
        postcode: state.postcode,
        city: state.city, // Added city
        latitude: state.latitude,
        longitude: state.longitude 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

export default useAddressStore;