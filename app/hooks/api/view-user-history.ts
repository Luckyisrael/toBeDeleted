import useSWR from 'swr';
import { axios } from 'app/config/axios';
import useUserStore from 'app/store/use-user-store';

const VIEW_USER_HISTORY = 'user/getOrders';
const USER_PROFILE = 'user/getProfile';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Vendor {
  companyName?: string;
  name?: string;
  rating: number;
}

interface DeliveryInfo {
  address: string;
  contact: string;
  notes: string;
}

interface Order {
  id: string;
  orderId: string;
  OrderStatus: 'Pending' | 'Completed';
  vendor: Vendor;
  items: OrderItem[];
  date: string;
  deliveryInfo: DeliveryInfo[];
  deliveryStatus: string;
  deliveryDate: string;
  collectionInstruction: string;
  user: {
    name: string;
    email: string;
  };
  tips: number;
  total: number;
}

interface UserHistoryResponse {
  Orders: Order[];
}

interface UserProfileResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  emailVerified: boolean;
  userImage: string;
  savedItems: any[];
  subscription: any[];
  [key: string]: any; 
}

const fetchCart = async (url: string) => {
  return axios({
    url,
    method: 'GET',
  }).then((res) => res);
};

export const useViewUserHistory = () => {
  const { accessToken } = useUserStore();

  const { data, error, isLoading, mutate } = useSWR<UserHistoryResponse, Error>(
    accessToken ? [VIEW_USER_HISTORY, accessToken] : null,
    () => fetchCart(VIEW_USER_HISTORY),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    isLoading,
    error,
    refresh: mutate,
  };
};

export const useGetUserProfile = () => {
  const { accessToken } = useUserStore();

  const { data, error, isLoading, mutate } = useSWR<UserProfileResponse, Error>(
    accessToken ? [USER_PROFILE, accessToken] : null,
    () => fetchCart(USER_PROFILE),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    isLoading,
    error,
    refresh: mutate,
  };
};