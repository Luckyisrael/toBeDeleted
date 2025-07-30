import { mmkvStorage } from "./localStorage";
import { localStorageKeys } from "./localStorageKeys";

const REFRESH_TOKEN_KEY = localStorageKeys.REFRESH_TOKEN;

export const setRefreshToken = (token: string | null) => {
  if (token) {
    mmkvStorage.set(REFRESH_TOKEN_KEY, token);
  } else {
    mmkvStorage.delete(REFRESH_TOKEN_KEY);
  }
};

export const getRefreshToken = (): string | null => {
  return mmkvStorage.getString(REFRESH_TOKEN_KEY) || null;
};

const VENDOR_REFRESH_TOKEN_KEY = localStorageKeys.VENDOR_REFRESH_TOKEN;

export const setVendorRefreshToken = (token: string | null) => {
  if (token) {
    mmkvStorage.set(VENDOR_REFRESH_TOKEN_KEY, token);
  } else {
    mmkvStorage.delete(VENDOR_REFRESH_TOKEN_KEY);
  }
};

export const getVendorRefreshToken = (): string | null => {
  return mmkvStorage.getString(VENDOR_REFRESH_TOKEN_KEY) || null;
};