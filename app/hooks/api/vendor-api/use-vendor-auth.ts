import { axios } from 'app/config/axios';
import { useCallback, useMemo, useState } from 'react';
import { setVendorAccessToken, useVendorAccessToken } from 'app/utils/local-storage/accessToken';
import { mutate } from 'swr';
import useAlert from 'app/hooks/useAlert';
import useVendorStore from 'app/store/use-vendor-store';
import { authenticateVendor } from 'app/services/authService';


export const useVendorAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { errorAlert, successAlert } = useAlert();
  const { setUserType,  setVendor, setVendorAccessToken: setVendorTokenToStore, setVendorRefreshToken } = useVendorStore();

  const registerVendor = useCallback(
    async function registerVendor({
      companyName,
      email,
      address,
      password,
      coverPhoto,
      description,
      phoneNumber,
      postCode,
      openingTime,
      closingTime,
      successCallback,
    }: {
      companyName: string;
      email: string;
      address: string;
      password: string;
      coverPhoto: string;
      description: string;
      phoneNumber: string;
      postCode: string;
      openingTime: string;
      closingTime: string;
      successCallback: (response: any) => void; 
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `auth/registerVendor`,
          method: 'POST',
          overrides: { skipAuthorization: true },
          data: {
            companyName,
            email,
            address,
            password,
            coverPhoto,
            description,
            phoneNumber,
            postCode,
            openingTime,
            closingTime,
          },
          
        });
        
        const { userData, tokens, message } = response;

        // Use the centralized auth service
        authenticateVendor(userData, tokens);
        
        successCallback?.(response);
        
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

  const verifyEmail = useCallback(
    async function verifyEmail({
      userId,
      otp,
      successCallback,
    }: {
      userId: string;
      otp: string;
      successCallback: () => void;
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `otp/verifyOtp`,
          method: 'POST',
          data: { userId, otp },
          overrides: { skipAuthorization: true },
        });
        //setAccessToken(response?.token);
        //successAlert(response?.data?.message);
        successCallback?.();
       
      } catch (error) {
        console.log('API error response:', error); // Debug
        errorAlert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const vendorLogin = useCallback(
    async function vendorLogin({
      email,
      password,
      successCallback,
    }: {
        email: string;
      password: string;
      successCallback: () => void;
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `auth/login`,
          method: 'POST',
          data: { email, password },
          overrides: { skipAuthorization: true },
        });

        const { userData, tokens, message } = response;
        console.log(' vendfor data: ', userData)
        // Use the centralized auth service
        authenticateVendor(userData, tokens);
        
        successCallback?.();
        
        return {
          success: true,
          message,
          accessToken: tokens.accessToken,
        };
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const vendorForgotPassword = useCallback(
    async function vendorForgotPassword({
      email,
      successCallback,
    }: {
        email: string;
        successCallback: (response: any) => void; 
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `auth/resetPassword`,
          method: 'POST',
          data: { email },
          overrides: { skipAuthorization: true },
        });
        console.log('the response', response)
        successAlert(response?.message)
        successCallback?.(response);
        
        return {
          success: true,
          response
        };
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const vendorChangePassword = useCallback(
    async function vendorChangePassword({
      newpass,
      ref,
      userId,
      successCallback,
    }: {
        newpass: string;
        ref: string;
        userId: string;
        successCallback: (response: any) => void; 
    }): Promise<any> {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await axios({
          url: `auth/changePassword`,
          method: 'POST',
          data: { newpass, ref, userId },
          overrides: { skipAuthorization: true },
        });
        console.log('the response', response)
        successAlert(response?.message)
        successCallback?.(response);
        
        return {
          success: true,
          response
        };
      } catch (error) {
        errorAlert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );


  const logoutUser = useCallback(
    async function logoutUser() {
      setVendorTokenToStore(null);
      setVendor(null);
      mutate(null);
    },
    [mutate]
  );

  const accessToken = useVendorAccessToken();

  const authValue = useMemo(
    () => ({
      registerVendor,
      verifyEmail,
      vendorLogin,
      vendorForgotPassword,
      vendorChangePassword,

      isLoading,
      accessToken,
      logoutUser,
    }),
    [registerVendor, verifyEmail, vendorLogin, vendorForgotPassword, vendorChangePassword, isLoading, accessToken]
  );

  return authValue;
};
