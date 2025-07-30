import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';

import { Button, Screen, Text, Image } from 'app/design-system';
import {
  Add,
  AddSquare,
  CloudPlus,
  MiniMusicSqaure,
  Minus,
  SearchNormal1,
} from 'iconsax-react-native';
import { CustomerProductDetailScreenProps } from 'app/navigation/types';
import {
  HeaderNavigation,
  OpeningHoursDeliveryTime,
  SkeletonLoader,
  StoreHeader,
} from 'app/components';

import { fs, hp, wp } from 'app/resources/config';
import { useGetProductsBySubCategory } from 'app/hooks/api/use-get-category';
import useUserStore from 'app/store/use-user-store';

const ProductDetailScreen = ({ route, navigation }: CustomerProductDetailScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    subcategoryId: subCatId,
    vendorId,
    category,
    title,
    store,
    categoryId: catId,
  } = route.params;

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const { products, totalCount, isLoading, isError } = useGetProductsBySubCategory(
    vendorId,
    catId,
    subCatId
  );

  // Handle quantity change for specific product
  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  // Calculate total price based on all items
  const totalPrice = products.reduce((sum, product) => {
    const itemQuantity = quantities[product.id] || 0;
    const priceAfterDiscount = product.price * (1 - (product.discount || 0) / 100);
    return sum + priceAfterDiscount * itemQuantity;
  }, 0);

  // Get selected products with quantities
  const getSelectedProducts = () => {
    return products
      .filter(product => quantities[product.id] > 0)
      .map(product => ({
        ...product,
        quantity: quantities[product.id],
        finalPrice: product.price * (1 - (product.discount || 0) / 100)
      }));
  };

  const hasItemsInCart = Object.values(quantities).some((q) => q > 0);

  const { accessToken, user } = useUserStore();

  const handleNavigationBasedOnUserRegistration = () => {
    const selectedProducts = getSelectedProducts();
    
    if (user) {
      //@ts-ignore
      navigation.navigate('CUSTOMER_AUTH_INDEX', {
        screen: 'CUSTOMER_LOGIN_SCREEN',
        params: {
          selectedProducts,
          totalPrice,
          storeName: store?.companyName
        }
      });
    } else {
      //@ts-ignore
      navigation.navigate('CUSTOMER_REGISTER_SCREEN', {
        
     
          selectedProducts,
          totalPrice,
          storeName: store?.companyName
        
      });
    }
  };

  const handleProductPress = (item: any) => {
    navigation.navigate('INDIVIDUAL_PRODUCTS_DETAILS_SCREEN', {
      item,
      //quantity: quantities[item.id] || 0,
      //finalPrice: item.price * (1 - (item.discount || 0) / 100),
      storeName: store?.companyName,
    });
  };


 

  return (
    <Screen withBackBtn={false} pH={0}>
      <View style={styles.container}>
        <View style={styles.Hpadding}>
          <HeaderNavigation />
        </View>

        <StoreHeader
          storeName={store?.companyName}
          storeAddress={store?.address}
          storeRating={store?.rating}
          storeImage={store?.coverPhoto}
          isLoading={isLoading}
        />

        <View style={styles.mainContainer}>
          <View style={styles.searchBox}>
            <SearchNormal1 size="20" color="#D9D9D9" />
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="default"
            />
          </View>

          <View>
            <OpeningHoursDeliveryTime
              openingHours="8:00am - 04:00pm"
              deliveryTimeFrame="10 - 15mins"
            />
          </View>

          <View style={styles.productsSection}>
            <Text text={`${store?.companyName}/${category}/${title}`} />

            {isLoading ? (
              <FlatList
                data={Array(4).fill({})}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={() => (
                  <View style={[styles.productCard]}>
                    <SkeletonLoader width={100} height={100} bR={10} />
                    <View style={{ rowGap: 10 }}>
                      <SkeletonLoader height={20} width={80} bR={10} />
                      <SkeletonLoader height={20} width={60} bR={10} />
                    </View>
                  </View>
                )}
              />
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.productCard}
                    onPress={() => handleProductPress(item)}>
                    <Image
                      uri={item.images[0]}
                      width={100}
                      height={100}
                      bR={8}
                      ui={{ alignSelf: 'center', maxHeight: hp(70), marginVertical: hp(5) }}
                    />
                    <Text type="small_semibold" text={item.title} style={{ marginVertical: hp(5) }}/>
                    <View style={styles.itemControls}>
                      <Text
                        type="body_semibold"
                        color="cyan1"
                        text={`£${(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}`}
                      />
                      <View style={styles.quantityControls}>
                        {quantities[item.id] > 0 && (
                          <Minus
                            size="24"
                            color="#F4AB19"
                            variant="Outline"
                            onPress={() => handleQuantityChange(item.id, -1)}
                          />
                        )}
                        {quantities[item.id] > 0 && (
                          <Text type="small_semibold" text={quantities[item.id].toString()} />
                        )}
                        <Add
                          size="24"
                          color="#F4AB19"
                          variant="Outline"
                          onPress={() => handleQuantityChange(item.id, 1)}
                        />
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            )}
          </View>

          {hasItemsInCart && (
            <View style={styles.checkoutContainer}>
              <Button
                onPress={handleNavigationBasedOnUserRegistration}
                title={`Proceed to Checkout - £${totalPrice.toFixed(2)}`}
              />
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Hpadding: {
    paddingHorizontal: 20,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15,
  },
 
  row: {
    marginTop: hp(20),
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  checkoutContainer: {
    padding: 16,
    borderTopColor: '#E5E5E5',
    backgroundColor: 'white',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 16,
    columnGap: 8,
  },
  input: {
    flex: 1,
    marginLeft: wp(8),
    marginRight: wp(8),
    fontSize: fs(12),
    height: hp(24)
  },
  itemControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productsSection: {
    flex: 1,
    marginTop: 20,
  },
  productCard: {
    flex: 1,
    margin: 8,
    paddingVertical: hp(16),
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D0D5DD'
  },
});
export default ProductDetailScreen;
