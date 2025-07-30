import { FlatList, Pressable, View, StyleSheet } from 'react-native';
import React from 'react';
import { Screen, Text, Image } from 'app/design-system';
import { useRoute } from '@react-navigation/native';
import { CustomerOrderDetailsScreenProps } from 'app/navigation/types';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import { NOT_AVAILABLE } from 'app/utils/constants';
import { Feather } from '@expo/vector-icons';
import { wp } from 'app/resources/config';

// TypeScript Types
interface Product {
  _id: string;
  title: string;
}

interface OrderItem {
  _id: string;
  price: number;
  quantity: number;
  product: Product;
}

interface OrderDetails {
  orderId: string;
  vendor: {
    companyName: string;
    coverPhoto: string;
  };
  items: OrderItem[];
}

const OrderDetailScreen = ({ navigation }: CustomerOrderDetailsScreenProps) => {
  const route = useRoute();
  const { mongoId, orderId } = route.params as { orderId: string; mongoId: string };

  const { orderDetail } = useUserProfileApi();
  const { data, isLoading, error } = orderDetail(mongoId);

  // Render order item
  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.row}>
      <Text type="body_medium" text={item.product.title || 'Unknown Item'} truncateWords={2} />
      <Text text={`$${item.price.toFixed(2)}`} />
      <Text text={`${item.quantity}`} />
      <Text text={`$${(item.price * item.quantity).toFixed(2)}`} />
    </View>
  );

  // Determine content based on loading/error/data states
  let content = null;
  if (isLoading) {
    content = <Text text="Loading..." type="headline_3_regular" />;
  } else if (error || !data) {
    content = (
      <>
        <Text text="Error loading order details" type="headline_3_regular" />
        <Pressable
          style={styles.tab}
          onPress={() => navigation.goBack()}
        >
          <Text text="Go Back" type="small_medium" color="primary30" />
        </Pressable>
      </>
    );
  } else {
    const order: OrderDetails = data;
    content = (
      <>
        <View style={styles.tabNavigation}>
          <View style={[styles.activeTab, styles.tab]}>
            <Text type="small_medium" color="primary30" text="Your order" />
          </View>
        </View>

        {/* Order ID */}
        <View style={styles.summaryRow}>
          <Text text={`Order #${order.orderId}`} type="body_semibold" color="primary80" />
          <Text
            style={{ textDecorationLine: 'underline' }}
            text="Report an issue"
            color="error"
            type="small_regular"
            onPress={() => {}}
          />
        </View>
        <View style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 12 }}>
          {/* Vendor Info */}
          <View style={styles.summaryRow}>
            {order.vendor.coverPhoto ? (
              <Image
                uri={order.vendor.coverPhoto}
                height={31}
                width={31}
                bR={15}
                resizeMode="cover"
              />
            ) : (
              <Text type="body_medium" text={NOT_AVAILABLE} />
            )}
            <Text type="emphasized_medium" color="primary80" text={order.vendor.companyName} />
          </View>

          {/* Order Items List */}
          <FlatList
            data={order.items}
            keyExtractor={(item) => item._id}
            renderItem={renderOrderItem}
            ListEmptyComponent={<Text text="No items found" />}
          />
        </View>
        <View style={{ flexDirection: 'row', padding: 12, columnGap: 5, backgroundColor: '#FFF9ED', borderRadius: 12, marginTop: 10 }}>
          <Feather name="info" size={18} color="#CB8E15" />
          <Text color="secondary" type="small_regular" text="Please note that opened bottles and food items are not eligible for returns" />
        </View>
      </>
    );
  }

  return (
    <Screen bgColor="#FFFEFA">
      <View style={styles.container}>{content}</View>
    </Screen>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F0F0F0',
    padding: 5,
    borderRadius: wp(12),
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: wp(10),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
});