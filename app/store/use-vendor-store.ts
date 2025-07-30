import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { 
  setVendorAccessToken,
  getVendorAccessToken,  
} from '../utils/local-storage/accessToken';
import { getVendorRefreshToken, setVendorRefreshToken } from '../utils/local-storage/refreshToken';
import { mmkvStorage, zustandMMKVStorage } from 'app/utils/local-storage/localStorage';

interface VendorState {
  userType: 'vendor' | null; 
  vendor: any | null;
  vendorAccessToken: string | null;
  vendorRefreshToken: string | null;
  setUserType: (type: 'vendor') => void;
  setVendor: (vendor: any | null) => void;
  setVendorAccessToken: (token: string | null) => void;
  setVendorRefreshToken: (token: string | null) => void;
  clearVendor: () => void;
}

const useVendorStore = create<VendorState>()(
  persist(
    (set) => ({
      userType: null,
      vendor: null,
      vendorAccessToken: getVendorAccessToken() ?? null,
      vendorRefreshToken: getVendorRefreshToken() ?? null,
      setUserType: (type) => set({ userType: type }),
      setVendor: (vendor) => set({ vendor }),
      
      setVendorAccessToken: (token) => {
        if (token) {
          setVendorAccessToken(token);
        } else {
          // implement token removal if needed
        }
        set({ vendorAccessToken: token });
      },
      
      setVendorRefreshToken: (token) => {
        if (token) {
          setVendorRefreshToken(token);
        } else {
          // implement token removal 
        }
        set({ vendorRefreshToken: token });
      },
      
      clearVendor: () => {
        set({ 
          vendor: null,
          vendorAccessToken: null,
          vendorRefreshToken: null 
        });
        mmkvStorage.delete('vendor-storage');
      }
    }),
    {
      name: 'vendor-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        vendor: state.vendor,
        vendorAccessToken: state.vendorAccessToken,
        vendorRefreshToken: state.vendorRefreshToken
      }),
    }
  )
);

export default useVendorStore;