import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Screen, Text, Image, Button, ScrollView, KeyboardWrapper } from 'app/design-system';
import { hp, wp } from 'app/resources/config';
import { CustomerOrderSummaryScreenProps } from 'app/navigation/types';
import { ChefLogo } from 'app/assets/images';
import { ArrowDown2, ArrowRight2, InfoCircle, MessageText1, Ticket } from 'iconsax-react-native';
import {
  DeliveryTimeSelector,
  OrderSummaryProductCard,
  PaymentMethodSelector,
  PickupTimeSelector,
} from 'app/components';
import { PaymentMethod, PaymentResult } from 'app/types/paymentTypes';
import { useStripePaymentService } from 'app/hooks/api/use-stripe-payment';
import useAlert from 'app/hooks/useAlert';
import useAddressStore from 'app/store/use-address-store';
import useCartStore from 'app/store/use-cart-store';
import { useOrderPricing } from 'app/hooks/api/use-order-pricing';
import useUserStore from 'app/store/use-user-store';
import { usePostUserAddress } from 'app/hooks/api/use-add-address';
import dayjs from 'dayjs';
import { useShippingAddressStore } from 'app/store/shippingAddress';
import { ChangeAddressModal, LoaderModal } from 'app/modals';
import PlacedOrderModal from 'app/modals/PlacedOrderModal';
import ErrorPlacingOrderModal from 'app/modals/ErrorPlacingOrderModal';

const TABS = {
  ORDER_SUMMARY: 'Order Summary',
  DELIVERY_PAYMENT: 'Delivery and Payment',
} as const;

const DELIVERY_MODES = {
  DELIVERY: 'Home Delivery',
  PICKUP: 'Pick up',
} as const;

type Tab = (typeof TABS)[keyof typeof TABS];
type DeliveryMode = (typeof DELIVERY_MODES)[keyof typeof DELIVERY_MODES];

interface OrderSummaryScreenProps extends CustomerOrderSummaryScreenProps {}

const OrderSummaryScreen = ({ navigation, route }: OrderSummaryScreenProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS.ORDER_SUMMARY);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(DELIVERY_MODES.DELIVERY);
  const [activeDeliverySelector, setActiveDeliverySelector] = useState<
    'delivery' | 'pickup' | null
  >(null);
  const [selectedTime, setSelectedTime] = useState<{
    type: string;
    date?: Date;
    slot?: string;
  } | null>({
    type: 'right now',
    date: new Date(),
  });
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('Credit/Debit Card');
  const [selectedTip, setSelectedTip] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [collectionInstruction, setCollectionInstruction] = useState('');
  const [orderPriceResponse, setOrderPriceResponse] = useState<any>(null);
  const [orderPriceLoading, setOrderPriceLoading] = useState(false);
  const [deliveryAddressId, setDeliveryAddressId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);



  const { errorAlert, successAlert, attentionAlert } = useAlert();
  const { processPayment, loading, postOrder } = useStripePaymentService();
  const { clearCart } = useCartStore();
  const { postAddress, isLoading: addressLoading } = usePostUserAddress();
  const { user: userDetails } = useUserStore();
  console.log('the user details :', userDetails)
  const { phoneNumber, address, postCode } = userDetails;
  const { orderPrice } = useOrderPricing();

  const { cartItems: initialCartItems, vendorDetails, cartData } = route.params;
  const { coverPhoto, description, vendorName } = vendorDetails;
  const { _id } = cartData;
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Memoized Calculations
  const subTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
    [cartItems]
  );
  const totalPrice = useMemo(
    () =>
      (
        parseFloat(subTotal) +
        parseFloat(orderPriceResponse?.deliveryFee || '0') +
        parseFloat(orderPriceResponse?.orderCharges?.serviceCharge || '0')
      ).toFixed(2),
    [subTotal, orderPriceResponse]
  );

  // Handlers
  const updateQuantity = useCallback((id: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item))
    );
  }, []);

  const handleUpdateAddress = useCallback(
    async ({
      address: newAddress,
      postCode: newPostCode,
    }: {
      address: string;
      postCode: string;
    }) => {
      if (!newAddress.trim() || !newPostCode.trim()) {
        errorAlert('Please provide a valid address, phone number, and postcode.');
        return;
      }

      try {
        const addressResponse = await postAddress({
          address: newAddress,
          phone: phoneNumber,
          postCode: newPostCode,
          successCallback: () => successAlert('Address updated successfully'),
        });

        if (!addressResponse?.newDelivery?.id) {
          throw new Error('Failed to update address');
        }

        const newDeliveryId = addressResponse.newDelivery.id;
        setDeliveryAddressId(newDeliveryId);
        useUserStore.getState().setUser({
          ...userDetails,
          address: newAddress,
          phoneNumber: phoneNumber,
          postCode: newPostCode,
        });
        setIsModalVisible(false);
        successAlert('Address updated successfully');
      } catch (error) {
        errorAlert(error instanceof Error ? error.message : 'Failed to update address');
      }
    },
    [postAddress, errorAlert, successAlert, userDetails]
  );

  const handleCheckout = useCallback(async () => {
    if (!deliveryAddressId && !address) {
      attentionAlert('Please provide a valid shipping address.');
      setIsModalVisible(true);
      return;
    }

    setOrderPriceLoading(true);
    try {
      let currentDeliveryId = deliveryAddressId;
console.log('the data sent: ',   address,
  phoneNumber,
  postCode)
      if (!currentDeliveryId && address) {
        const addressResponse = await postAddress({
          address: address,
          phone: phoneNumber,
          postCode: postCode,
          successCallback: () => successAlert('Address saved successfully'),
        });

        currentDeliveryId = addressResponse?.newDelivery?.id;
        if (!currentDeliveryId) throw new Error('Failed to save address');
        setDeliveryAddressId(currentDeliveryId);
        // Update user store
        useUserStore.getState().setUser({
          ...userDetails,
          address: address,
          phoneNumber: phoneNumber || userDetails.phoneNumber,
          postCode: postCode || userDetails.postCode,
        });
      }

      if (!currentDeliveryId) {
        throw new Error('No valid delivery address ID available');
      }

      const result = await orderPrice({
        cartId: _id,
        deliveryAddress: currentDeliveryId,
        successCallback() {
          console.log('Success calculating price');
        },
      });

      if (!result) throw new Error('Failed to calculate order price');

      setOrderPriceResponse(result);
      setActiveTab(TABS.DELIVERY_PAYMENT);
    } catch (error) {
      errorAlert(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setOrderPriceLoading(false);
    }
  }, [
    address,
    phoneNumber,
    postCode,
    _id,
    deliveryAddressId,
    postAddress,
    orderPrice,
    errorAlert,
    successAlert,
    userDetails,
  ]);

  const handlePayments = useCallback(async () => {
    if (isProcessingPayment || loading) return;

    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    if (!deliveryAddressId && deliveryMode === DELIVERY_MODES.DELIVERY) {
      Alert.alert('Error', 'Please set a delivery address.');
      setIsModalVisible(true);
      return;
    }

    const orderDetails: any = {
      cartId: _id,
      deliveryMethod:
        deliveryMode === DELIVERY_MODES.PICKUP ? 'click and collect' : 'Home Delivery',
      tips: selectedTip,
      deliveryFee: orderPriceResponse?.deliveryFee || 0,
    };

    if (deliveryMode === DELIVERY_MODES.DELIVERY) {
      if (!selectedTime || !deliveryAddressId) {
        Alert.alert('Error', 'Please select a delivery time and address.');
        return;
      }
      orderDetails.deliveryAddress = deliveryAddressId;
      orderDetails.deliveryPeriod = selectedTime.type === 'right now' ? 'Now' : 'Scheduled';
      orderDetails.deliveryDate = selectedTime.date
        ? dayjs(selectedTime.date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD');
      if (selectedTime.type === 'schedule' && !selectedTime.slot) {
        Alert.alert('Error', 'Please select a time slot.');
        return;
      }
    } else {
      if (!selectedTime?.date || !selectedTime?.slot) {
        Alert.alert('Error', 'Please select a pickup date and time slot.');
        return;
      }
      orderDetails.deliveryDate = dayjs(selectedTime.date).format('YYYY-MM-DD');
      orderDetails.collectionInstruction = collectionInstruction || 'No instructions provided';
    }

    setIsProcessingPayment(true);
    try {
      console.log('Payment process starting...');
      const result = await processPayment(
        orderDetails,
        () => {
          console.log('Process payment success callback triggered');
          clearCart();
        },
        (errorMessage) => {
          console.log('Process payment error callback triggered:', errorMessage);
          errorAlert(errorMessage);
          navigation.navigate("CUSTOMER_PAYMENT_ERROR_SCREEN")
          console.log('Payment error state set to true');
        }
      );
    
      console.log('Payment process result:', result);
      
      if (result?.success && result?.response?.orderDetails?.orderId) {
        console.log('Posting order with ID:', result.response.orderDetails.orderId);
        await postOrder(
          result.response.orderDetails.orderId,
          () => {
            console.log('Post order success callback triggered');
            navigation.navigate("CUSTOMER_PAYMENT_SUCCESS_SCREEN")
            console.log('Payment success state set to true');
          },
          (errorMessage) => {
            console.log('Post order error callback triggered:', errorMessage);
            errorAlert(errorMessage);
            navigation.navigate("CUSTOMER_PAYMENT_ERROR_SCREEN")
            console.log('Payment error state set to true after post order failure');
          }
        );
      } else {
        console.log('Payment process did not return success or order ID');
        if (result?.cancelled) {
          console.log('Payment was cancelled');
          errorAlert('Payment was cancelled');
        } else {
          console.log('Payment failed with result:', result);
          errorAlert('Payment processing failed');
        }
        navigation.navigate("CUSTOMER_PAYMENT_ERROR_SCREEN")
        console.log('Payment error state set to true due to failed/cancelled payment');
      }
    } catch (error) {
      console.error('Unexpected error in payment process:', error);
      errorAlert('Payment processing failed');
      navigation.navigate("CUSTOMER_PAYMENT_ERROR_SCREEN")
      console.log('Payment error state set to true due to exception');
    } finally {
      setIsProcessingPayment(false);
      console.log('Payment processing state set to false');
    }
  }, [
    isProcessingPayment,
    loading,
    selectedPayment,
    deliveryMode,
    selectedTime,
    deliveryAddressId,
    collectionInstruction,
    orderPriceResponse,
    _id,
    processPayment,
    postOrder,
    clearCart,
    errorAlert,
  ]);
  // Prevent tab switching unless checkout is complete
  const handleTabPress = (tab: Tab) => {
    if (tab === TABS.DELIVERY_PAYMENT && !orderPriceResponse) {
      errorAlert('Please complete the checkout process first.');
      return;
    } else if (tab === TABS.ORDER_SUMMARY && activeTab === TABS.DELIVERY_PAYMENT) {
      navigation.goBack();
      return;
    }
  };

  // Render Functions
  const renderOrderSummary = () => (
    <>
      <ScrollView>
        <KeyboardWrapper>
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.tabContent}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingTop: 15 }}>
              <View style={{ width: '70%', flexDirection: 'row', columnGap: 5, flexWrap: 'wrap' }}>
                <Text type="small_bold" color="primary80" text={`📍 Delivery Address:`} />
                <Text type="small_bold" color="primary40" text={`${address || 'Not set'}`} />
              </View>
              <Text
                type="small_bold"
                color="secondary"
                text={'Change'}
                style={{ textDecorationLine: 'underline' }}
                onPress={() => setIsModalVisible(true)}
              />
            </View>
            <View style={{ borderBottomWidth: 0.5, borderColor: '#CED3D5' }} />
            <View style={[styles.sectionHeader, { paddingTop: 2 }]}>
              <Text type="body_semibold" text="Order Summary" />
              <Text type="small_regular" color="primary40" text="Double-check your details." />
            </View>
            <View style={styles.merchantSection}>
              <View style={styles.merchantHeader}>
                <Image uri={coverPhoto} width={31} height={31} bR={15} />
                <View>
                  <Text type="small_medium" text={vendorName} color="primary80" />
                  <Text type="sub_regular" text={description} truncateWords={5} />
                </View>
              </View>
              {cartItems.map((item) => (
                <OrderSummaryProductCard
                  key={item.id}
                  name={item.title}
                  price={item.price}
                  initialQuantity={item.quantity}
                  onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                />
              ))}
            </View>
            {/* Message Section */}
            <View style={styles.noteSection}>
              <Pressable
                onPress={() => setIsMessageOpen((prev) => !prev)}
                style={styles.messageToggle}>
                <View style={styles.messageToggleContent}>
                  <MessageText1 size="20" color="#324950" />
                  <Text type="body_regular" color="primary50" text="Leave a message" />
                </View>
                {isMessageOpen ? (
                  <ArrowDown2 size="20" color="#324950" />
                ) : (
                  <ArrowRight2 size="20" color="#324950" />
                )}
              </Pressable>
              {isMessageOpen && (
                <TextInput
                  placeholder="Type your message here"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  style={styles.textArea}
                />
              )}
            </View>
          </Animated.View>
        </KeyboardWrapper>
      </ScrollView>
      <Button
        title={`Go to Checkout £${subTotal}`}
        isLoading={orderPriceLoading || addressLoading}
        onPress={handleCheckout}
        disabled={cartItems.length === 0}
      />
    </>
  );

  const renderDeliveryPayment = () => (
    <ScrollView>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.tabContent}>
        <View style={styles.deliveryModeContainer}>
          {Object.values(DELIVERY_MODES).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setDeliveryMode(mode as DeliveryMode)}
              style={[
                styles.deliveryModeTab,
                deliveryMode === mode && styles.activeDeliveryModeTab,
              ]}>
              <Text
                type="body_medium"
                color={deliveryMode === mode ? 'secondary' : 'black'}
                text={mode}
              />
            </Pressable>
          ))}
        </View>
        <Text
          type="small_bold"
          color="primary80"
          text={`📍 Delivery Address: ${address || 'Not set'}`}
        />
        {deliveryMode === DELIVERY_MODES.DELIVERY ? (
          <DeliveryTimeSelector
            onModeChange={setActiveDeliverySelector}
            onTimeSelect={setSelectedTime}
            subTotal={subTotal}
            deliveryFee={orderPriceResponse?.deliveryFee?.toFixed(2) || '0.00'}
            serviceCharge={orderPriceResponse?.orderCharges?.serviceCharge?.toFixed(2) || '0.00'}
            totalPrice={totalPrice}
          />
        ) : (
          <PickupTimeSelector
            onModeChange={setActiveDeliverySelector}
            onTimeSelect={setSelectedTime}
            subTotal={subTotal}
            deliveryFee={orderPriceResponse?.deliveryFee?.toFixed(2) || '0.00'}
            serviceCharge={orderPriceResponse?.orderCharges?.serviceCharge?.toFixed(2) || '0.00'}
            totalPrice={totalPrice}
          />
        )}
        <PaymentMethodSelector
          mode={deliveryMode.toLowerCase() as 'delivery' | 'pickup'}
          onPaymentSelect={setSelectedPayment}
        />
        <Button
          title={`Pay with ${selectedPayment} £${totalPrice}`}
          onPress={handlePayments}
          disabled={isProcessingPayment || loading || !selectedTime}
          isLoading={isProcessingPayment || loading}
        />
      </Animated.View>
    </ScrollView>
  );

  return (
    <Screen pH={0} bgColor="#FFFEFA">
      <>
        <LoaderModal
          isLoading={addressLoading || isProcessingPayment || loading || orderPriceLoading}
        />
        <View style={styles.container}>
          <View style={styles.tabNavigation}>
            {Object.values(TABS).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => handleTabPress(tab as Tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}>
                <Text
                  type="small_medium"
                  color={activeTab === tab ? 'black' : 'primary30'}
                  text={tab}
                />
              </Pressable>
            ))}
          </View>
          <View style={styles.content}>
            {activeTab === TABS.ORDER_SUMMARY ? renderOrderSummary() : renderDeliveryPayment()}
          </View>

        
        </View>

        <ChangeAddressModal
          isVisible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={handleUpdateAddress}
          currentAddress={address || 'Not set'}
          currentPostCode={postCode || ''}
          isLoading={addressLoading}
        />

      </>
    </Screen>
  );
};

export default OrderSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#292D320D',
  },
  tabNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F0F0F0',
    padding: 5,
    borderRadius: wp(12),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: wp(10),
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    rowGap: 20,
  },
  sectionHeader: {
    paddingVertical: 20,
  },
  merchantSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: wp(12),
  },
  merchantHeader: {
    flexDirection: 'row',
    columnGap: 15,
    alignItems: 'center',
  },
  noteSection: {
    rowGap: 30,
    marginVertical: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#CED3D5',
  },
  refundNote: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    backgroundColor: '#FFF9ED',
    padding: 10,
    borderRadius: wp(12),
  },
  messageToggle: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#CED3D5',
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  messageToggleContent: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  messageInput: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#CED3D5',
    borderRadius: 12,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    padding: 10,
  },
  deliveryModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    marginVertical: 10,
  },
  deliveryModeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeDeliveryModeTab: {
    borderBottomWidth: 3,
    borderColor: '#CB8E15',
  },
  deliveryContent: {
    flex: 1,
    backgroundColor: '',
    rowGap: 12,
  },
  pickupContent: {
    flex: 1,
    backgroundColor: '',
    rowGap: 12,
  },
  voucherButton: {
    flexDirection: 'row',
    padding: hp(10),
    borderWidth: 0.5,
    borderRadius: wp(10),
    borderColor: '#CED3D5',
    alignItems: 'center',
    columnGap: 5,
  },
});
