import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Screen, ScrollView, Text } from 'app/design-system';
import { useNavigation } from '@react-navigation/native';

const OrderConfirmationScreen = ({ route }) => {
  const { order } = route.params;
    const navigation = useNavigation();
    
  return (
    <Screen>
      <>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ rowGap: 12 }}>
            <View style={styles.header}>
              <Text text={order.user.fullName} />
              <Text text={order.orderId} />
            </View>
            <View style={styles.orderDetails}>
              <Text type="sub_regular" color="primary40" text="Delivery address: " />
              <Text
                type="sub_regular"
                color="primary80"
                numberOfLines={2}
                text="522 Kilmarnock Rd, Glasgow G43 2BL, United Kingdom"
              />
            </View>
            <View style={styles.orderDetails}>
              <Text type="sub_regular" color="primary40" text="Order date: " />
              <Text type="sub_regular" color="primary80" text="Friday, 12th Feb, 10:00am" />
            </View>
            <View style={styles.orderDetails}>
              <Text type="sub_regular" color="primary40" text="Delivery type: " />
              <Text type="sub_regular" color="primary80" text="Right now" />
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
            <Text type="small_bold" color="primary80" text="ORDER SUMMARY" />
            <Text
              type="small_regular"
              color="secondary"
              text={`${order.preparedItemsCount} of ${order.items.length} items prepared`}
              style={styles.processOrderText}
            />
          </View>

          <View style={{ rowGap: 16 }}>
            {order.preparedItems.map((item) => (
              <View key={item._id} style={styles.itemContainer}>
                <Text type="small_regular" color="primary80" text={item.product.title} truncateWords={6} />
                <Text type="small_regular" color="primary80" text={`x${item.quantity}`} truncateWords={6} />
                <Text type="small_regular" color="primary80" text={`£${item.price.toFixed(2)}`} />
              </View>
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
          
        </View>
      </ScrollView>
      <Button
            title="Back to ordered items"
            onPress={()=>{navigation.navigate('VENDORTABS', { screen: 'VENDOR_ORDER_SCREEN'})}}
          />
      </>
    </Screen>
  );
};

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
});

export default OrderConfirmationScreen;