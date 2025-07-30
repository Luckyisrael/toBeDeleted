import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { axios } from 'app/config/axios';
import useVendorStore from 'app/store/use-vendor-store';
import { Logger } from 'app/utils';
import useAlert from 'app/hooks/useAlert';

interface ProcessOrderParams {
  orderId: string;
  availableItems: string[];
  successCallback?: () => void;
}

interface ProcessOrderResponse {
  success: boolean;
  message: string;
}

interface AddProductParams {
  title: string;
  image: string[];
  category: string;
  subCategory: string;
  quantity: number;
  tags: string[];
  price: number;
  discount: number;
  weight: number;
  specialCare: string;
  description: string;
  productId?: string;
  successCallback?: () => void;
}

interface AddProductResponse {
  success: boolean;
  message: string;
  product?: any;
}

interface DeleteProductParams {
  productId: string;
  successCallback?: () => void;
}

interface BankDetailParams {
  vendorType: string;
  companyName: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  accountName: string;
  sortCode: string;
  bankName: string;
  taxId: string;
  dateOfBirth: any;
  userId: string;
  successCallback: () => void;
}

const fetchWithToken = (url: string, accessToken: string) => {
  Logger.log(`[fetchWithToken] URL: ${url}, Token: ${accessToken}`);
  return axios({
    url,
    method: 'GET',
    accessToken,
  });
};

export const useVendorApi = () => {
  const { vendorAccessToken } = useVendorStore();
  const { errorAlert, successAlert } = useAlert();
  const [isProcessingLoading, setIsProcessingLoading] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  {
    /**View vendor dashboard data */
  }
  const VIEW_USER_HISTORY = 'vendor/dashboard';
  const {
    data: dashboardDataRaw,
    error: dashboardError,
    isLoading: isDashboardLoading,
    mutate: refreshDashboard,
  } = useSWR(
    vendorAccessToken ? [VIEW_USER_HISTORY, vendorAccessToken] : null,
    ([url, token]) => fetchWithToken(url, token),
    { revalidateOnFocus: false }
  );
  const dashboardData = dashboardDataRaw || {};

  {
    /**View vendor orders */
  }
  const VIEW_ORDERS = 'vendor/getOrders';
  const {
    data: ordersDataRaw,
    error: ordersError,
    isLoading: isOrdersLoading,
    mutate: refreshOrders,
  } = useSWR(
    vendorAccessToken ? [VIEW_ORDERS, vendorAccessToken] : null,
    ([url, token]) => fetchWithToken(url, token),
    { revalidateOnFocus: false }
  );
  const ordersData = ordersDataRaw || { Orders: [] };

  {
    /**View vendor products */
  }
  const VIEW_PRODUCTS = 'vendor/viewProducts';
  const {
    data: productDataRaw,
    error: productError,
    isLoading: isProductLoading,
    mutate: refreshProduct,
  } = useSWR(
    vendorAccessToken ? [VIEW_PRODUCTS, vendorAccessToken] : null,
    ([url, token]) => fetchWithToken(url, token),
    { revalidateOnFocus: false }
  );
  const productData = productDataRaw || [];

  {
    /**View vendor categories */
  }
  const GET_VENDOR_CATEGORIES = 'vendor/getCategories';
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
    mutate: refresCategories,
  } = useSWR(
    vendorAccessToken ? [GET_VENDOR_CATEGORIES, vendorAccessToken] : null,
    ([url, token]) => fetchWithToken(url, token),
    { revalidateOnFocus: false }
  );

  {
    /**View vendor best-selling */
  }
  const GET_BEST_SELLING = 'vendor/best-selling';
  const {
    data: bestSellingData,
    error: bestSellingError,
    isLoading: loadingBestSelling,
    mutate: refreshBestSelling,
  } = useSWR(
    vendorAccessToken ? [GET_BEST_SELLING, vendorAccessToken] : null,
    ([url, token]) => fetchWithToken(url, token),
    { revalidateOnFocus: false }
  );

  const GET_VENDOR_PROFILE = 'vendor/getProfile';
 /** const {
    data: vendorProfileData,
    error: vendorProfileError,
    isLoading: vendorProfileLoading,
    mutate: refreshVendorProfile,
  } = useSWR(
    vendorAccessToken ? [GET_VENDOR_PROFILE, vendorAccessToken] : null,
    ([url, token]) => fetchWithToken(url, token),
    { revalidateOnFocus: false }
  ); */

  {
    /**Process order by vendor */
  }
  const processOrder = useCallback(
    async ({
      orderId,
      availableItems,
      successCallback,
    }: ProcessOrderParams): Promise<ProcessOrderResponse> => {
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `vendor/markOrderItems/${orderId}`,
          method: 'PUT',
          data: { availableItems },
          accessToken: vendorAccessToken,
        });

        Logger.log('Order processing response:', response);
        successAlert('Order processed successfully');
        successCallback?.();

        return {
          success: true,
          message: 'Order processed',
        };
      } catch (error: any) {
        Logger.error('Order processing failed:', error);
        errorAlert(error.message || 'Failed to process order');
        throw error;
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [vendorAccessToken, isProcessingLoading, errorAlert, successAlert]
  );

  {
    /**Add products */
  }
  const addProduct = useCallback(
    async ({
      title,
      image,
      category,
      subCategory,
      quantity,
      tags,
      price,
      discount,
      weight,
      specialCare,
      description,
      successCallback,
    }: AddProductParams): Promise<AddProductResponse> => {
      if (isAddingProduct) {
        return { success: false, message: 'Already adding a product' };
      }
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }
      setIsAddingProduct(true);

      try {
        const response = await axios({
          url: 'vendor/addProduct',
          method: 'POST',
          data: {
            title,
            image,
            category,
            subCategory,
            quantity,
            tags,
            price: price.toString(),
            discount: discount.toString(),
            weight,
            specialCare,
            description,
          },
          accessToken: vendorAccessToken,
        });

        Logger.log('Add product response:', response);
        successAlert('Product added successfully');
        successCallback?.();

        refreshProduct();

        return {
          success: true,
          message: 'Product added successfully',
          product: response.product || {},
        };
      } catch (error: any) {
        Logger.error('Adding product failed:', error);
        errorAlert(error.message || 'Failed to add product');
        throw error;
      } finally {
        setIsAddingProduct(false);
      }
    },
    [vendorAccessToken, isAddingProduct, errorAlert, successAlert, refreshProduct]
  );

  {
    /**Update products */
  }
  const updateProduct = useCallback(
    async ({
      title,
      image,
      category,
      subCategory,
      quantity,
      tags,
      price,
      discount,
      weight,
      specialCare,
      description,
      successCallback,
      productId,
    }: AddProductParams): Promise<AddProductResponse> => {
      if (isAddingProduct) {
        return { success: false, message: 'Already adding a product' };
      }
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }
      setIsAddingProduct(true);

      try {
        const response = await axios({
          url: `vendor/editProduct/${productId}`,
          method: 'PUT',
          data: {
            title,
            image,
            category,
            subCategory,
            quantity,
            tags,
            price: price.toString(),
            discount: discount.toString(),
            weight,
            specialCare,
            description,
          },
          accessToken: vendorAccessToken,
        });

        Logger.log('Add product response:', response);
        successAlert('Product added successfully');
        successCallback?.();

        refreshProduct();

        return {
          success: true,
          message: 'Product added successfully',
          product: response.product || {},
        };
      } catch (error: any) {
        Logger.error('Adding product failed:', error);
        errorAlert(error.message || 'Failed to add product');
        throw error;
      } finally {
        setIsAddingProduct(false);
      }
    },
    [vendorAccessToken, isAddingProduct, errorAlert, successAlert, refreshProduct]
  );

  const deleteProduct = useCallback(
    async ({ productId, successCallback }: DeleteProductParams) => {
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }

      try {
        await axios({
          url: `vendor/deleteProduct/${productId}`,
          method: 'DELETE',
          accessToken: vendorAccessToken,
        });

        successAlert('Product deleted successfully');
        successCallback?.();
        refreshProduct();

        return {
          success: true,
          message: 'Product deleted successfully',
        };
      } catch (error: any) {
        Logger.error('Deleting product failed:', error);
        errorAlert(error.message || 'Failed to delete product');
        throw error;
      }
    },
    [vendorAccessToken, errorAlert, successAlert, refreshProduct]
  );

  const vendorUpdatePassword = useCallback(
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
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `user/changePassword/${userId}`,
          method: 'PUT',
          data: { currentPassword, newPassword, userId },
          accessToken: vendorAccessToken,
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
    [vendorAccessToken, isProcessingLoading, errorAlert, successAlert, refreshProduct]
  );

  const vendorEditProfile = useCallback(
    async ({
      companyName,
      email,
      address,
      password,
      coverPhoto,
      description,
      phoneNumber,
      userId,
      successCallback,
    }: {
      companyName?: string;
      email?: string;
      address?: string;
      password?: string;
      coverPhoto?: string;
      description?: string;
      phoneNumber?: string;
      userId: string;
      successCallback: () => void;
    }): Promise<any> => {
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `vendor/editProfile/${userId}`,
          method: 'PUT',
          data: { companyName, email, address, password, coverPhoto, description, phoneNumber },
          accessToken: vendorAccessToken,
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
    [vendorAccessToken, isProcessingLoading, errorAlert, successAlert, refreshProduct]
  );

  const vendorContactSupport = useCallback(
    async ({
      message,
      successCallback,
    }: {
      message: string;
      successCallback: () => void;
    }): Promise<any> => {
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }
      setIsProcessingLoading(true);

      try {
        const response = await axios({
          url: `user/support`,
          method: 'POST',
          data: { message },
          accessToken: vendorAccessToken,
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
    [vendorAccessToken, isProcessingLoading, errorAlert, successAlert]
  );

  const updateBankDetails = useCallback(
    async ({
      userId,
      firstName,
      lastName,
      bankName,
      dateOfBirth,
      accountName,
      accountNumber,
      sortCode,
      taxId,
      vendorType,
      companyName,
      successCallback,
    }: BankDetailParams) => {
      if (!vendorAccessToken) {
        errorAlert('Login to get access');
        return { success: false, message: 'No access token' };
      }
      setIsProcessingLoading(true);
      try {
        await axios({
          url: `vendor/updateBankDetails/${userId}`,
          method: 'PUT',
          accessToken: vendorAccessToken,
          data: {
            firstName,
            lastName,
            bankName,
            dateOfBirth,
            accountName,
            accountNumber,
            sortCode,
            taxId,
            vendorType,
            companyName,
          },
        });

        successAlert('Bank details updated');
        successCallback?.();
        refreshProduct();

        return {
          success: true,
        };
      } catch (error: any) {
        Logger.error('updating bank failed:', error);
        errorAlert(error.message || 'updating bank failed');
        throw error;
      } finally {
        setIsProcessingLoading(false);
      }
    },
    [vendorAccessToken, errorAlert, successAlert]
  );

  return {
    getDashboard: {
      data: dashboardData,
      isLoading: isDashboardLoading,
      error: dashboardError,
      refresh: refreshDashboard,
    },
    getOrders: {
      data: ordersData,
      isLoading: isOrdersLoading,
      error: ordersError,
      refresh: refreshOrders,
    },
    getProducts: {
      data: productData,
      isLoading: isProductLoading,
      error: productError,
      refresh: refreshProduct,
    },
    getCategories: {
      data: categoriesData,
      isLoading: categoriesLoading,
      error: categoriesError,
      refresh: refresCategories,
    },
    getBestSelling: {
      data: bestSellingData,
      error: bestSellingError,
      isLoading: loadingBestSelling,
      mutate: refreshBestSelling,
    },
   /** getVendorProfile: {
      data: vendorProfileData,
      error: vendorProfileError,
      isLoading: vendorProfileLoading,
      mutate: refreshVendorProfile,
    }, */
    processOrder,
    isProcessingLoading,
    addProduct,
    isAddingProduct,
    deleteProduct,
    updateProduct,
    vendorUpdatePassword,
    vendorEditProfile,
    vendorContactSupport,
    updateBankDetails,
  };
};