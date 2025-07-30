import { axios } from 'app/config/axios';
import useSWR from 'swr';

const MARKET_BY_LOCATION_ENDPOINT = 'market/findByPostCode'; 

interface LocationQuery {
  lat: number;
  lng: number;
  postCode?: string;
}

export const useSearchMarketByLocation = (locationData: LocationQuery | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    locationData ? MARKET_BY_LOCATION_ENDPOINT : null,
    async () => {
      return axios({
        url: MARKET_BY_LOCATION_ENDPOINT,
        method: 'POST',
        data: locationData, 
      });
    }
  );

  return {
    data,
    isLoading,
    error,
    refresh: mutate,
  };
};