import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'app/design-system';
import { hp, wp } from 'app/resources/config';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';

// Define types for our data based on API response
type Product = {
  _id: string;
  totalQuantity: number;
  totalSales: number;
  productInfo: {
    _id: string;
    title: string;
    price: number;
    image: string;
  };
};

type FilterOption = 'week' | 'month' | 'year';

const BestSellingProducts = () => {
  const [filter, setFilter] = useState<FilterOption>('week');

  const {
    getBestSelling: {
      data: bestSellingData,
      error: bestSellingError,
      isLoading: loadingBestSelling,
      mutate: refreshBestSelling,
    },
  } = useVendorApi();

  // Use the API data directly
  const filteredProducts = bestSellingData?.bestSellingData || [];

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.productItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
          <View style={styles.sellingProductIcon}>
            <Image
              source={{ uri: item.productInfo.image }}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
          <Text
            text={item.productInfo.title}
            type="body_medium"
            color="primary80"
            truncateWords={2}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text text={`${item.totalQuantity}`} type="emphasized_medium" />
          <Text text=" purchases" type="small_regular" />
        </View>
      </View>
    ),
    []
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="cart-outline" size={48} color="#C4C4C4" />
        <Text 
          text="No best selling products yet" 
          type="body_medium" 
          color="primary40" 
          style={styles.emptyStateText}
        />
      </View>
    ),
    []
  );

  const renderErrorState = useCallback(
    () => (
      <View style={styles.errorStateContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text 
          text="Failed to load best selling products" 
          type="body_medium" 
          color="primary60" 
          style={styles.errorStateText}
        />
        <Pressable 
          style={styles.refreshButton} 
          onPress={() => refreshBestSelling()}
        >
          <Text text="Try Again" type="small_semibold" color="white" />
        </Pressable>
      </View>
    ),
    [refreshBestSelling]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text type="sub_semibold" text="Best selling product (by unit)" />
        <Pressable style={styles.filterBtn}>
          <Ionicons name="filter-outline" size={20} color="black" />
          <Text type="small_regular" text="Weekly" color="primary80" />
        </Pressable>
      </View>

      {loadingBestSelling ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : bestSellingError ? (
        renderErrorState()
      ) : filteredProducts.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: wp(12),
    paddingVertical: hp(11),
    paddingHorizontal: wp(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 8,
  },
  productItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  sellingProductIcon: {
    width: 47,
    height: 47,
    borderRadius: 40,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtn: {
    flexDirection: 'row',
    width: wp(105),
    height: 40,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 11,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 20,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 20,
  },
  errorStateText: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default BestSellingProducts;