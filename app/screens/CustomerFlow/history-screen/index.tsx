import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Button, Screen, ScrollView, Text } from 'app/design-system';
import { EmptyState } from 'app/assets/svg';
import { hp, wp } from 'app/resources/config';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { OngoingOrders, CompletedOrderComponents } from 'app/components';
import useUserStore from 'app/store/use-user-store';
import { useViewUserHistory } from 'app/hooks/api/view-user-history';

// Type Definitions
type CustomerNavigationProp = {
  navigate: (screen: string, params?: any) => void;
  replace: (screen: string, params?: any) => void;
};

interface CustomerHistoryScreenProps {
  navigation: CustomerNavigationProp;
}

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

interface UserHistoryData {
  Orders: Order[];
}

const TABS = {
  ONGOING_TAB: 'Ongoing',
  COMPLETED_TAB: 'Completed',
} as const;

const CustomerHistoryScreen = ({ navigation }: CustomerHistoryScreenProps) => {
  const [activeTab, setActiveTab] = useState<string>(TABS.ONGOING_TAB);
  const { accessToken } = useUserStore();
  const { data, isLoading, error, refresh } = useViewUserHistory();

  const ongoingOrders = useMemo(
    () => data?.Orders?.filter((order) => order.OrderStatus === 'Pending') || [],
    [data]
  );
  const completedOrders = useMemo(
    () => data?.Orders?.filter((order) => order.OrderStatus === 'Completed') || [],
    [data]
  );

  const navigateToHomeScreen = useCallback(() => {
    navigation.navigate('CUSTOMER_HOME_SCREEN');
  }, [navigation]);

  const renderOngoingOrders = useCallback(
    () => (
      <ScrollView>
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.tabContent}
          sharedTransitionTag="tabContent"
        >
          {ongoingOrders.length > 0 ? (
            <View>
              <View style={{ rowGap: 8, paddingTop: hp(10), paddingBottom: hp(20) }}>
                <Text
                  text="Your order is on the way!"
                  type="emphasized_medium"
                  color="primary80"
                />
                <Text
                  text="Hang tight! Your fresh items are on their way to you"
                  type="small_regular"
                  color="primary40"
                />
              </View>
              <View style={{ rowGap: 10 }}>
                {ongoingOrders.map((order, index) => (
                  <OngoingOrders
                    key={order.id || index}
                    shopName={order.vendor.companyName || order.vendor.name || 'Unknown'}
                    confirmationCode={order.orderId}
                    numberOfOrderedItems={order.items.length}
                    deliveryTime={order.date}
                    onViewReceipt={() => {
                      navigation.navigate('ORDER_DETAIL_SCREEN', {
                        orderId: order.orderId,
                        mongoId: order.id,
                      });
                    }}
                    /**
                      
                      onTrackOrder={() => {
                      navigation.navigate('USER_ORDER_TRACKING_SCREEN', {
                        orderId: order.orderId,
                        mongoId: order.id,
                      });
                    }}*/
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <EmptyState />
              <Text
                type="small_regular"
                color="primary40"
                text="No ongoing orders at the moment"
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    ),
    [ongoingOrders, navigation]
  );


  const renderCompletedOrders = useCallback(
    () => (
      <ScrollView>
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.tabContent}
          sharedTransitionTag="tabContent"
        >
          {completedOrders.length > 0 ? (
            <View>
              {completedOrders.map((order, index) => (
                <CompletedOrderComponents
                  key={order.id || index}
                  image={undefined}
                  storeName={order.vendor.name || order.vendor.companyName || 'Unknown'}
                  orderId={order.orderId}
                  dateTime={
                    order.date
                      ? new Date(order.date).toLocaleString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })
                      : 'Unknown Date'
                  }
                  onPress={() => {
                    navigation.navigate('USER_ORDER_TRACKING_SCREEN', {
                      orderId: order.orderId,
                    });
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.gotoCenter}>
                <EmptyState />
                <Text type="small_regular" color="primary40" text="No completed orders yet" />
              </View>
              <Button title="Order now" onPress={navigateToHomeScreen} />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    ),
    [completedOrders, navigateToHomeScreen, navigation]
  );

  // Render error state
  const renderErrorState = useCallback(() => {
    if (!accessToken) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.gotoCenter}>
            <Text type="emphasized_medium" color="primary80" text="You're not logged in." />
            <Text
              type="small_regular"
              color="primary40"
              text="Place an order to see your history."
            />
          </View>
          <Button title="Place an order" onPress={() => navigation.replace('Login')} />
        </View>
      );
    }

    return (
      <View style={styles.errorContainer}>
        <View style={styles.gotoCenter}>
          <Text type="emphasized_medium" color="primary80" text="Oops! Something went wrong." />
          <Text type="small_regular" color="primary40" text="Please try again later." />
        </View>
        <Button title="Retry" onPress={()=>refresh} />
      </View>
    );
  }, [accessToken, navigation, refresh]);

  return (
    <Screen bgColor="white">
      <View style={styles.container}>
        <View style={styles.tabNavigation}>
          {Object.values(TABS).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text
                type="small_medium"
                color={activeTab === tab ? 'black' : 'primary30'}
                text={tab}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.content}>
          {accessToken && isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F4AB19" />
              <Text type="small_regular" color="primary40" text="Loading your orders..." />
            </View>
          ) : error || !accessToken ? (
            renderErrorState()
          ) : (
            <>
              {activeTab === TABS.ONGOING_TAB && renderOngoingOrders()}
              {activeTab === TABS.COMPLETED_TAB && renderCompletedOrders()}
            </>
          )}
        </View>
      </View>
    </Screen>
  );
};

export default React.memo(CustomerHistoryScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F0F0F0',
    padding: 5,
    borderRadius: wp(12),
  },
  tabContent: {
    flex: 1,
    rowGap: 20,
  },
  content: {
    flex: 1,
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
  emptyState: {
    marginTop: hp(100),
    justifyContent: 'center',
    marginBottom: 30,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 10,
  },
  gotoCenter: {
    alignItems: 'center',
  },
});