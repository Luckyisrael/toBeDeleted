import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setAccessToken, getAccessToken } from '../utils/local-storage/accessToken';
import { setRefreshToken, getRefreshToken } from '../utils/local-storage/refreshToken';
import { mmkvStorage, zustandMMKVStorage } from 'app/utils/local-storage/localStorage';

// Define your store types
interface UserState {
  userType: 'customer' | null;
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUserType: (type: 'customer') => void;
  setUser: (user: any | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userType: null,
      user: null,
      accessToken: getAccessToken() ?? null,
      refreshToken: getRefreshToken() ?? null,
      setUserType: (type) => set({ userType: type }),
      setUser: (user) => set({ user }),
      setAccessToken: (token) => {
        if (token) {
          setAccessToken(token);
        }
        set({ accessToken: token });
      },
      setRefreshToken: (token) => {
        setRefreshToken(token);
        set({ refreshToken: token });
      },
      clearUser: () => {
        set({
          user: null,
          userType: null,
          accessToken: null,
          refreshToken: null,
        });
        mmkvStorage.delete('user-storage');
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }),
    }
  )
);

export default useUserStore;
