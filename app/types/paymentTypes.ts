export interface CartItem {
  product: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface OrderResponse {
  orderId: string;
  user: string;
  items: CartItem[];
  total: number;
  status: string;
  vendor: string;
  reOrderFrom: string | null;
  tips: number;
  deliveryInfo: {
    deliveryAddress: string;
    deliveryMethod: string;
    deliveryFee: number;
    deliveryStatus: string;
    _id: string;
  }[];
  _id: string;
  createdAt: string;
  __v: number;
  clientSecret: string;
}

export interface PaymentResult {
  status: 'loading' | 'success' | 'error';
  message: string;
}

export interface PaymentParams {
  cartId: string;
  devliveryMethod: string;
  deliveryFee: number;
  tips: number;
  collectionInstruction: string;
  successCallback: () => void;
}

export type PaymentMethod = 'Credit/Debit Card' | 'Apple Pay' | 'Google Pay' | 'Cash' | 'Amazon Pay' | 'PayPal' | 'GeePay';