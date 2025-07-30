import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Image } from 'app/design-system';
import { ChefLogo } from 'app/assets/images';
import { wp } from 'app/resources/config';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

interface OrderItemProps {
  order: {
    _id: string;
    orderId: string;
    user: {
      fullName: string;
    };
    items: Array<{
      product: {
        title: string;
      };
      quantity: number;
      price: number;
    }>;
    total: number;
    status: string;
    createdAt: string;
  };
}

const OrderedItem = ({ order }: OrderItemProps) => {
  const navigation = useNavigation();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#0F973D';
      case 'pending':
        return '#F4AB19';
      case 'processing':
        return '#1671D9';
      default:
        return 'red';
    }
  };

  const getBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#ECFFE9';
      case 'pending':
        return '#FFF9E9';
      case 'processing':
        return '#E9EDFF';
      default:
        return '#FFE9E9';
    }
  };

  const handleViewItems = () => {
    navigation.navigate('VENDOR_ORDER_DETAILS_SCREEN', { order });
  };

  // Format the createdAt timestamp using dayjs
  const formattedTime = dayjs(order.createdAt).fromNow();

  return (
    <View style={styles.container}>
      <View>
        <Image uri={ChefLogo} width={30} height={30} bR={30} />
      </View>
      <View style={{ flex: 1}}>
        <View style={styles.header}>
          <Text type="small_semibold" text={order.user.fullName} />
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <Text type="small_regular" text={`${order.items.length} items `} />
            <Text type="small_regular" text={formattedTime} />
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            type="small_regular"
            text={order.status}
            style={[
              
              {
                color: getStatusColor(order.status),
                backgroundColor: getBackgroundColor(order.status),
                alignSelf: 'flex-start',
                borderRadius: wp(24),
                paddingVertical: 5,
                paddingHorizontal: 10,
              },
            ]}
          />
       
            <Text text="View items" onPress={handleViewItems} style={{ color: '#0F973D'}}/>
         
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 14,
    columnGap: 10,
    backgroundColor: 'white',
    borderRadius: wp(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
    rowGap: 5,
  },
});

export default OrderedItem;
