import { axios } from 'app/config/axios';
import useSWR from 'swr';

const GET_VENDOR_ENDPOINT = 'market/getVendor';

export const useGetVendor = (storeId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    storeId ? `${GET_VENDOR_ENDPOINT}/${storeId}` : null,
    async () => {
      return axios({
        url: `${GET_VENDOR_ENDPOINT}/${storeId}`, 
        method: 'GET',
      })
    }
  );

  return {
    data,
    isLoading,
    error,
    refresh: mutate, // Re-fetch the data manually if needed
  };
};
