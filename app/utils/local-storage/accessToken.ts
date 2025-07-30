import { useEffect, useState } from "react";
import { mmkvStorage } from "./localStorage";
import { localStorageKeys } from "./localStorageKeys";

const ACCESS_TOKEN_STRING = localStorageKeys.ACCESS_TOKEN;

export function setAccessToken(token: string) {
  mmkvStorage.set(ACCESS_TOKEN_STRING, token);
}

export function getAccessToken() {
  return mmkvStorage.getString(ACCESS_TOKEN_STRING);
}

export function deleteAccessToken() {
  mmkvStorage.delete(ACCESS_TOKEN_STRING);
}

export function useAccessToken() {
  const [accessToken, setAccessToken] = useState(() => getAccessToken());

  useEffect(() => {
    const listener = mmkvStorage.addOnValueChangedListener(
      (changedKey) => {
        if (changedKey === ACCESS_TOKEN_STRING) {
          const newValue = getAccessToken();
          setAccessToken(newValue);
        }
      }
    );
    return () => {
      listener.remove();
    };
  }, []);

  return accessToken;
}

const VENDOR_ACCESS_TOKEN_STRING = localStorageKeys.VENDOR_ACCESS_TOKEN;

export function setVendorAccessToken(token: string) {
  mmkvStorage.set(VENDOR_ACCESS_TOKEN_STRING, token);
}

export function getVendorAccessToken() {
  return mmkvStorage.getString(VENDOR_ACCESS_TOKEN_STRING);
}

export function deleteVendorAccessToken() {
  mmkvStorage.delete(VENDOR_ACCESS_TOKEN_STRING);
}

export function useVendorAccessToken() {
  const [accessToken, setAccessToken] = useState(() => getVendorAccessToken());

  useEffect(() => {
    const listener = mmkvStorage.addOnValueChangedListener(
      (changedKey) => {
        if (changedKey === VENDOR_ACCESS_TOKEN_STRING) {
          const newValue = getVendorAccessToken();
          setAccessToken(newValue);
        }
      }
    );
    return () => {
      listener.remove();
    };
  }, []);

  return accessToken;
}