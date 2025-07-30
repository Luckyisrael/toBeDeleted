import { axios } from 'app/config/axios';
import { useCallback, useMemo, useState } from 'react';
import useAlert from '../useAlert';
import { Logger } from 'app/utils';
import { setAccessToken, useAccessToken } from 'app/utils/local-storage/accessToken';
import { mutate } from 'swr';


export const useShoppingProcess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { errorAlert, successAlert } = useAlert();

  const addProductToCart = useCallback(
    async function addProductToCart({
      productId,
      quantity,
      accessToken,
      successCallback,
    }: {
        productId: string;
        quantity: number;
        accessToken?: string;
      successCallback: () => void;
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `user/addCart`,
          method: 'POST',
          data: { productId, quantity },
          accessToken,
        });
        console.log('API response from adding to cart:', response); // Debug
        const { userData, tokens, message } = response ;
        // Call success callback if provided
        successCallback?.();

        return {
          success: true,
          message,
          response
        };
      } catch (error) {
        console.log('API error:', error); // Debug
        errorAlert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const accessToken = useAccessToken();

  const authValue = useMemo(
    () => ({
      addProductToCart,
      isLoading,
      accessToken,
    }),
    [addProductToCart, isLoading, accessToken]
  );

  return authValue;
};
