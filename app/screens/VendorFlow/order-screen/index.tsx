import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import React, { useState, useMemo } from 'react';
import { Button, Screen, Text } from 'app/design-system';
import { FilterComponent, OrderedItem } from 'app/components';
import { hp, wp } from 'app/resources/config';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from 'app/assets/svg';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import useVendorStore from 'app/store/use-vendor-store';

// Define Order type based on API response
interface Order {
  _id: string;
  orderId: string;
  user: string;
  items: Array<{
    product: string;
    quantity: number;
    markedByVendor: boolean;
    price: number;
  }>;
  total: number;
  refund: {
    amount: number;
    refunded: boolean;
  };
  status: string;
  paymentStatus: string;
  vendor: string;
  tips: number;
  deliveryInfo: {
    deliveryMethod: string;
    deliveryFee: number;
    deliveryDate: string;
    deliveryAddress: string;
    collectionInstruction: string;
  };
  createdAt: string;
  gophr: string;
  vendorCharge: number;
}

const VendorOrderScreen = () => {
  const { vendor, vendorAccessToken } = useVendorStore();
  const navigation = useNavigation();
  const {
    getOrders: { data, isLoading, error, refresh },
  } = useVendorApi();

  if (!vendor || !vendorAccessToken) {
    return null;
  }
  // Filter states
  const [orderFilter, setOrderFilter] = useState<string>('All orders');
  const [dateFilter, setDateFilter] = useState<string>('All time');

  // Filter options
  const orderStatusFilters = [
    'All orders',
    'Pending orders',
    'Processed',
    'Completed',
    'Paid',
  ];
  const dateRangeFilters = [
    'All time',
    'Recent',
    'This month',
    'Last month',
    'Last 3 months',
    'Last 6 months',
  ];

  // Handle navigation to order details
  const handleViewItems = (order: Order) => {
    navigation.navigate('VENDOR_ORDER_DETAILS_SCREEN', { order });
  };

  // Handle filter changes
  const handleOrderFilterPress = (filter: string) => {
    setOrderFilter(filter);
  };

  const handleDateFilterPress = (filter: string) => {
    setDateFilter(filter);
  };

  // Reset filters
  const resetFilters = () => {
    setOrderFilter('All orders');
    setDateFilter('All time');
  };

  // Compute filtered orders
  const filteredOrders = useMemo(() => {
    if (!data?.Orders || data.Orders.length === 0) return [];

    let filtered = [...data.Orders];

    // Apply order status filter
    if (orderFilter !== 'All orders') {
      const statusMap: { [key: string]: string } = {
        'Pending orders': 'Pending',
        Processed: 'Processed',
        Completed: 'Completed',
        Paid: 'Paid',
      };
      const status = statusMap[orderFilter];
      if (status) {
        filtered = filtered.filter((order) => order.status === status);
      }
    }

    // Apply date range filter
    if (dateFilter !== 'All time') {
      const now = new Date('2025-04-10T23:59:59.999Z'); // End of current day
      filtered = filtered.filter((order) => {
        const createdAt = new Date(order.createdAt);
        if (isNaN(createdAt.getTime())) return false; // Skip invalid dates
        switch (dateFilter) {
          case 'Recent':
            return createdAt >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'This month': {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return createdAt >= startOfMonth && createdAt <= now;
          }
          case 'Last month': {
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
          }
          case 'Last 3 months':
            return createdAt >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          case 'Last 6 months':
            return createdAt >= new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [data?.Orders, orderFilter, dateFilter]);

  return (
    <Screen withBackBtn={false} pH={0}>
      <View style={styles.container}>
        <View style={{ rowGap: 5 }}>
          <Text type="headline_3_semibold" text="Your orders" />
          <Text
            type="small_regular"
            color="primary40"
            text="Track and manage your orders in one place"
          />
        </View>

        <View style={styles.filterContainer}>
          <FilterComponent
            width={wp(224)}
            filters={orderStatusFilters}
            onFilterPress={handleOrderFilterPress}
            defaultFilter={orderFilter}
          />
          <FilterComponent
            width={wp(99)}
            filters={dateRangeFilters}
            onFilterPress={handleDateFilterPress}
            defaultFilter={dateFilter}
          />
        </View>

        {/**<Button title="Reset Filters" onPress={resetFilters} containerStyle={styles.resetButton} /> */}

        {/* Conditional Rendering */}
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text color="error1" text="Failed to load orders. Please try again." />
            <Button title="Retry" onPress={refresh} />
          </View>
        ) : !filteredOrders || filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <EmptyState />
            <Text
              type="small_regular"
              color="primary40"
              text={
                orderFilter === 'All orders' && dateFilter === 'All time'
                  ? 'No ongoing orders at the moment'
                  : 'No orders match the selected filters'
              }
            />
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <OrderedItem order={item} onPress={() => handleViewItems(item)} />
            )}
            contentContainerStyle={styles.listContent}
            refreshing={isLoading}
            onRefresh={refresh}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Screen>
  );
};

export default VendorOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 20,
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});