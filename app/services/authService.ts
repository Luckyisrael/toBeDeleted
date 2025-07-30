import { setAccessToken, setVendorAccessToken } from '../utils/local-storage/accessToken';
import { setRefreshToken, setVendorRefreshToken } from '../utils/local-storage/refreshToken';
import useUserStore from '../store/use-user-store';
import useVendorStore from '../store/use-vendor-store';
import { mmkvStorage } from 'app/utils/local-storage/localStorage';
import { logoutUser, logoutVendor } from 'app/utils/authUtils';
import { navigationRef } from 'App';
import { mutate } from 'swr';

const ACTIVE_USER_TYPE_KEY = 'active-user-type';

const setActiveUserType = (type: 'customer' | 'vendor' | null) => {
  if (type) {
    mmkvStorage.set(ACTIVE_USER_TYPE_KEY, type);
  } else {
    mmkvStorage.delete(ACTIVE_USER_TYPE_KEY);
  }
};

export const getActiveUserType = (): 'customer' | 'vendor' | null => {
  return mmkvStorage.getString(ACTIVE_USER_TYPE_KEY) as 'customer' | 'vendor' | null;
};

export const authenticateUser = (userData: any, tokens: any) => {
  const currentUserType = getActiveUserType();
  if (currentUserType === 'vendor') {
    logoutVendor();
  }
  
  const setUser = useUserStore.getState().setUser;
  const setUserType = useUserStore.getState().setUserType;
  const setTokenToStore = useUserStore.getState().setAccessToken;
  const setRefreshTokenToStore = useUserStore.getState().setRefreshToken;
  
  setActiveUserType('customer');
  setTokenToStore(tokens.accessToken);
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  setRefreshTokenToStore(tokens.refreshToken);
  setUser(userData);
  setUserType('customer');
  
  return tokens.accessToken;
};

export const authenticateVendor = (vendorData: any, tokens: any) => {
  const currentUserType = getActiveUserType();
  if (currentUserType === 'customer') {
    logoutUser();
  }
  
  const setVendor = useVendorStore.getState().setVendor;
  const setUserType = useVendorStore.getState().setUserType;
  const setVendorTokenToStore = useVendorStore.getState().setVendorAccessToken;
  const setVendorRefreshTokenToStore = useVendorStore.getState().setVendorRefreshToken;
  
  setActiveUserType('vendor');
  setVendorTokenToStore(tokens.accessToken);
  setVendorAccessToken(tokens.accessToken);
  setVendorRefreshToken(tokens.refreshToken);
  setVendorRefreshTokenToStore(tokens.refreshToken);
  setVendor(vendorData);
  setUserType('vendor');
  
  return tokens.accessToken;
};

export const logout = () => {
  const currentUserType = getActiveUserType();
  
  if (navigationRef.isReady()) {
    
    // Defer clearing until navigation is processed
    setTimeout(() => {
      if (currentUserType === 'customer') {
        logoutUser();
      } else if (currentUserType === 'vendor') {
        logoutVendor();
      }
      setActiveUserType(null);
      mutate(() => true, undefined, { revalidate: false });
    }, 100); // Increased delay to ensure navigation completes
  } else {
    console.warn('Navigation not ready during logout');
    // Fallback: clear data immediately
    if (currentUserType === 'customer') {
      logoutUser();
    } else if (currentUserType === 'vendor') {
      logoutVendor();
    }
    setActiveUserType(null);
    mutate(() => true, undefined, { revalidate: false });
  }
};