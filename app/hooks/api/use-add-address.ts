import { useAccessToken } from 'app/utils/local-storage/accessToken';
import { useCallback, useMemo, useState } from 'react';
import useAlert from '../useAlert';
import { axios } from 'app/config/axios';


export const usePostUserAddress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { errorAlert, successAlert } = useAlert();
  const accessToken = useAccessToken();

  const postAddress = useCallback(
    async function postAddress({
      address,
      phone,
      postCode,
      successCallback,
    }: {
      address: string;
      phone: string;
      postCode: string;
      successCallback?: () => void;
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `user/addDeliveryAddress`,
          method: 'POST',
          data: { address, phone, postCode },
        });
          successCallback?.();
          return response;
      } catch (error: any) {
        console.log('API error from saving address:', error); 
        errorAlert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, accessToken, errorAlert, successAlert]
  );

  return useMemo(
    () => ({
      postAddress,
      isLoading,
    }),
    [postAddress, isLoading]
  );
};