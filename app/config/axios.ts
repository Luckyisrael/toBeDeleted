// app/config/axios.ts
import axios, { AxiosError } from 'axios';
import type { Method, AxiosRequestHeaders, ResponseType } from 'axios';
import { BASE_URL } from 'app/utils/constants';
import { Logger } from 'app/utils';
import useUserStore from 'app/store/use-user-store';

export type AxiosOverrides = {
  skipAuthorization?: boolean;
};

export type AxiosParams = {
  url: string;
  method: Method;
  data?: unknown;
  unmountSignal?: AbortSignal;
  overrides?: AxiosOverrides;
  headers?: Partial<AxiosRequestHeaders>;
  timeout?: number;
  responseType?: ResponseType;
  accessToken?: string;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor to dynamically set the default Authorization header with user token
axiosInstance.interceptors.request.use((config) => {
  const userAccessToken = useUserStore.getState().accessToken; // Default to user token
  const providedToken = (config as AxiosParams).accessToken; // Check for override token

  // Use provided token if available, otherwise fall back to user token
  const tokenToUse = providedToken !== undefined ? providedToken : userAccessToken;

  if (!config.headers) {
    config.headers = {} as AxiosRequestHeaders;
  }

  if (tokenToUse && !config.overrides?.skipAuthorization) {
    config.headers['Authorization'] = `Bearer ${tokenToUse}`;
    Logger.log(`[Axios] Using token: ${tokenToUse.slice(0, 10)}... for ${config.url}`);
  } else if (!config.overrides?.skipAuthorization) {
    Logger.warn(`[Axios] No token available for ${config.url}`);
  }

  return config;
});

const axiosAPI = async ({
  url,
  method,
  data,
  unmountSignal,
  headers,
  overrides,
  timeout = 120000,
  accessToken,
  ...rest
}: AxiosParams) => {
  Logger.log(`[Request] URL: ${url}, Method: ${method}`);

  const request = {
    url,
    method,
    data,
    signal: unmountSignal,
    timeout,
    headers: {
      ...headers, // Merge any additional headers
    } as AxiosRequestHeaders,
    accessToken, // Pass the override token to the interceptor
    overrides,   
    ...rest,
  };

  try {
    const response = await axiosInstance(request);
    //Logger.log(`[Response] ${url}:`, response.data);
    return response.data;
  } catch (error: any) {
    Logger.error('[Error] Failed request:', error.response?.data || error.message);
    if (error.response?.data?.message) {
      throw { message: error.response.data.message };
    }
    throw error;
  }
};

export { axiosAPI as axios };
export const fetcher = (url: string, accessToken?: string) =>
  axiosAPI({ url, method: 'GET', accessToken });