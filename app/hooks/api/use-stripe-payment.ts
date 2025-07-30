import { useStripe } from '@stripe/stripe-react-native';
import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Logger } from 'app/utils';
import { axios } from 'app/config/axios';
import * as Linking from "expo-linking";

export interface OrderDetails {
  cartId: string;
  devliveryMethod: string;
  deliveryPeriod: string
  deliveryFee: number;
  deliveryAddress: string;
  tips?: number;
  collectionInstruction?: string;
  deliveryDate: string;
}

export const useStripePaymentService = () => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();

  const initializePaymentSheet = useCallback(async (
    clientSecret: string,
    customerId?: string,
    ephemeralKey?: string
  ) => {
    try {
      const { error } = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        customerId: customerId,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'Sweeftly Inc',
        applePay: Platform.OS === 'ios' ? {
          merchantCountryCode: 'UK', 
        } : undefined,
        allowsDelayedPaymentMethods: true,
        googlePay: Platform.OS === 'android' ? {
          merchantCountryCode: 'UK', 
          currencyCode: 'GBP'
        } : undefined,
        style: 'automatic',
        returnURL: Linking.createURL("stripe-redirect"),
      });

      if (error) {
        Logger.error('Error initializing payment sheet', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e) {
      Logger.error('Exception initializing payment sheet', e);
      return { success: false, error: 'Failed to initialize payment' };
    }
  }, [stripe]);


  const presentPaymentSheet = useCallback(async () => {
    try {
      const { error } = await stripe.presentPaymentSheet();
      
      if (error) {
        Logger.error('Error presenting payment sheet', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (e) {
      Logger.error('Exception presenting payment sheet', e);
      return { success: false, error: 'Payment failed' };
    }
  }, [stripe]);


  const processPayment = useCallback(async (
    orderDetails: OrderDetails, 
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    if (loading) return;
    setLoading(true);
    
    try {
    
      const response = await axios({
        url: `user/placeOrder`,
        method: 'POST',
        data: orderDetails,
      });

      Logger.log('Order placed, response:', response);
      console.log("Order placed, response: ", response?.payment);
      if (!response?.payment) {
        throw new Error('Invalid response from server');
      }
      
      console.log("from just response: ", response?.payment);

      const { 
        payment: clientSecret,
        customerId, 
        ephemeralKey 
      } = response;

      const initResult = await initializePaymentSheet(
        clientSecret,
        customerId,
        ephemeralKey
      );
      
      if (!initResult.success) {
        throw new Error(initResult.error || 'Failed to initialize payment');
      }

      const paymentResult = await presentPaymentSheet();
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      Logger.log('Payment successful');
      onSuccess?.();
      return { success: true, response };
      
    } catch (error: any) {
      console.log('Payment process error:', error);
      
      if (error.message?.toLowerCase().includes('cancelled')) {
        return { success: false, cancelled: true };
      }
      
      const errorMessage = error.message || 'Payment failed';
      onError?.(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [loading, initializePaymentSheet, presentPaymentSheet]);

  const postOrder = useCallback(async (
    orderId: string, 
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios({
        url: `user/postOrder`,
        method: 'POST',
        data: { order: orderId },
      });
  
      Logger.log('Order posted, response:', response);
      if (!response) {
        throw new Error('Invalid response from server');
      }
      onSuccess?.();
      return { success: true, response };
    } catch (error: any) {
      console.log('Post order error:', error);
      const errorMessage = error.message || 'Failed to post order';
      onError?.(errorMessage); // Call onError callback
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return {
    postOrder,
    processPayment,
    loading,
    initializePaymentSheet,
    presentPaymentSheet,
  };
};