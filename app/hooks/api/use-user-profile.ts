import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { axios } from 'app/config/axios';
import useVendorStore from 'app/store/use-vendor-store';
import { Logger } from 'app/utils';
import useAlert from 'app/hooks/useAlert';


const fetcher = (url: string) => {
  return axios({
    url,
    method: 'GET',
  });
};


const USER_FAVORITES = "user/getFav";

export const useUserProfileApi = () => {

  const { errorAlert, successAlert } = useAlert();
  const [isProcessingLoading, setIsProcessingLoading] = useState(false);
 
  const {
    data: favoritesData,
    error: favoritesError,
    isLoading: isFavoritesLoading,
    mutate: refreshFavorites,
  } = useSWR('user/getFav', fetcher);

  const {
    data: addressData,
    error: addressError,
    isLoading: isAddressLoading,
    mutate: refreshAddress,
  } = useSWR('user/getDelivery', fetcher);

    const getOrderDetail = (orderId: string) => {
      const {
        data: orderData,
        error: orderError,
        isLoading: isOrderLoading,
        mutate: refreshOrder,
      } = useSWR(`user/getOrder/${orderId}`, fetcher);

      return {
        data: orderData,
        isLoading: isOrderLoading,
        error: orderError,
        refresh: refreshOrder,
      };
    };


  const userUpdatePassword = useCallback(
    async ({
      currentPassword,
      newPassword,
      userId,
      successCallback,
    }: {
      currentPassword: string;
      newPassword: string;
      userId: string;
      successCallback: () => void;
    }): Promise<any> => {
      
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `user/changePassword/${userId}`,
          method: 'PUT',
          data: { currentPassword, newPassword },
         
        });

        console.log('the response', response);
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const userEditProfile = useCallback(
    async ({
     
      email,
      address,
      userImage,
      fullName,
      deviceToken,
      successCallback,
    }: {
      email?: string;
      address?: string;
      userImage?: string;
      fullName?: string;
      deviceToken?: string;
      successCallback: () => void;
    }): Promise<any> => {
      
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `user/update`,
          method: 'PUT',
          data: { email, address, userImage, fullName, deviceToken },

        });

        console.log('the response', response);
        successAlert(response?.message);
        successCallback?.();
        return response;
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const deleteAddress = useCallback(
    async ({
     deleteId,
      successCallback,
    }: {
      deleteId: string;
      successCallback: () => void;
    }): Promise<any> => {
      
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `user/deleteDelivery/${deleteId}`,
          method: 'DELETE',
          data: { deleteId },
        });
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const deleteAccount = useCallback(
    async ({
     message,
      successCallback,
    }: {
      message: string;
      successCallback: () => void;
    }): Promise<any> => {
      
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `user/deleteAccount`,
          method: 'DELETE',
          data: { message },
        });
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const userAddFavorite = useCallback(
    async ({
     itemId,
      successCallback,
    }: {
      itemId: string;
      successCallback: () => void;
    }): Promise<any> => {
      setIsProcessingLoading(true);
      try {
        const response = await axios({
          url: `user/addFav`,
          method: 'POST',
          data: { itemId },

        });
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const userRemoveFavorite = useCallback(
    async ({
     itemId,
      successCallback,
    }: {
      itemId: string;
      successCallback: () => void;
    }): Promise<any> => {
      setIsProcessingLoading(true);
      try {
        const response = await axios({
          url: `user/removeFav`,
          method: 'DELETE',
          data: { itemId },

        });
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const vendorContactSupport = useCallback(
    async ({
      message,
      successCallback,
    }: {
      message: string;
      successCallback: () => void;
    }): Promise<any> => {
      
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `user/support`,
          method: 'PUT',
          data: { message },
        });
        console.log('the response', response);
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert]
  );

  const userRateApp= useCallback(
    async ({
     rating,
      successCallback,
    }: {
      rating: number;
      successCallback: () => void;
    }): Promise<any> => {
      setIsProcessingLoading(true);
      try {
        const response = await axios({
          url: `user/rateApp`,
          method: 'POST',
          data: { rating },

        });
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const userDeliveryStatus = useCallback(
    async ({
      orderId,
      successCallback,
    }: {
      orderId: string;
      successCallback: () => void;
    }): Promise<any> => {
      setIsProcessingLoading(true);
      try {
        const response = await axios({
          url: `user/getDeliveryStatus`,
          method: 'POST',
          data: { orderId },

        });
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  const userSocials = useCallback(
    async ({
      orderId,
      successCallback,
    }: {
      orderId: string;
      successCallback: () => void;
    }): Promise<any> => {
      setIsProcessingLoading(true);
      try {
        const response = await axios({
          url: `/user/addSocials`,
          method: 'POST',
          data: { orderId },

        });
        successAlert(response?.message);
        successCallback?.();
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [ isProcessingLoading, errorAlert, successAlert ]
  );

  return {
   
    isProcessingLoading,
    userUpdatePassword,
    userEditProfile,
    vendorContactSupport,
    userAddFavorite,
    userRemoveFavorite,
    deleteAddress,
    deleteAccount,
    userRateApp,
    orderDetail: getOrderDetail,
    userDeliveryStatus,
    favorites: {
      data: favoritesData,
      isLoading: isFavoritesLoading,
      error: favoritesError,
      refresh: refreshFavorites,
    },
    address: {
      data: addressData,
      isLoading: isAddressLoading,
      error: addressError,
      refresh: refreshAddress,
    },
  };
};
