import { FlatList, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Screen, Text, Button, Image } from 'app/design-system';
import {
  StoreHeaderNavigation,
  OpeningHoursDeliveryTime,
  SkeletonLoader,
  StoreHeader,
} from 'app/components';
import { AddCircle, MinusCirlce } from 'iconsax-react-native';
import { fs, hp, wp } from 'app/resources/config';
import { MaterialIcons } from '@expo/vector-icons';
import useUserStore from 'app/store/use-user-store';
import { useGetVendorProducts } from 'app/hooks/api/use-get-product-by-vendor-id';
import useCartStore from 'app/store/use-cart-store';
import { Cart2 } from 'app/assets/svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HapticFeedbackType, triggerHaptic } from 'app/utils/haptics';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import { useFavoritesStore } from 'app/store/favourite-store';
import useAlert from 'app/hooks/useAlert';
import { LoaderModal } from 'app/modals';
import { debounce } from 'lodash';

interface VendorDetails {
  vendorName: string;
  coverPhoto: string;
  description: string;
}

interface StoreData {
  storeName: string;
  storeAddress: string;
  storeRating: number;
  openingHour: number;
  closingHour: number;
  coverPhoto: string;
}

interface Category {
  _id: string;
  title: string;
}

interface Product {
  productId: string;
  title: string;
  price: number;
  images: string[];
  category: { _id: string };
  quantity: number;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface RouteParams {
  storeId: string;
}

interface Navigation {
  navigate: (screen: string, params?: unknown) => void;
}

const ITEM_HEIGHT = 200;
const getItemLayout = (_: Product[] | null | undefined, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});


const AvailableProductItemScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<{ params: RouteParams }>();
  const { storeId: vendorId } = route.params;

  const {
    vendorData,
    products,
    isLoadingVendorData,
    isLoadingMore,
    vendorError,
    refresh,
    loadMore,
    isReachingEnd,
  } = useGetVendorProducts(vendorId);
  const { addToCart, updateQuantity, getTotalItems, getTotalPrice, items: cartItems } =
    useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { userAddFavorite, userRemoveFavorite, isProcessingLoading } = useUserProfileApi();
  const { accessToken } = useUserStore();
  const { successAlert, errorAlert } = useAlert();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const vendorName = vendorData?.companyName || '';
  const coverPhoto = vendorData?.coverPhoto || '';
  const description = vendorData?.description || '';
  const vendorDetails: VendorDetails = { vendorName, coverPhoto, description };

  const storeInfo = vendorData || {};

  const filteredProducts = useMemo((): Product[] => {
    if (!products || !Array.isArray(products)) return [];

    let filtered = products as Product[];

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category._id === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const debouncedLoadMore = useCallback(
    debounce(() => {
      if (!isReachingEnd && !isLoadingMore) {
        loadMore();
      }
    }, 300),
    [isReachingEnd, isLoadingMore, loadMore]
  );

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory((prevId) => (prevId === categoryId ? null : categoryId));
  };

  const handleProductPress = (product: Product) => {
    if (product.quantity === 0) return;
    navigation.navigate('INDIVIDUAL_PRODUCTS_DETAILS_SCREEN', { item: product, vendorDetails });
  };

  const getUniqueCategories = (): Category[] => {
    if (!storeInfo?.availableCategories || !Array.isArray(storeInfo.availableCategories)) return [];
    return Array.from(
      new Map(
        storeInfo.availableCategories.map((item: { title: Category }) => [
          item.title._id,
          item,
        ])
      ).values()
    ).map((item: { title: Category }) => item.title);
  };

  const handleAddToCart = async (item: Product) => {
    if (item.quantity === 0) return;
    if (Platform.OS === 'ios') {
      await triggerHaptic(HapticFeedbackType.Light);
    }
    addToCart(
      {
        id: item.productId,
        title: item.title,
        price: item.price,
        image: item.images?.[0] || '',
      },
      vendorDetails
    );
  };

  const handleToggleFavorite = async (item: Product) => {
    if (!accessToken) {
      navigation.navigate('CUSTOMER_LOGIN_SCREEN');
      return;
    }
    const isFav = isFavorite(item.productId);
    try {
      if (isFav) {
        await userRemoveFavorite({
          itemId: item.productId,
          successCallback: () => {
            removeFavorite(item.productId);
          },
        });
      } else {
        await userAddFavorite({
          itemId: item.productId,
          successCallback: () => {
            addFavorite(item.productId);
          },
        });
      }
    } catch (error) {
      errorAlert('Could not update favorites, try again');
    }
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    await refresh();
    setIsRetrying(false);
  };

  const renderProductCard = useCallback(
    ({ item }: { item: Product }) => {
      const quantity = cartItems.find((i: CartItem) => i.id === item.productId)?.quantity || 0;
      const isFav = isFavorite(item.productId);
      const isOutOfStock = item.quantity === 0;

      return (
        <TouchableOpacity
          style={[styles.card, isOutOfStock && styles.outOfStockCard]}
          onPress={() => handleProductPress(item)}
          activeOpacity={isOutOfStock ? 1 : 0.7}
        >
          <View style={styles.imageContainer}>
            <Image
                uri={item.images?.[0]}
                width={94}
                height={70}
                bR={3}
                ui={{ alignSelf: 'center', opacity: isOutOfStock ? 0.5 : 1 }}
              />
            {isOutOfStock && (
              <View style={styles.outOfStockTagContainer}>
                <Text type="small_semibold" color="white" text="Out of Stock" />
              </View>
            )}
            <MaterialIcons
              name={isFav ? 'favorite' : 'favorite-border'}
              size={26}
              color={isFav ? '#f4ab19' : '#CED3D5'}
              onPress={() => handleToggleFavorite(item)}
            />
          </View>
          <Text
            type="small_semibold"
            text={item.title}
            truncateWords={3}
            style={styles.cardTitle}
          />
          <View style={styles.priceQuantityContainer}>
            <Text type="small_semibold" color="cyan1" text={`£${item.price}`} />
            <View style={styles.quantityContainer}>
              {quantity > 0 ? (
                <View style={styles.quantityControls}>
                  <MinusCirlce
                    size={24}
                    color="#CED3D5"
                    variant="Bulk"
                    onPress={() => updateQuantity(item.productId, quantity - 1)}
                  />
                  <Text type="small_semibold" text={quantity.toString()} />
                  <AddCircle
                    size={20}
                    color="#F4AB19"
                    variant="Bulk"
                    onPress={() => updateQuantity(item.productId, quantity + 1)}
                  />
                </View>
              ) : (
                <AddCircle
                  size={24}
                  color={isOutOfStock ? '#CED3D5' : '#F4AB19'}
                  variant="Bulk"
                  onPress={() => handleAddToCart(item)}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [
      cartItems,
      isFavorite,
      updateQuantity,
      handleAddToCart,
      handleToggleFavorite,
      handleProductPress,
    ]
  );

  const renderSkeletonLoader = () => (
    <View style={styles.row}>
      <SkeletonLoader width={100} height={89} bR={10} />
      <SkeletonLoader width={100} height={89} bR={10} />
    </View>
  );

  const storeData: StoreData = {
    storeName: storeInfo?.companyName || '',
    storeAddress: storeInfo?.address || '',
    storeRating: storeInfo?.rating || 0,
    openingHour: 9,
    closingHour: 21,
    coverPhoto: storeInfo?.coverPhoto || '',
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Screen withBackBtn={false}>
      <View style={styles.container}>
        <LoaderModal isLoading={isProcessingLoading} />
        <StoreHeaderNavigation
          isSearchVisible
          onSearch={handleSearch}
          onTouchCart={() =>
            navigation.navigate('CUSTOMERTABS', { screen: 'CUSTOMER_BASKET_SCREEN' })
          }
        />

        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <StoreHeader
              store={storeData}
              isLoading={isLoadingVendorData}
              onViewStore={() => console.log('View Store Pressed')}
            />
            <OpeningHoursDeliveryTime openingHours="8:00 am - 9:00 pm" deliveryTimeFrame="20 - 30mins" />
          </View>

          <View>
            <FlatList
              horizontal
              data={getUniqueCategories()}
              keyExtractor={(item) => item._id}
              renderItem={({ item }: { item: Category }) => (
                <TouchableOpacity
                  style={[
                    styles.popularTag,
                    selectedCategory === item._id && styles.selectedTag,
                  ]}
                  onPress={() => handleCategoryPress(item._id)}
                >
                  <Text
                    text={item.title}
                    color={selectedCategory === item._id ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularTagsContainer}
              ListEmptyComponent={
                !isLoadingVendorData && (
                  <View style={styles.popularTag}>
                    <Text text="No categories" />
                  </View>
                )
              }
            />
          </View>

          <View style={styles.productsContainer}>
            {isLoadingVendorData && !products.length ? (
              renderSkeletonLoader()
            ) : vendorError ? (
              <View style={styles.errorContainer}>
                <Text type="body_semibold" text="Failed to load products" />
                <TouchableOpacity
                  style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}
                  onPress={handleRetry}
                  disabled={isRetrying}
                >
                  <Text
                    type="small_semibold"
                    color="white"
                    text={isRetrying ? 'Retrying...' : 'Retry'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.productId}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                contentContainerStyle={styles.resultsContentContainer}
                renderItem={renderProductCard}
                columnWrapperStyle={styles.columnWrapper}
                onEndReached={debouncedLoadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                getItemLayout={getItemLayout}
                ListFooterComponent={
                  isLoadingMore && (
                    <View style={styles.loadingMore}>
                      <Text text="Loading more" />
                    </View>
                  )
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text type="body_semibold" text="No products available" />
                    <Text
                      type="small_regular"
                      text={
                        searchQuery
                          ? 'No products match your search'
                          : 'Try selecting a different category or check back later'
                      }
                    />
                  </View>
                }
              />
            )}
          </View>
        </View>

        {totalItems > 0 && (
          <View style={styles.footerContainer}>
            <Button
              title="View Basket"
              onPress={() =>
                navigation.navigate('CUSTOMERTABS', { screen: 'CUSTOMER_BASKET_SCREEN' })
              }
              leftIcon={
                <View>
                  <Cart2 />
                  {totalItems > 0 && (
                    <View style={styles.badge}>
                      <Text
                        type="sub_bold"
                        text={totalItems > 99 ? '99+' : totalItems.toString()}
                        color="white"
                        style={styles.badgeText}
                      />
                    </View>
                  )}
                </View>
              }
              rightIcon={
                <Text text={`£${totalPrice.toFixed(2)}`} color="white" type="small_semibold" />
              }
            />
          </View>
        )}
      </View>
    </Screen>
  );
};

export default React.memo(AvailableProductItemScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    rowGap: 20,
  },
  productsContainer: {
    marginTop: hp(5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: wp(8),
    width: '45%',
    marginBottom: 12,
  },
  outOfStockCard: {
    opacity: 0.7,
  },
  popularTag: {
    padding: wp(10),
    backgroundColor: '#F3F3F3',
    borderRadius: wp(50),
    marginRight: wp(8),
  },
  selectedTag: {
    backgroundColor: '#051217',
  },
  popularTagsContainer: {
    flexDirection: 'row',
    gap: wp(8),
    marginVertical: hp(10),
    paddingHorizontal: wp(5),
  },
  resultsContentContainer: {
    paddingBottom: hp(40),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 10,
  },
  quantityContainer: {
    gap: 8,
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    paddingHorizontal: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: hp(10),
    paddingHorizontal: hp(10),
    borderRadius: wp(8),
  },
  productImage: {
    width: 94,
    height: 70,
    borderRadius: 3,
  },
  priceQuantityContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  cardTitle: {
    marginLeft: 15,
    marginVertical: 10,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  retryButton: {
    backgroundColor: '#2E86C1',
    paddingHorizontal: wp(15),
    paddingVertical: hp(8),
    borderRadius: wp(5),
    marginTop: hp(10),
  },
  retryButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F4AB19',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
  },
  outOfStockTagContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  loadingMore: {
    padding: 10,
    alignItems: 'center',
  },
  footerContainer: {
    paddingVertical: 10,
    paddingHorizontal: wp(5),
  },
});