import { useAccessToken } from "app/utils/local-storage/accessToken";
import { useCallback, useMemo, useState } from "react";
import useAlert from "../useAlert";
import useUserStore from "app/store/use-user-store";
import { axios } from "app/config/axios";

export const useOrderPricing = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { errorAlert, successAlert } = useAlert();

    const orderPrice = useCallback(
      async function orderPrice({
        cartId,
        deliveryAddress,
        successCallback,
      }: {
        cartId: string;
        deliveryAddress: string | null;
        successCallback: () => void;
      }): Promise<any> {
        if (isLoading) return;
        setIsLoading(true);
        try {
          const response = await axios({
            url: `user/orderPricing`,
            method: 'POST',
            data: { cartId, deliveryAddress },
          });
          console.log('API response: from order pricing', response); // Debug
  
          successCallback?.();
  
          return response;
        } catch (error) {
          console.log('API response: from order pricing', error); // Debug
          errorAlert(error);
        } finally {
          setIsLoading(false);
        }
      },
      [isLoading]
    );
  
    return useMemo(
        () => ({
            orderPrice,
          isLoading,
        }),
        [orderPrice, isLoading]
      );
  };
  