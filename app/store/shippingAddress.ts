import { zustandMMKVStorage } from 'app/utils/local-storage/localStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ShippingAddressStore = {
  postCode: string | null;
  shippingAddress: string | null;
  setPostCode: (postCode: string) => void;
  setShippingAddress: (address: string) => void;
  clearShippingAddress: () => void;
};


export const useShippingAddressStore = create<ShippingAddressStore>()(
  persist(
    (set) => ({
      postCode: null,
      shippingAddress: null,
      setPostCode: (postCode: string) => set({ postCode: postCode }),
      setShippingAddress: (address: string) => set({ shippingAddress: address }),
      clearShippingAddress: () => set({ shippingAddress: null, postCode: null }),
    }),
    {
      name: 'shipping-address-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
