import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import {
  AccountSettingScreen,
  AppSearchScreen,
  AvailableProductItemScreen,
  BookSlotDetailScreen,
  BookSlotScreen,
  CustomerBasketScreen,
  CustomerHistoryScreen,
  CustomerHomeScreen,
  CustomerLoginScreen,
  CustomerRegistrationScreen,
  CustomerSettingScreen,
  EditProfileScreen,
  IndividaulProductDetailScreen,
  MyAccountScreen,
  OrderConfirmationScreen,
  OrderDetailScreen,
  OrderSummaryScreen,
  PersonalizeNotification,
  ProductDetailScreen,
  SearchResultScreen,
  SearchScreen,
  SecurePayoutScreen,
  SelectUserTypeScreen,
  SlotDetailScreen,
  StoreItemsListScreen,
  VendorAddNewProduct,
  VendorEditProduct,
  VendorHomeScreen,
  VendorLoginScreen,
  VendorProfileScreen,
  VendorOrderDetailsScreen,
  VendorOrderScreen,
  VendorProductDetailScreen,
  VendorProductPreview,
  VendorProductScreen,
  VendorRegistrationScreen,
  VerificationSuccessScreen,
  VerifyVendorEmail,
  ViewReceiptScreen,
  WelcomeScreen,
  VendorAccountSettings,
  VendorEditProfileScreen,
  VendorNotificationsScreen,
  VendorHelpCenterScreen,
  VendorContactUsScreen,
  VendorFAQScreen,
  VendorFeedbackScreen,
  VendorLegalScreen,
  TermsAndConditionsScreen,
  VendorPrivacyPolicyScreen,
  VendorDeleteAccountScreen,
  VendorResetPassword,
  VendorForgotPassword,
  OpenEmail,
  VerifyVendorForgotPasswordEmail,
  VendorCreateNewPassword,
  VendorChangePassword,
  SelectBusinessTypeScreen,
  BusinessWithLicense,
  SavedItemsScreen,
  CustomerAddress,
  CustomerNotificationsScreen,
  CustomerHelpCenterScreen,
  CustomerContactUsScreen,
  CustomerFAQScreen,
  CustomerLegalScreen,
  CustomerTermsAndConditionsScreen,
  CustomerPrivacyPolicyScreen,
  CustomerFeedbackScreen,
  CustomerDeleteAccountScreen,
  CompletedOrderDetails,
  UserCreateNewPassword,
  UserForgotPassword,
  OngoingOrderTrackingScreen,
  PaymentSuccessScreen,
} from 'app/screens';
import {
  CustomerStackParamList,
  CustomerTabParamList,
  RootStackParamList,
  NoAuthStackParamList,
  VendorTabParamList,
  VendorStackParamList,
} from './types';
import { fs, hp, wp } from 'app/resources/config';
import {
  CartIcon,
  CartTabIcon,
  CustomerHistoryIcon,
  CustomerHomeIcon,
  CustomerSettingsIcon,
} from 'app/assets/svg';
import { Profile } from 'iconsax-react-native';
import { Feather, Octicons } from '@expo/vector-icons';
import useUserStore from 'app/store/use-user-store';
import { useNavigationAuth } from 'app/hooks/useNavigationAuth';
import UserChangePassword from 'app/screens/CustomerFlow/account-setting/change-password';
import VerifyUserForgotPasswordEmail from 'app/screens/CustomerFlow/verify-forgot-password-email';
import useVendorStore from 'app/store/use-vendor-store';
import PaymentErrorScreen from 'app/screens/CustomerFlow/payment-message-screen.tsx/error';

// Create navigators
const Stack = createStackNavigator<NoAuthStackParamList>();

const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();
const CustomerStack = createStackNavigator<CustomerStackParamList>();

const VendorTab = createBottomTabNavigator<VendorTabParamList>();
const VendorStack = createStackNavigator<VendorStackParamList>();

const MainAppStack = createStackNavigator<RootStackParamList>();

// Welcome/Onboarding Stack (Pre-login flow)
const WelcomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="WELCOME_SCREEN"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="WELCOME_SCREEN" component={WelcomeScreen} />
      <Stack.Screen
        name="PERSONALIZE_NOTIFICATION_SCREEN"
        component={PersonalizeNotification}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="SELECT_USER_TYPE_SCREEN" component={SelectUserTypeScreen} />
      <Stack.Screen name="SEARCH_SCREEN" component={SearchScreen} />
      <Stack.Screen name="VENDOR_LOGIN_SCREEN" component={VendorLoginScreen} />
      <Stack.Screen name="VENDOR_REGISTRATION_SCREEN" component={VendorRegistrationScreen} />
      <Stack.Screen name="VENDOR_EMAIL_VERIFICATION_SCREEN" component={VerifyVendorEmail} />
      <Stack.Screen
        name="VENDOR_EMAIL_VERIFICATION_SUCCESS_SCREEN"
        component={VerificationSuccessScreen}
      />
      <Stack.Screen name="VENDOR_FORGOT_PASSWORD_SCREEN" component={VendorForgotPassword} />
      <Stack.Screen name="VENDOR_OPEN_EMAIL_SCREEN" component={OpenEmail} />
      <Stack.Screen
        name="VENDOR_VERIFY_FORGOT_PASSWORD_EMAIL"
        component={VerifyVendorForgotPasswordEmail}
      />
       <Stack.Screen
        name="VENDOR_CHANGE_PASSWORD_SCREEN"
        component={VendorCreateNewPassword}
      />
       <Stack.Screen name="USER_FORGOT_PASSWORD_SCREEN" component={UserForgotPassword} />
      <Stack.Screen
        name="USER_VERIFY_FORGOT_PASSWORD_EMAIL"
        component={UserForgotPassword}
      />
       <Stack.Screen
        name="USER_CHANGE_PASSWORD_SCREEN"
        component={UserCreateNewPassword}
      />
    <Stack.Screen name="CUSTOMERTAB" component={CustomerNoAuthStack} />
    </Stack.Navigator>
  );
};

// Customer History Stack
const CustomerHistoryStack = () => {
  return (
    <CustomerStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerStack.Screen name="CUSTOMER_HISTORY" component={CustomerHistoryScreen} />
    </CustomerStack.Navigator>
  );
};

// Customer Settings Stack
const CustomerSettingsStack = () => {
  return (
    <CustomerStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerStack.Screen name="CUSTOMER_SETTINGS" component={CustomerSettingScreen} />
    </CustomerStack.Navigator>
  );
};

// Customer Auth Stack
const CustomerNoAuthStack = () => {
  return (
    <CustomerStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CUSTOMERTABS">
      <CustomerStack.Screen name="CUSTOMERTABS" component={CustomerTabNavigation} />
      <CustomerStack.Screen name="SEARCH_SCREEN" component={SearchScreen} />
      <CustomerStack.Screen name="CUSTOMER_LOGIN_SCREEN" component={CustomerLoginScreen} />
      <CustomerStack.Screen
        name="CUSTOMER_REGISTER_SCREEN"
        component={CustomerRegistrationScreen}
      />
      <CustomerStack.Screen name="BOOK_SLOT_SCREEN" component={BookSlotScreen} />
      <CustomerStack.Screen name="BOOK_SLOT_DETAIL_SCREEN" component={BookSlotDetailScreen} />
      <CustomerStack.Screen name="SLOT_DETAIL_SCREEN" component={SlotDetailScreen} />
      <CustomerStack.Screen name="ORDER_DETAIL_SCREEN" component={OrderDetailScreen} />
      <CustomerStack.Screen name="VIEW_RECEIPT_SCREEN" component={ViewReceiptScreen} />
      <CustomerStack.Screen name="MY_ACCOUNT_SCREEN" component={MyAccountScreen} />

      <CustomerStack.Screen name="CUSTOMER_HOME_SEARCH" component={AppSearchScreen} />
      <CustomerStack.Screen
        name="AVAILABLE_PRODUCTS_SCREEN"
        component={AvailableProductItemScreen}
      />
      <CustomerStack.Screen name="PRODUCTS_DETAILS_SCREEN" component={ProductDetailScreen} />
      <CustomerStack.Screen
        name="INDIVIDUAL_PRODUCTS_DETAILS_SCREEN"
        component={IndividaulProductDetailScreen}
      />
      <CustomerStack.Screen name="CUSTOMER_ORDER_SUMMARY" component={OrderSummaryScreen} />
      <CustomerStack.Screen
        name="CUSTOMER_ACCOUNT_SETTINGS_SCREENS"
        component={AccountSettingScreen}
      />
      <CustomerStack.Screen name="CUSTOMER_EDIT_PROFILE_SCREEN" component={EditProfileScreen} />
      <CustomerStack.Screen name="CUSTOMER_CHANGE_PASSWORD_SCREEN" component={UserChangePassword} />
      <CustomerStack.Screen name="CUSTOMER_SAVED_ITEMS_SCREEN" component={SavedItemsScreen} />
      <CustomerStack.Screen name="CUSTOMER_ADDRESS_SCREEN" component={CustomerAddress} />
      <CustomerStack.Screen
        name="CUSTOMER_NOTIFICATION_SCREEN"
        component={CustomerNotificationsScreen}
      />
      <CustomerStack.Screen
        name="CUSTOMER_HELP_CENTER_SCREEN"
        component={CustomerHelpCenterScreen}
      />
      <CustomerStack.Screen name="CUSTOMER_CONTACT_US_SCREEN" component={CustomerContactUsScreen} />
      <CustomerStack.Screen name="CUSTOMER_FAQ_SCREEN" component={CustomerFAQScreen} />
      <CustomerStack.Screen name="CUSTOMER_LEGAL_SCREEN" component={CustomerLegalScreen} />
      <CustomerStack.Screen
        name="CUSTOMER_TERMS_CONDITIONS_SCREEN"
        component={CustomerTermsAndConditionsScreen}
      />
      <CustomerStack.Screen
        name="CUSTOMER_PRIVACY_POLICY_SCREEN"
        component={CustomerPrivacyPolicyScreen}
      />
      <CustomerStack.Screen name="CUSTOMER_FEEDBACK_SCREEN" component={CustomerFeedbackScreen} />
      <CustomerStack.Screen
        name="CUSTOMER_DELETE_ACCOUNT_SCREEN"
        component={CustomerDeleteAccountScreen}
      />
      <CustomerStack.Screen
        name="CUSTOMER_COMPLETED_ORDERS_SCREEN"
        component={CompletedOrderDetails}/>
        <CustomerStack.Screen name="USER_FORGOT_PASSWORD_SCREEN" component={UserForgotPassword} />
        <CustomerStack.Screen
          name="USER_VERIFY_FORGOT_PASSWORD_EMAIL"
          component={VerifyUserForgotPasswordEmail}
        />
         <CustomerStack.Screen
          name="USER_CHANGE_PASSWORD_SCREEN"
          component={UserCreateNewPassword}
        />
        <CustomerStack.Screen
          name="USER_ORDER_TRACKING_SCREEN"
          component={OngoingOrderTrackingScreen}
        />
         <CustomerStack.Screen
          name="CUSTOMER_PAYMENT_SUCCESS_SCREEN"
          component={PaymentSuccessScreen}
        />
         <CustomerStack.Screen
          name="CUSTOMER_PAYMENT_ERROR_SCREEN"
          component={PaymentErrorScreen}
        />
      
    </CustomerStack.Navigator>
  );
};

// Customer Tab Navigation
const CustomerTabNavigation = () => {
  const activeColor = '#09242D';
  const inactiveColor = '#98A2B3';

  return (
    <CustomerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
      }}>
      <CustomerTab.Screen
        name="CUSTOMER_HOME_SCREEN"
        component={CustomerHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <CustomerHomeIcon color={focused ? activeColor : inactiveColor} />
            </View>
          ),
        }}
      />
      <CustomerTab.Screen
        name="CUSTOMER_BASKET_SCREEN"
        component={CustomerBasketScreen}
        options={{
          title: 'Basket',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused ? <CartIcon color={inactiveColor} /> : <CartTabIcon color={activeColor} />}
            </View>
          ),
        }}
      />
      <CustomerTab.Screen
        name="CUSTOMER_HISTORY_SCREEN"
        component={CustomerHistoryStack}
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <CustomerHistoryIcon color={focused ? activeColor : inactiveColor} />
            </View>
          ),
        }}
      />
      <CustomerTab.Screen
        name="CUSTOMER_SETTINGS_SCREEN"
        component={CustomerSettingsStack}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <CustomerSettingsIcon color={focused ? activeColor : inactiveColor} />
            </View>
          ),
        }}
      />
    </CustomerTab.Navigator>
  );
};

// Vendor Stack
const VendorAuthStack = () => {
  return (
    <VendorStack.Navigator screenOptions={{ headerShown: false }}>
      <VendorStack.Screen name="VENDORTABS" component={VendorTabNavigation} />

      <VendorStack.Screen name="VENDOR_REGISTRATION_SCREEN" component={VendorRegistrationScreen} />
      <VendorStack.Screen name="VENDOR_EMAIL_VERIFICATION_SCREEN" component={VerifyVendorEmail} />
      <VendorStack.Screen
        name="VENDOR_EMAIL_VERIFICATION_SUCCESS_SCREEN"
        component={VerificationSuccessScreen}
      />
      <VendorStack.Screen name="VENDOR_LOGIN_SCREEN" component={VendorLoginScreen} />
      <VendorStack.Screen name="VENDOR_SECURE_PAYOUT_SCREEN" component={SecurePayoutScreen} />
      <VendorStack.Screen name="VENDOR_ORDER_DETAILS_SCREEN" component={VendorOrderDetailsScreen} />
      <VendorStack.Screen
        name="VENDOR_ORDER_CONFIRMATION_SCREEN"
        component={OrderConfirmationScreen}
      />
      <VendorStack.Screen
        name="VENDOR_PRODUCT_DETAILS_SCREEN"
        component={VendorProductDetailScreen}
      />
      <VendorStack.Screen name="VENDOR_ADD_NEW_PRODUCT_SCREEN" component={VendorAddNewProduct} />
      <VendorStack.Screen name="VENDOR_PRODUCT_PREVIEW_SCREEN" component={VendorProductPreview} />
      <VendorStack.Screen name="VENDOR_EDIT_PRODUCT_SCREEN" component={VendorEditProduct} />
      <VendorStack.Screen name="VENDOR_ACCOUNT_SETTINGS_SCREEN" component={VendorAccountSettings} />
      <VendorStack.Screen name="VENDOR_EDIT_PROFILE_SCREEN" component={VendorEditProfileScreen} />
      <VendorStack.Screen name="VENDOR_NOTIFICATION_SCREEN" component={VendorNotificationsScreen} />
      <VendorStack.Screen name="VENDOR_HELP_CENTER_SCREEN" component={VendorHelpCenterScreen} />
      <VendorStack.Screen name="VENDOR_CONTACT_US_SCREEN" component={VendorContactUsScreen} />
      <VendorStack.Screen name="VENDOR_FAQ_SCREEN" component={VendorFAQScreen} />
      <VendorStack.Screen name="VENDOR_FEEDBACK_SCREEN" component={VendorFeedbackScreen} />
      <VendorStack.Screen name="VENDOR_LEGAL_SCREEN" component={VendorLegalScreen} />
      <VendorStack.Screen
        name="VENDOR_TERMS_CONDITIONS_SCREEN"
        component={TermsAndConditionsScreen}
      />
      <VendorStack.Screen
        name="VENDOR_PRIVACY_POLICY_SCREEN"
        component={VendorPrivacyPolicyScreen}
      />
      <VendorStack.Screen
        name="VENDOR_DELETE_ACCOUNT_SCREEN"
        component={VendorDeleteAccountScreen}
      />
      <VendorStack.Screen name="VENDOR_RESET_PASSWORD_SCREEN" component={VendorResetPassword} />
      <VendorStack.Screen name="VENDOR_FORGOT_PASSWORD_SCREEN" component={VendorForgotPassword} />
      <VendorStack.Screen name="VENDOR_OPEN_EMAIL_SCREEN" component={OpenEmail} />
      <VendorStack.Screen
        name="VENDOR_VERIFY_FORGOT_PASSWORD_EMAIL"
        component={VerifyVendorForgotPasswordEmail}
      />
      <VendorStack.Screen
        name="VENDOR_CHANGE_PASSWORD_SCREEN"
        component={VendorCreateNewPassword}
      />
      <VendorStack.Screen name="SELECT_BUSINESS_TYPE_SCREEN" component={SelectBusinessTypeScreen} />
      <VendorStack.Screen name="BUSINESS_WITH_LICENSE" component={BusinessWithLicense} />
      <VendorStack.Screen name="VENDOR_UPDATE_PASSWORD_SCREEN" component={VendorChangePassword} />
    </VendorStack.Navigator>
  );
};

// Vendor Tab Navigation
const VendorTabNavigation = () => {
  const activeColor = '#09242D';
  const inactiveColor = '#98A2B3';

  return (
    <VendorTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
      }}>
      <VendorTab.Screen
        name="VENDOR_HOME_SCREEN"
        component={VendorHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="grid" size={20} color={focused ? activeColor : inactiveColor} />
            </View>
          ),
        }}
      />
      <VendorTab.Screen
        name="VENDOR_ORDER_SCREEN"
        component={VendorOrderScreen}
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Octicons
                name="arrow-switch"
                size={20}
                color={focused ? activeColor : inactiveColor}
              />
            </View>
          ),
        }}
      />
      <VendorTab.Screen
        name="VENDOR_PRODUCT_SCREEN"
        component={VendorProductScreen}
        options={{
          title: 'Products',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <CustomerHistoryIcon color={focused ? activeColor : inactiveColor} />
            </View>
          ),
        }}
      />
      <VendorTab.Screen
        name="VENDOR_MESSAGE_SCREEN"
        component={VendorProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Profile size="20" color="#051217" variant={focused ? 'Bold' : 'Linear'} />
            </View>
          ),
        }}
      />
    </VendorTab.Navigator>
  );
};

// Main App Navigation
export default function AppNavigation() {
  const { isAuthenticated, currentUserType } = useNavigationAuth();
  const { vendorAccessToken } = useVendorStore();
  const { accessToken } = useUserStore();
 
  return (
    <MainAppStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {!isAuthenticated || (currentUserType === 'vendor' && !vendorAccessToken) || (currentUserType === 'customer' && !accessToken) ? (
          <MainAppStack.Screen name="WELCOME_SCREENS" component={WelcomeStack} />
        ) : currentUserType === 'customer' ? (
          <MainAppStack.Screen name="CUSTOMERTABS" component={CustomerNoAuthStack} />
        ) : (
          <MainAppStack.Screen name="VENDORTABS" component={VendorAuthStack} />
        )}
    </MainAppStack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 82,
    paddingBottom: hp(1.5),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabBarItemStyle: {
    paddingVertical: hp(1.2),
    justifyContent: 'center',
  },
  tabBarLabelStyle: {
    fontSize: fs(12),
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
