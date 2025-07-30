import { axios } from 'app/config/axios';
import { useCallback, useMemo, useState } from 'react';
import useAlert from '../useAlert';
import { Logger } from 'app/utils';
import { setAccessToken, useAccessToken } from 'app/utils/local-storage/accessToken';
import { mutate } from 'swr';
import useUserStore from 'app/store/use-user-store';
import { authenticateUser } from 'app/services/authService';

const MY_PROFILE_ENDPOINT = 'users/user-info';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { errorAlert, successAlert } = useAlert();
  const { setUserType, setUser, setAccessToken: setTokenToStore, setRefreshToken } = useUserStore();

  const registerCustomer = useCallback(
    async ({
      phoneNumber,
      email,
      address,
      postCode,
      fullName,
      password,
      successCallback,
    }: {
      phoneNumber: string;
      email: string;
      address: string;
      postCode: string;
      fullName: string;
      password: string;
      successCallback?: (accessToken: string) => void;
    }) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        console.log(
          'registration deets received: ',
          fullName, '||',
          email, '||',
          address, '||',
          postCode, '||',
          phoneNumber, '||',
          password
        );
        const response = await axios({
          url: 'auth/registerUser',
          method: 'POST',
          data: { fullName, email, address, postCode, phoneNumber, password },
          overrides: { skipAuthorization: true }, // No token needed for registration
        });
        console.log('API response:', response);

        const { userData, tokens, message } = response;
        console.log('User data registration:', userData);

        const accessToken = authenticateUser(userData, tokens);
        
        successCallback?.(accessToken);

        return {
          success: true,
          message,
          accessToken,
        };
      } catch (error: any) {
        console.log('API error:', error);
        errorAlert(error.message);
        throw error; 
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setAccessToken, setRefreshToken, setUser, setUserType, errorAlert]
  );

  const verifyPhone = useCallback(
    async function verifyPhone({
      code,
      phone,
      successCallback,
    }: {
      code: string;
      phone: string;
      successCallback: () => void;
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `auth/auth/confirm-phone-verification`,
          method: 'POST',
          data: { code, phone },
        });
        setAccessToken(response?.token);
        successAlert(response?.data?.message);
        successCallback?.();
        console.log(response, 'here is the success response from verifying a phone number');
      } catch (error) {
        console.log('API error response:', error); // Debug
        errorAlert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const loginCustomer = useCallback(
    async ({
      email,
      password,
      successCallback,
    }: {
      email: string;
      password: string;
      successCallback?: (accessToken: string) => void;
    }) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: 'auth/login',
          method: 'POST',
          data: { email, password },
          overrides: { skipAuthorization: true }, 
        });
        console.log('API response:', response);

        const { userData, tokens, message } = response;

        const accessToken = authenticateUser(userData, tokens);
        
        successCallback?.(accessToken);

        return {
          success: true,
          message,
          accessToken,
        };
        
      } catch (error: any) {
        console.log('API error:', error);
        errorAlert(error.message);
        throw error; 
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setAccessToken, setRefreshToken, setUser, setUserType, errorAlert]
  );

  const logoutUser = useCallback(
    async function logoutUser() {
      setTokenToStore(null);
      setUser(null);
      mutate(null);
      console.log('---cleared----')
    },
    [mutate]
  );

  const accessToken = useAccessToken();

  const authValue = useMemo(
    () => ({
      registerCustomer,
      verifyPhone,
      loginCustomer,

      isLoading,
      accessToken,
      logoutUser,
    }),
    [registerCustomer, loginCustomer, isLoading, accessToken]
  );

  return authValue;
};
