import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Screen, Text } from 'app/design-system';
import { FilterBottomSheet, StoreCardResult } from 'app/components';
import {
  SearchNormal1,
  Location,
  ArrowRight2,
} from 'iconsax-react-native';
import { CustomerHomeScreenProps, CustomerStackParamList } from 'app/navigation/types';
import { fs, hp, wp } from 'app/resources/config';
import { EasterEggPromoteSvg } from 'app/assets/svg';
import { LocationTypes } from './type';
import useAddressStore from 'app/store/use-address-store';
import { useSearchMarketByLocation } from 'app/hooks/api/use-search-by-post-code';
import { useNavigation } from '@react-navigation/native';
import { LoaderModal } from 'app/modals';
import { YellowExclusive } from 'app/assets/images';
import { Platform } from 'react-native';

// Precompute responsive values
const CONTAINER_PADDING = wp(20);
const HEADER_PADDING_V = hp(10);
const SEARCH_BOX_HEIGHT = hp(40);
const SEARCH_BOX_RADIUS = wp(12);
const BANNER_HEIGHT = hp(87);
const BANNER_WIDTH = wp(318);
const BANNER_MARGIN_V = hp(10);
const FONT_SIZE_12 = fs(12);
const LIST_ROW_GAP = 15;

// Map API response to StoreCardResult format
const mapToStore = (location: LocationTypes) => ({
  id: location.vendorId,
  name: location.vendor,
  tag: 'Food',
  distance: `${(location.distance / 1000).toFixed(2)} km`,
  deliveryTime: '30-45 mins',
  image: location.image,
  rating: 4,
});

const CustomerHomeScreen = () => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [inputAddress, setInputAddress] = useState('');

  const navigation = useNavigation<CustomerStackParamList>();
  const { address, postcode, city, latitude, longitude, isLoading: isAddressLoading } =
    useAddressStore();

  // Stabilize location data
  const locationData = useMemo(() => {
    const defaultLat = 51.5074;
    const defaultLng = -0.1278;
    return {
      lat: latitude ?? defaultLat,
      lng: longitude ?? defaultLng,
      postCode: city || postcode || 'glasgow',
    };
  }, [latitude, longitude, postcode, city]);

  // Fetch data
  const { data: apiData, isLoading: isApiLoading, error: apiError, refresh } =
    useSearchMarketByLocation(locationData);

  // Memoize current location
  const currentLocation = useMemo(() => {
    if (isAddressLoading) return 'Loading location...';
    if (!address && !postcode) return 'No location available';
    return address && postcode
      ? `${address}, ${postcode}`
      : address || postcode || 'Unknown location';
  }, [address, postcode, isAddressLoading]);

  // Update inputAddress with debouncing
  useEffect(() => {
    const timeout = setTimeout(() => {
      setInputAddress(currentLocation);
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentLocation]);

  // Memoize store data
  const storeData = useMemo(() => {
    if (!apiData?.response) return [];
    const response = Array.isArray(apiData.response)
      ? apiData.response.filter((item) => item.vendorId && item.vendor)
      : [];
    return response.map(mapToStore);
  }, [apiData?.response]);

  // Memoized handlers
  const handleViewStore = useCallback(
    (storeId: string) => {
      navigation.navigate('AVAILABLE_PRODUCTS_SCREEN', {
        storeId,
        location: currentLocation,
        data: apiData,
      });
    },
    [navigation, currentLocation, apiData]
  );

  const toggleBottomSheet = useCallback(() => {
    setBottomSheetVisible((prev) => !prev);
  }, []);

  const handleSelectFilter = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setBottomSheetVisible(false);
  }, []);

  const onPressSearch = useCallback(() => {
    navigation.navigate('CUSTOMER_HOME_SEARCH', { response: apiData?.response });
  }, [navigation, apiData?.response]);

  const handleRefresh = useCallback(() => {
    if (apiError) refresh();
  }, [apiError, refresh]);

  const isLoading = isAddressLoading || isApiLoading;

  // FlatList item layout (assuming fixed height)
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: hp(100), // Adjust based on StoreCardResult height
      offset: (hp(100) + LIST_ROW_GAP) * index,
      index,
    }),
    []
  );

  return (
    <Screen withBackBtn={false} pH={0}>
      <View style={styles.container}>
        <LoaderModal isLoading={isLoading} />
        <View style={[styles.innerContainer, { paddingHorizontal: CONTAINER_PADDING }]}>
          {/* Header */}
          <View style={[styles.header, { paddingVertical: HEADER_PADDING_V }]}>
            <Pressable
              onPress={() => navigation.navigate('SEARCH_SCREEN')}
              style={styles.locationContainer}
            >
              <Location size={20} color="#f4ab19" variant="Outline" />
              <Text type="small_medium" text={currentLocation} truncateWords={3} />
              <ArrowRight2 size={12} color="#000000" variant="Outline" />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.menuContainer}>
            <View style={[styles.searchBox, { height: SEARCH_BOX_HEIGHT, borderRadius: SEARCH_BOX_RADIUS }]}>
              <SearchNormal1 size={16} color="#D9D9D9" />
              <TouchableOpacity style={styles.input} onPress={onPressSearch}>
                <Text type="small_medium" text="Search by food item, shop name" />
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F4AB19" />
              <Text type="small_regular" text="Loading stores..." />
            </View>
          ) : apiError ? (
            <View style={styles.errorContainer}>
              <Text type="emphasized_medium" align="center" text="Oops! Something went wrong." />
              <Text type="small_regular" align="center" text="Please try again later." />
              <Button title="Retry" onPress={handleRefresh} />
            </View>
          ) : storeData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text
                type="small_regular"
                align="center"
                text="No stores available for this location"
              />
              <Button title="Retry another location" onPress={() => navigation.goBack()} />
            </View>
          ) : (
            <>
              {/* Promotional Banner */}
              <View
                style={{
                  height: BANNER_HEIGHT,
                  width: BANNER_WIDTH,
                  borderRadius: SEARCH_BOX_RADIUS,
                  alignSelf: 'center',
                  marginVertical: BANNER_MARGIN_V,
                  backgroundColor: '#F4AB19',
                }}
              >
                <Image
                  source={YellowExclusive}
                  style={{
                    height: BANNER_HEIGHT,
                    width: BANNER_WIDTH,
                    borderRadius: SEARCH_BOX_RADIUS,
                    position: 'absolute',
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    padding: wp(15),
                    justifyContent: 'space-between',
                    flex: 1,
                  }}
                >
                  <View style={{ width: '80%' }}>
                    <Text type="sub_regular" text="Eggs-citing News!  🛍️" color="white" />
                    <Text type="small_bold" text="Hop into Savings this Easter!" color="white" />
                    <Text
                      text="Win up to $50 worth of items this Easter, by shopping over 100! 🔥✨"
                      color="white"
                      type="sub_regular"
                    />
                  </View>
                  {Platform.OS !== 'ios' && <EasterEggPromoteSvg />}
                </View>
              </View>

              {/* Store List */}
              <View style={[styles.searchResultTag, { marginVertical: HEADER_PADDING_V }]}>
                <Text type="small_semibold" text="Nearby Shops" />
              </View>

              <FlatList
                data={storeData}
                keyExtractor={(item) => item.id}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={Platform.OS === 'ios' ? 10 : 21}
                removeClippedSubviews
                getItemLayout={getItemLayout}
                contentContainerStyle={{ paddingBottom: hp(20), rowGap: LIST_ROW_GAP }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <StoreCardResult store={item} onViewStore={() => handleViewStore(item.id)} />
                )}
              />
            </>
          )}
        </View>

        {/* Filter Bottom Sheet */}
        {isBottomSheetVisible && (
          <FilterBottomSheet
            selectedFilter={selectedFilter}
            onSelectFilter={handleSelectFilter}
            isVisible={isBottomSheetVisible}
            onClose={() => setBottomSheetVisible(false)}
          />
        )}
      </View>
    </Screen>
  );
};

export default React.memo(CustomerHomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp(16),
    paddingVertical: hp(10),
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  input: {
    flex: 1,
    marginLeft: wp(8),
    marginRight: wp(8),
    fontSize: FONT_SIZE_12,
  },
  searchResultTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 10,
  },
});