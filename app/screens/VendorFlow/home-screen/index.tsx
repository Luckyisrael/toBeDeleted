import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { Screen, Image, Text, Button, ScrollView } from 'app/design-system';
import { ChefLogo, Vector } from 'app/assets/images';
import { Refresh } from 'iconsax-react-native';
import {
  CreditCardSvg,
  CurrencySvg,
  CustomersSvg,
  EmptyState,
  StarSvg,
  TotalOrderSvg,
} from 'app/assets/svg';
import { BestSellingProducts, OrderedItem } from 'app/components';
import StatCard from 'app/components/stat-card';
import { hp, wp } from 'app/resources/config';
import { AntDesign } from '@expo/vector-icons';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import useVendorStore from 'app/store/use-vendor-store';
import { NOT_AVAILABLE } from 'app/utils/constants';
import { useNavigation } from '@react-navigation/native';
import { LoaderModal } from 'app/modals';
import { useRegisterDeviceToken } from 'app/hooks/usePushNotification';

const VendorHomeScreen = memo(() => {
    // Ensure store access is stable
    const { vendor, vendorAccessToken } = useVendorStore.getState();
  const navigation = useNavigation<any>();
  const { isRegistered } = useRegisterDeviceToken('vendor', vendorAccessToken);

  const {
    getDashboard: {
      data: vendorDashboard,
      isLoading: loadingVendorDashboard,
      error: vendorDashboardError,
      refresh: refreshVendorDashboard,
    },
    getOrders: {
      data: orderData,
      isLoading: loadingVendorOrders,
      error: vendorOrdersError,
      refresh: refreshVendor,
    },
/**    getVendorProfile: {
      data: vendorProfileData,
      error: vendorProfileError,
      isLoading: vendorProfileLoading,
      mutate: refreshVendorProfile,
    } */
  } = useVendorApi();



  const companyNameText = vendor?.companyName || NOT_AVAILABLE;
  const recentOrders = useMemo(() => orderData?.Orders?.slice(0, 2) || [], [orderData]);

  const stats = useMemo(
    () => [
      {
        title: 'Sales value',
        icon: <CurrencySvg />,
        figure: vendorDashboard?.totalSales?.toFixed(2) ?? NOT_AVAILABLE,
      },
      {
        title: 'Customers',
        icon: <CustomersSvg />,
        figure: vendorDashboard?.totalCustomers ?? NOT_AVAILABLE,
      },
      {
        title: 'Total Orders',
        icon: <TotalOrderSvg />,
        figure: vendorDashboard?.totalOrders ?? NOT_AVAILABLE,
      },
      { title: 'Store review', icon: <StarSvg />, figure: '3.7' },
    ],
    [vendorDashboard]
  );

  const isBankAdded = vendorDashboard?.isBankFormSubmitted;

  const handleRefresh = useCallback(() => {
    refreshVendor();
    refreshVendorDashboard();
  }, [refreshVendor, refreshVendorDashboard]);

  const gotoHistory = useCallback(() => {
    navigation.navigate('VENDORTABS', { screen: 'VENDOR_ORDER_SCREEN' });
  }, [navigation]);

  const gotoBusinessType = useCallback(() => {
    navigation.navigate('SELECT_BUSINESS_TYPE_SCREEN');
  }, [navigation]);

  const renderOrderItem = useCallback(
    ({ item }: { item: any }) => <OrderedItem order={item} />,
    []
  );

  return (
    <Screen withBackBtn={false}>
      <ScrollView>
        <View style={styles.container}>
          <LoaderModal isLoading={loadingVendorDashboard || loadingVendorOrders} />
          <View style={styles.header}>
            <Image uri={ChefLogo} width={35} height={35} bR={27} />
            <View style={styles.headerTextContainer}>
              <Text
                type="small_medium"
                color="primary80"
                text={`Welcome back, ${companyNameText}`}
              />
              <Text
                type="sub_regular"
                color="primary40"
                text="Here's what's happening in your store today."
              />
            </View>
          </View>

          {!isBankAdded && (
            <Pressable style={styles.notificationContainer} onPress={gotoBusinessType}>
              <ImageBackground
                source={Vector}
                resizeMode="cover"
                style={styles.imageBackground}
                imageStyle={styles.backgroundImageStyle}
              >
                <View style={styles.notificationInner}>
                  <View style={styles.notificationHeader}>
                    <Text type="sub_regular" text="Hurry!" color="white" />
                    <AntDesign name="warning" size={12} color="white" />
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.textContainer}>
                      <Text
                        type="small_bold"
                        text="Set Up Your Payout Details  💳"
                        color="white"
                      />
                      <Text
                        type="sub_regular"
                        text="Go to your profile and add your bank info in Settings to start receiving payments!"
                        color="white"
                      />
                    </View>
                    <View style={styles.iconContainer}>
                      <CreditCardSvg />
                    </View>
                  </View>

                  <Text
                    text="Profile"
                    style={styles.profileLink}
                    color="white"
                    type="small_bold"
                  />
                </View>
              </ImageBackground>
            </Pressable>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.currentContainer}>
              <Text
                type="small_semibold"
                color="primary80"
                text="Current sales analysis"
                style={styles.currentTitle}
              />
              <Pressable style={styles.refresh} onPress={handleRefresh}>
                <Refresh size={20} color="#000000" variant="Outline" />
              </Pressable>
            </View>

            {loadingVendorDashboard ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : vendorDashboardError ? (
              <View style={styles.center}>
                <Text
                  color="error1"
                  text="Failed to load dashboard data. Please try again."
                />
                <Button title="Retry" onPress={refreshVendorDashboard} />
              </View>
            ) : (
              <View>
                <View style={styles.row}>
                  <StatCard
                    title={stats[0].title}
                    icon={stats[0].icon}
                    figure={stats[0].figure}
                  />
                  <StatCard
                    title={stats[1].title}
                    icon={stats[1].icon}
                    figure={stats[1].figure}
                  />
                </View>
                <View style={styles.row}>
                  <StatCard
                    title={stats[2].title}
                    icon={stats[2].icon}
                    figure={stats[2].figure}
                  />
                  <StatCard
                    title={stats[3].title}
                    icon={stats[3].icon}
                    figure={stats[3].figure}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.recentOrderContainer}>
            <View style={styles.recentOrder}>
              <Text type="small_medium" color="primary80" text="Recent order" />
              <Text
                type="small_regular"
                color="primary80"
                text="see all order"
                style={styles.seeAllLink}
                onPress={gotoHistory}
              />
            </View>
            {loadingVendorOrders ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : vendorOrdersError ? (
              <View style={styles.center}>
                <Text color="error1" text="Failed to load orders. Please try again." />
                <Button title="Retry" onPress={refreshVendor} />
              </View>
            ) : recentOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <EmptyState />
                <Text
                  type="small_regular"
                  color="primary40"
                  text="No ongoing orders at the moment"
                />
              </View>
            ) : (
              <FlatList
                data={recentOrders}
                keyExtractor={(item) => item._id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
              />
            )}
          </View>

          <View>
            <BestSellingProducts />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
});

export default VendorHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingVertical: hp(10),
  },
  headerTextContainer: {
    flex: 1,
  },
  statsContainer: {
    rowGap: 8,
  },
  recentOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(20),
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(30),
  },
  recentOrderContainer: {
    backgroundColor: 'white',
    paddingVertical: hp(20),
    paddingHorizontal: wp(12),
    borderRadius: wp(12),
  },
  listContent: {
    paddingBottom: hp(20),
    rowGap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    columnGap: 10,
  },
  refresh: {
    width: 46,
    height: 40,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  currentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginVertical: 10,
  },
  currentTitle: {
    flex: 1,
  },
  seeAllLink: {
    textDecorationLine: 'underline',
  },
  notificationContainer: {
    backgroundColor: '#48B74E',
    borderRadius: wp(12),
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backgroundImageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: wp(12),
  },
  notificationInner: {
    //paddingVertical: hp(10),
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(3),
    paddingLeft: wp(10),
  },
  notificationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: wp(10),
    paddingVertical: hp(8),
  },
  textContainer: {
    width: '70%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLink: {
    textAlign: 'right',
    paddingRight: wp(10),
  },
});