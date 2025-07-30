import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Screen, ScrollView, Text } from 'app/design-system';
import { wp } from 'app/resources/config';
import Checkbox from 'expo-checkbox';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { LoaderModal } from 'app/modals';
import { NOT_AVAILABLE } from 'app/utils/constants';

const VendorOrderDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;
  
  const { processOrder, isProcessingLoading } = useVendorApi();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [countdownValues, setCountdownValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const ADDRESS = order.deliveryInfo[0].deliveryAddress.address || NOT_AVAILABLE;
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const initialCheckedState = order.items.reduce((acc, item) => {
      acc[item._id] = false;
      return acc;
    }, {});
    setCheckedItems(initialCheckedState);
  }, [order.items]);

  const toggleItemCheck = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  useEffect(() => {
    if (order.deliveryInfo[0].deliveryMethod === 'Scheduled Delivery') {
      const interval = setInterval(() => {
        const now = dayjs();
        const deliveryDate = dayjs(order.deliveryInfo[0].deliveryDate);
        const diff = deliveryDate.diff(now);

        if (diff <= 0) {
          setCountdownValues({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
          });
          setTimeLeft('Delivery time reached');
          clearInterval(interval);
          return;
        }

        const durationObj = dayjs.duration(diff);

        setCountdownValues({
          days: durationObj.days(),
          hours: durationObj.hours(),
          minutes: durationObj.minutes(),
          seconds: durationObj.seconds(),
          isExpired: false,
        });

        // Keep this for backward compatibility
        setTimeLeft(
          `${durationObj.days()}d ${durationObj.hours()}h ${durationObj.minutes()}m ${durationObj.seconds()}s`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order.deliveryInfo]);

  const handleProcessOrder = async () => {
    try {
      // Get IDs of checked items only
      const availableItems = order.items
        .filter((item) => checkedItems[item._id])
        .map((item) => item._id);

      if (availableItems.length === 0) {
        console.log('No items selected for processing');
        return;
      }
      console.log(' processing id', order._id, availableItems);
      const response = await processOrder({
        orderId: order._id, // Use the actual order ID string, not an array
        availableItems,
        successCallback: () => {
          const preparedItems = order.items.filter((item) => checkedItems[item._id]);
          //@ts-ignore
          navigation.navigate('VENDOR_ORDER_CONFIRMATION_SCREEN', {
            order: {
              ...order,
              preparedItems,
              preparedItemsCount: preparedItems.length,
              isComplete: preparedItems.length === order.items.length,
            },
          });
        },
      });

      if (response.success) {
        console.log('Order processed successfully:', response);
      }
    } catch (error) {
      console.log('Order processing error:', error);
    }
  };
  const handleDoneProcessing = () => {
    // Filter and log only the checked items
    const preparedItems = order.items.filter((item) => checkedItems[item._id]);
    console.log('Processed order:', {
      orderId: order.orderId,
      preparedItems,
      totalItems: order.items.length,
      preparedItemsCount: preparedItems.length,
      isComplete: preparedItems.length === order.items.length,
    });
  };

  const handleDoneProcessingDummy = () => {
    const preparedItems = order.items.filter((item) => checkedItems[item._id]);

    //@ts-ignore
    navigation.navigate('VENDOR_ORDER_CONFIRMATION_SCREEN', {
      order: {
        ...order,
        preparedItems,
        preparedItemsCount: preparedItems.length,
        isComplete: preparedItems.length === order.items.length,
      },
    });
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const allItemsChecked = checkedCount === order.items.length;
  const isButtonDisabled = !allItemsChecked || !isAgreementChecked;
  const isScheduledDelivery = order.deliveryInfo[0].deliveryMethod === 'Scheduled Delivery';

  return (
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          <LoaderModal isLoading={isProcessingLoading} />
          <View style={{ rowGap: 12 }}>
            <View style={styles.header}>
              <Text text={order.user.fullName} />
              <Text text={order.orderId} />
            </View>
            <View style={styles.orderDetails}>
              <Text type="small_regular" color="primary40" text="Delivery address: " />
              <Text type="small_regular" color="primary80" numberOfLines={2} text={ADDRESS} />
            </View>

            <View style={styles.orderDetails}>
              <Text type="sub_regular" color="primary40" text="Order date: " />
              <Text
                type="small_regular"
                color="primary80"
                text={dayjs(order.createdAt).format('dddd, D MMM, h:mm A')}
              />{' '}
            </View>
            <View style={styles.orderDetails}>
              <Text type="small_regular" color="primary40" text="Delivery type: " />
              <Text
                type="small_regular"
                color="primary80"
                text={order.deliveryInfo[0].deliveryMethod}
              />
            </View>
            <View style={styles.orderDetails}>
              <Text type="sub_regular" color="primary40" text="Delivery date: " />
              <Text
                type="small_regular"
                color="primary80"
                text={dayjs(order.deliveryInfo[0].deliveryDate).format('dddd, D MMM, h:mm A')}
              />
            </View>
            <View style={styles.orderDetails}>
              <Text type="sub_regular" color="primary40" text="Status: " />
              <Text type="sub_regular" color="primary80" text={order.status} />
            </View>
            <View style={styles.orderDetails}>
              <Text type="sub_regular" color="primary40" text="Total: " />
              <Text type="sub_regular" color="primary80" text={`£${order.total.toFixed(2)}`} />
            </View>
          </View>

          <View style={{ borderBottomWidth: 0.5, borderColor: '#CED3D5' }} />

          <View style={styles.processOrder}>
            <Text type="small_bold" color="primary80" text="PROCESS ORDER" />
            <Text
              type="small_regular"
              color="secondary"
              text="Please tick the items you have placed in the bag. This ensures accurate order fulfillment and prevents missing items"
              style={styles.processOrderText}
            />
          </View>

          <View style={{ rowGap: 16 }}>
            <Text
              type="small_semibold"
              color="primary40"
              text={`${checkedCount}/${order.items.length} selected`}
            />
            {order.items.map((item) => (
              <Pressable
                key={item._id}
                onPress={() => toggleItemCheck(item._id)}
                style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
                <Checkbox
                  value={checkedItems[item._id]}
                  onValueChange={() => toggleItemCheck(item._id)}
                  color={checkedItems[item._id] ? '#0F973D' : '#000000'}
                  style={{ width: 19, height: 19 }}
                />
                <View style={styles.itemContainer}>
                  <Text
                    type="small_regular"
                    color="primary80"
                    text={item.product.title}
                    truncateWords={6}
                  />
                  <Text
                    type="small_regular"
                    color="primary80"
                    text={`x${item.quantity}`}
                    truncateWords={6}
                  />
                  <Text
                    type="small_regular"
                    color="primary80"
                    text={`£${item.price.toFixed(2)}`}
                    truncateWords={6}
                  />
                </View>
              </Pressable>
            ))}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text type="small_semibold" color="primary80" text={'Total'} />
              <Text type="small_semibold" color="primary80" text={`£${order.total.toFixed(2)}`} />
            </View>
          </View>

          {isScheduledDelivery && (
            <View style={styles.countdownContainer}>
              <Text type="small_bold" text="Time until delivery:" />
              {countdownValues.isExpired ? (
                <Text type="body_semibold" text="Delivery time reached" color="primary80" />
              ) : (
                <View style={styles.countdownRow}>
                  <View style={styles.countdownBox}>
                    <Text
                      type="body_semibold"
                      text={countdownValues.days.toString()}
                      color="white"
                    />
                    <Text type="small_regular" text="days" color="white" />
                  </View>
                  <View style={styles.countdownBox}>
                    <Text
                      type="body_semibold"
                      text={countdownValues.hours.toString()}
                      color="white"
                    />
                    <Text type="small_regular" text="hours" color="white" />
                  </View>
                  <View style={styles.countdownBox}>
                    <Text
                      type="body_semibold"
                      text={countdownValues.minutes.toString()}
                      color="white"
                    />
                    <Text type="small_regular" text="mins" color="white" />
                  </View>
                  <View style={styles.countdownBox}>
                    <Text
                      type="body_semibold"
                      text={countdownValues.seconds.toString()}
                      color="white"
                    />
                    <Text type="small_regular" text="secs" color="white" />
                  </View>
                </View>
              )}
            </View>
          )}

          {allItemsChecked && (
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isAgreementChecked}
                onValueChange={setIsAgreementChecked}
                color={isAgreementChecked ? '#0F973D' : '#000000'}
                style={{ width: 19, height: 19 }}
              />
              <Text
                type="sub_regular"
                text="By checking this box you confirm that you have read, understood, and agree to sweefftly, Terms and Conditions and Privacy Policy"
              />
            </View>
          )}

          <Button
            title="Done Processing"
            onPress={handleProcessOrder}
            disabled={!Object.values(checkedItems).some(Boolean)} // Disable if no items checked
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default VendorOrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  processOrder: {
    rowGap: 16,
  },
  processOrderText: {
    backgroundColor: '#FFF9ED',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    columnGap: 8,
  },
  countdownContainer: {
    alignItems: 'center',
    marginVertical: 16,
    rowGap: 8,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
  },
  countdownBox: {
    backgroundColor: '#0F973D', // Green background
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: wp(18),
  },
});
