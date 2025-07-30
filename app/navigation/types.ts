import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type NoAuthStackParamList = {
  WELCOME_SCREEN: undefined;
  PERSONALIZE_NOTIFICATION_SCREEN: undefined;
  SELECT_USER_TYPE_SCREEN: undefined;
  SEARCH_SCREEN: undefined;
  CUSTOMERTAB: undefined;
  HOME_INDEX: undefined;
  VENDOR_LOGIN_SCREEN: undefined;
  VENDOR_REGISTRATION_SCREEN: undefined;
  VENDOR_EMAIL_VERIFICATION_SCREEN: undefined;
  VENDOR_EMAIL_VERIFICATION_SUCCESS_SCREEN: undefined;
  VENDOR_FORGOT_PASSWORD_SCREEN: undefined;
  VENDOR_OPEN_EMAIL_SCREEN: undefined;
  VENDOR_VERIFY_FORGOT_PASSWORD_EMAIL: { userId: string };
  VENDOR_CHANGE_PASSWORD_SCREEN: { userId: string };
  CUSTOMER_COMPLETED_ORDERS_SCREEN: undefined;
  USER_FORGOT_PASSWORD_SCREEN: undefined;
  USER_VERIFY_FORGOT_PASSWORD_EMAIL: undefined;
  USER_CHANGE_PASSWORD_SCREEN: undefined;
  USER_ORDER_TRACKING_SCREEN: undefined;
};

export type CustomerTabParamList = {
  CUSTOMER_HOME_SCREEN: undefined;
  CUSTOMER_BASKET_SCREEN: { vendorDetails: string};
  CUSTOMER_HISTORY_SCREEN: undefined;
  CUSTOMER_SETTINGS_SCREEN: undefined;
};

export type CustomerStackParamList = {
  SEARCH_SCREEN: undefined;
  CUSTOMERTABS: NavigatorScreenParams<CustomerTabParamList>;
  CUSTOMER_HOME: { storeId: string };
  FROM_CUSTOMER_HOME_SCREEN: undefined;
  CUSTOMER_HISTORY: undefined;
  CUSTOMER_SETTINGS: undefined;
  CUSTOMER_AUTH_INDEX: undefined;
  CUSTOMER_LOGIN_SCREEN: { onAuthSuccess: () => void };
  CUSTOMER_REGISTER_SCREEN: { onAuthSuccess: () => void };
  BOOK_SLOT_SCREEN: undefined;
  BOOK_SLOT_DETAIL_SCREEN: undefined;
  SLOT_DETAIL_SCREEN: undefined;
  ORDER_DETAIL_SCREEN: { orderId: string };
  VIEW_RECEIPT_SCREEN: { receiptId: string };
  MY_ACCOUNT_SCREEN: undefined;
  CUSTOMER_HOME_SEARCH: { data: any };
  AVAILABLE_PRODUCTS_SCREEN: undefined;
  PRODUCTS_DETAILS_SCREEN: { productId: string };
  INDIVIDUAL_PRODUCTS_DETAILS_SCREEN: { item: string, vendorDetails: any };
  CUSTOMER_ORDER_SUMMARY: { cartItems: any, vendorDetails: any, cartData: any };
  CUSTOMER_AUTH_SCREENS: undefined;
  CUSTOMER_ACCOUNT_SETTINGS_SCREENS: undefined;
  CUSTOMER_EDIT_PROFILE_SCREEN: undefined;
  CUSTOMER_CHANGE_PASSWORD_SCREEN: undefined;
  CUSTOMER_SAVED_ITEMS_SCREEN: undefined;
  CUSTOMER_ADDRESS_SCREEN: undefined;
  CUSTOMER_NOTIFICATION_SCREEN: undefined;
  CUSTOMER_HELP_CENTER_SCREEN: undefined;
  CUSTOMER_CONTACT_US_SCREEN: undefined;
  CUSTOMER_FAQ_SCREEN: undefined;
  CUSTOMER_LEGAL_SCREEN: undefined;
  CUSTOMER_TERMS_CONDITIONS_SCREEN: undefined;
  CUSTOMER_PRIVACY_POLICY_SCREEN: undefined;
  CUSTOMER_FEEDBACK_SCREEN: undefined;
  CUSTOMER_DELETE_ACCOUNT_SCREEN: undefined;
  CUSTOMER_COMPLETED_ORDERS_SCREEN: undefined;
  USER_FORGOT_PASSWORD_SCREEN: undefined;
  USER_VERIFY_FORGOT_PASSWORD_EMAIL: undefined;
  USER_CHANGE_PASSWORD_SCREEN: undefined;
  USER_ORDER_TRACKING_SCREEN: undefined;
  CUSTOMER_PAYMENT_SUCCESS_SCREEN: undefined;
  CUSTOMER_PAYMENT_ERROR_SCREEN: undefined;
};

export type VendorTabParamList = {
  VENDOR_HOME_SCREEN: undefined;
  VENDOR_MESSAGE_SCREEN: undefined;
  VENDOR_PRODUCT_SCREEN: undefined;
  VENDOR_ORDER_SCREEN: undefined;
};

export type VendorStackParamList = {
  VENDORTABS: NavigatorScreenParams<VendorTabParamList>;
  VENDOR_REGISTRATION_SCREEN: undefined;
  VENDOR_EMAIL_VERIFICATION_SCREEN: undefined;
  VENDOR_EMAIL_VERIFICATION_SUCCESS_SCREEN: undefined;
  VENDOR_LOGIN_SCREEN: undefined;
  VENDOR_SECURE_PAYOUT_SCREEN: undefined;
  VENDOR_ORDER_DETAILS_SCREEN: { order: any };
  VENDOR_ORDER_CONFIRMATION_SCREEN: { order: any}
  VENDOR_PRODUCT_DETAILS_SCREEN: {  product: {
    id: string;
    name: string;
    mainImage: string;
    imageVariants: string[];
    price: number;
    discount: number;
    stock: number;
    inStock: boolean;
    description: string;
    category: string;
    weight: string;
  };}
  VENDOR_EDIT_PRODUCT_SCREEN: undefined;
  VENDOR_ADD_NEW_PRODUCT_SCREEN: { product: any };
  VENDOR_PRODUCT_PREVIEW_SCREEN: { product: any };
  VENDOR_ACCOUNT_SETTINGS_SCREEN: undefined;
  VENDOR_EDIT_PROFILE_SCREEN: undefined;
  VENDOR_NOTIFICATION_SCREEN: undefined;
  VENDOR_HELP_CENTER_SCREEN: undefined;
  VENDOR_CONTACT_US_SCREEN: undefined;
  VENDOR_FAQ_SCREEN: undefined;
  VENDOR_FEEDBACK_SCREEN: undefined;
  VENDOR_LEGAL_SCREEN: undefined;
  VENDOR_TERMS_CONDITIONS_SCREEN: undefined;
  VENDOR_PRIVACY_POLICY_SCREEN: undefined;
  VENDOR_DELETE_ACCOUNT_SCREEN: undefined;
  VENDOR_FORGOT_PASSWORD_SCREEN: undefined;
  VENDOR_RESET_PASSWORD_SCREEN: undefined;
  VENDOR_OPEN_EMAIL_SCREEN: undefined;
  VENDOR_VERIFY_FORGOT_PASSWORD_EMAIL: { userId: string };
  VENDOR_CHANGE_PASSWORD_SCREEN: { userId: string };
  VENDOR_UPDATE_PASSWORD_SCREEN: undefined;
  SELECT_BUSINESS_TYPE_SCREEN: undefined;
  BUSINESS_WITH_LICENSE: undefined;
};

export type RootStackParamList = {
  WELCOME_SCREENS: NavigatorScreenParams<NoAuthStackParamList>;
  CUSTOMERTABS: NavigatorScreenParams<CustomerTabParamList>;
  CUSTOMERTAB: undefined;
  VENDORTABS: NavigatorScreenParams<VendorTabParamList>;
  AVAILABLE_PRODUCTS_SCREEN: undefined;
  PRODUCTS_DETAILS_SCREEN: { productId: string };
  INDIVIDUAL_PRODUCTS_DETAILS_SCREEN: { item: string, vendorDetails: any };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}