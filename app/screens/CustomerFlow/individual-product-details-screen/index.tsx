import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Add, Minus, Star1 } from 'iconsax-react-native';
import { Screen, Text, Image, ScrollView } from 'app/design-system';
import { CustomerIndividaulProductDetailScreenProps } from 'app/navigation/types';
import { hp, wp } from 'app/resources/config';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import useUserStore from 'app/store/use-user-store';
import { BasketBottomsheet, StoreHeaderNavigation } from 'app/components';
import useCartStore from 'app/store/use-cart-store';
import { StoreBasket } from 'app/components/baskets-bottomsheet/types';
import { useShoppingProcess } from 'app/hooks/api/use-add-to-cart';
import useAlert from 'app/hooks/useAlert';
import useAddressStore from 'app/store/use-address-store';
import { HapticFeedbackType, triggerHaptic } from 'app/utils/haptics';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import { LoaderModal } from 'app/modals';
import { useFavoritesStore } from 'app/store/favourite-store';

type Product = {
  productId: string;
  title: string;
  price: number;
  images: string[];
  category: { _id: string };
};


const IndividualProductDetailScreen = ({
  route,
  navigation,
}: CustomerIndividaulProductDetailScreenProps) => {
  const { item, vendorDetails } = route.params as { item: any; vendorDetails: any };
  const [rating, setRating] = useState(0);
  const [isBasketBottomsheet, setIsBasketBottomsheet] = useState(false);
  const [cartResponse, setCartResponse] = useState<any>(null);
  const [isFav, setIsFav] = useState(false);

  const { successAlert, errorAlert, attentionAlert } = useAlert();
  const { userAddFavorite, userRemoveFavorite, isProcessingLoading } = useUserProfileApi();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { user, accessToken, setAccessToken, setUser } = useUserStore();
  const { addProductToCart, isLoading } = useShoppingProcess();



  // Sync with store on mount
  useEffect(() => {
    setIsFav(useFavoritesStore.getState().isFavorite(item.productId));
  }, [item.productId]);

  const toggleFavorite = async (item: Product) => {
    if (!accessToken) {
      navigation.navigate('CUSTOMER_LOGIN_SCREEN');
      return;
    }
  
    const currentIsFav = isFavorite(item.productId);
    try {
      if (currentIsFav) {
        await userRemoveFavorite({
          itemId: item.productId,
          successCallback: () => {
            removeFavorite(item.productId);
            setIsFav(false); // Update local state
          },
        });
      } else {
        await userAddFavorite({
          itemId: item.productId,
          successCallback: () => {
            addFavorite(item.productId);
            setIsFav(true); // Update local state
          },
        });
      }
    } catch (error) {
      errorAlert('Could not update favorites, try again');
    }
  };

  const { items, addToCart, updateQuantity, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const cartItem = items.find((cartItem) => cartItem.id === item.productId);
  const quantity = cartItem?.quantity || 0;


  if (!item.productId) {
    console.warn('Product is missing required productId property');
  }

  const handleRating = (selectedRating: number) => {
    setRating(selectedRating);

  };

  const RatingStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => handleRating(star)}>
            <Star1
              size={12}
              color={star <= rating ? '#F4AB19' : '#D9D9D9'}
              variant={star <= rating ? 'Bold' : 'Linear'}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  // cart store
  const handleAddToCart = () => {
    if (quantity === 0) {
      try {
        console.log('Before addToCart:', items); // Debug current state
        addToCart(
          {
            id: item.productId,
            title: item.title,
            price: item.price || 0,
            image: Array.isArray(item.images) ? item.images[0] : item.image || '',
          },
          vendorDetails
        );
        console.log('After addToCart:', useCartStore.getState().items);
        attentionAlert(`${item.title} has been added to your cart`);
      } catch (error) {
        console.error('Error adding to cart:', error);
        errorAlert('Could not add item to cart, try again');
      }
    }
  };

  const handleIncrementQuantity = () => {
    updateQuantity(item.productId, quantity + 1);
    attentionAlert(`${item.title} quantity increased to ${quantity + 1}`);
  };

  const handleDecrementQuantity = () => {
    if (quantity > 0) {
      updateQuantity(item.productId, quantity - 1);
      attentionAlert(
        quantity === 1
          ? `${item.title} has been removed from your cart`
          : `${item.title} quantity decreased to ${quantity - 1}`
      );
    }
  };

  const syncCartWithServer = async (overrideToken?: string) => {
    const tokenToUse = overrideToken || accessToken;
    if (!tokenToUse) {
      navigation.navigate('CUSTOMER_LOGIN_SCREEN');
      return;
    }

    try {
      for (const cartItem of items) {
        const addToCartResponse = await addProductToCart({
          productId: cartItem.id,
          quantity: cartItem.quantity,
          accessToken: tokenToUse,
          successCallback: () => {
            console.log(`Added ${cartItem.title} to server cart`);
            successAlert(`Added ${cartItem.title} to server cart`);
          },
        });
        if (addToCartResponse) {
          setCartResponse(addToCartResponse.response);
          console.log('adding to cart  response', addToCartResponse.response);
        }
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      errorAlert('Could not update cart on server');
    }
  };

  const handleNavigateToCheckout = () => {
    if (totalItems === 0) {
      console.warn('No items in cart to proceed to order');
      errorAlert('No items in cart to proceed to order');
      return;
    }
    if (!user || !accessToken) {
      //@ts-ignore
      navigation.navigate('CUSTOMER_REGISTER_SCREEN', {
        onAuthSuccess: async (newAccessToken: string) => {
        
          await syncCartWithServer(newAccessToken);
          setIsBasketBottomsheet(true);
        },
      });
    } else {
      syncCartWithServer().then(() => setIsBasketBottomsheet(true));
    }
  };

  const handleProceedToOrder = () => {
    console.log('the cart response: ', vendorDetails);
    navigation.navigate('CUSTOMER_ORDER_SUMMARY', {
      cartItems: items,
      vendorDetails,
      cartData: cartResponse,
    });
    setIsBasketBottomsheet(false);
  };

  // Display images safely
  const mainImage = item.images || item.image || '';
  const thumbnailImages = Array.isArray(item.images)
    ? item.images
    : [item.image, item.image, item.image, item.image].filter(Boolean);

  const toggleModal = async () => {
    await triggerHaptic(HapticFeedbackType.Light);
    setIsBasketBottomsheet(!isBasketBottomsheet);
  };

  return (
    <Screen withBackBtn={false} pH={0}>
      <>
        <LoaderModal isLoading={isProcessingLoading || isLoading} />
        <View style={styles.container}>
          <StoreHeaderNavigation
            onSearch={() => {}}
            onTouchCart={() =>
              navigation.navigate('CUSTOMERTABS', { screen: 'CUSTOMER_BASKET_SCREEN' })
            }
          />
          <ScrollView>
            <View>
              <View style={styles.imageContainer}>
                <View style={styles.mainImageContainer}>
                  <Image
                    uri={mainImage}
                    width={wp(200)}
                    height={hp(180)}
                    bR={wp(8)}
                    ui={{ alignSelf: 'center' }}
                    fill
                  />
                </View>
                <View style={styles.wishlistContainer}>
                  <MaterialIcons
                    name={isFav ? 'favorite' : 'favorite-border'}
                    size={26}
                    color={isFav ? '#f4ab19' : '#CED3D5'}
                    onPress={() => toggleFavorite(item)}
                  />
                </View>
              </View>

              <View style={styles.thumbnailContainer}>
                {thumbnailImages.slice(0, 4).map((image: any, index: any) => (
                  <Image key={index} uri={image} width={wp(79)} height={hp(60)} bR={8} />
                ))}
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.headerContainer}>
                <View style={{ flex: 1 }}>
                  <Text type="emphasized_semibold" text={item?.title} />
                </View>

                <Text
                  text={'In Stock'}
                  type="sub_bold"
                  color="success4"
                  style={styles.stockLabel}
                />
              </View>

              <View style={styles.ratingContainer}>
                <RatingStars />
                <Text type="sub_regular" color="primary40" text={`(${'4.5'})`} />
              </View>

              <View style={styles.descriptionContainer}>
                <Text type="emphasized_bold" text={`£${item.price}`} />
                <Text type="body_regular" text={item.description} />
                <View style={styles.divider} />

                <View style={styles.weightsContainer}>
                  <Text type="small_regular" text={'Weight'} color="primary40" />
                  <View style={styles.weightOptions}>
                    {[item.weight].map((weight) => (
                      <View key={weight} style={styles.weightOption}>
                        <Text type="display_1_medium" text={weight} />
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.bottomActions}>
            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.clearButton]}
                onPress={quantity === 0 ? handleAddToCart : undefined}>
                {quantity > 0 ? (
                  <View style={styles.quantityControls}>
                    <Pressable onPress={handleDecrementQuantity}>
                      <Minus size={22} color="#F4AB19" variant="Outline" />
                    </Pressable>
                    <Text type="body_regular" text={quantity.toString()} />
                    <Pressable onPress={handleIncrementQuantity}>
                      <Add size={22} color="#F4AB19" variant="Outline" />
                    </Pressable>
                  </View>
                ) : (
                  <Text type="body_regular" text="Add to Cart" />
                )}
              </Pressable>

              <Pressable
                style={[styles.button, styles.applyButton]}
                onPress={handleNavigateToCheckout}>
                <Text type="body_regular" text="Check Out" color="white" />
              </Pressable>
            </View>
          </View>
        </View>

        {isBasketBottomsheet && (
          <BasketBottomsheet
            store={items.map((cartItem) => ({
              id: cartItem.id,
              label: cartItem.title,
              description: `Qty: ${cartItem.quantity} - $${(cartItem.price * cartItem.quantity).toFixed(2)}`,
              image: cartItem.image,
              isSelected: false,
            }))}
            onToggle={() => {}}
            visible={isBasketBottomsheet}
            closeBottomsheet={toggleModal}
            onBasketPress={handleProceedToOrder}
            isButtonDisable={items.length === 0}
          />
        )}
      </>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FAFAFA',
    alignItems: 'flex-start',
    columnGap: 15,
    borderRadius: wp(8),
  },
  mainImageContainer: {
    flex: 1,
    maxWidth: wp(295),
    maxHeight: hp(180),
  },
  wishlistContainer: {
    paddingTop: 20,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    columnGap: 10,
    paddingVertical: 10,
  },
  detailsContainer: {
    rowGap: 20,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockLabel: {
    backgroundColor: '#E7F6EC',
    paddingVertical: hp(4),
    paddingHorizontal: wp(9),
    borderRadius: wp(50),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  descriptionContainer: {
    rowGap: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#CED3D5',
    marginVertical: 10,
  },
  weightsContainer: {
    flexWrap: 'wrap',
    rowGap: 10,
  },
  weightOptions: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 5,
    padding: 12
  },
  weightOption: {
    backgroundColor: '#F3F3F3',
    borderRadius: wp(8),
    padding: 10,
  },
  bottomActions: {
    paddingVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
    borderRadius: wp(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#051217',
  },
  applyButton: {
    backgroundColor: '#06181E',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default IndividualProductDetailScreen;
