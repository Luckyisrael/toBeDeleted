import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Button, Screen, Text, Image } from 'app/design-system';
import { hp, wp } from 'app/resources/config';
import { CustomerBasketScreenProps } from 'app/navigation/types';
import useCartStore from 'app/store/use-cart-store';
import { AddCircle, MinusCirlce } from 'iconsax-react-native';
import useAlert from 'app/hooks/useAlert';
import useUserStore from 'app/store/use-user-store';
import { useShoppingProcess } from 'app/hooks/api/use-add-to-cart';
import { BasketBottomsheet } from 'app/components';
import { EmptyState } from 'app/assets/svg';
import { HapticFeedbackType, triggerHaptic } from 'app/utils/haptics';
import { LogoutModal } from 'app/modals';

const CustomerBasketScreen = ({ navigation, route }: CustomerBasketScreenProps) => {

  const [cartResponse, setCartResponse] = useState<any>(null);
  const [isBasketBottomsheet, setIsBasketBottomsheet] = useState(false);
    const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  const { clearCart} = useCartStore()
  const { user, accessToken, setAccessToken, setUser } = useUserStore();
  const { addProductToCart, isLoading } = useShoppingProcess();
  const { errorAlert, successAlert } = useAlert();
  const {
    items,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    vendorDetails: cartVendorDetails,
  } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const syncCartWithServer = async (overrideToken?: string) => {
    const tokenToUse = overrideToken || accessToken;
    if (!tokenToUse) {
      console.warn('No access token available for syncing cart');
      errorAlert('Please log in to sync your cart');
      return;
    }

    if (items.length === 0) {
      console.warn('No items in cart to sync');
      errorAlert('Your cart is empty');
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
          console.log('Adding to cart response:', addToCartResponse.response);
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
      navigation.navigate('CUSTOMER_REGISTER_SCREEN', 
        {
          onRegistrationSuccess: async (newAccessToken: string) => {
            await syncCartWithServer(newAccessToken);
            setIsBasketBottomsheet(true);
          },
        },
      );
    } else {
      syncCartWithServer().then(() => setIsBasketBottomsheet(true));
    }
  };

  const handleProceedToOrder = () => {
    console.log('the cart response: ', cartVendorDetails);
    if (totalItems === 0) {
      errorAlert('No items in cart to proceed');
      return;
    }

    const vendorDetails = cartVendorDetails || {
      vendorName: 'Unknown Store',
      coverPhoto: '',
      description: 'No store details available',
    };
    //@ts-ignore
    navigation.navigate('CUSTOMER_ORDER_SUMMARY', {
      cartItems: items,
      vendorDetails: vendorDetails,
      cartData: cartResponse || {},
    });
    setIsBasketBottomsheet(false);
  };

  const handleClearCart = async () => {
    await triggerHaptic(HapticFeedbackType.Medium); 
    clearCart();
    setLogoutBottomSheet(false);
    successAlert('Cart cleared successfully');
  };

  const toggleModal = async () => {
    await triggerHaptic(HapticFeedbackType.Light);
    setIsBasketBottomsheet(!isBasketBottomsheet);
  };

  const handleCancelCart = () => {
    setLogoutBottomSheet(false);
  };


  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image uri={item.image} width={31} height={31} bR={15.5} ui={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text type="body_medium" text={item.title} truncateWords={3} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={styles.quantityControls}>
            <MinusCirlce
              size="20"
              color="#CED3D5"
              variant="Bulk"
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            />
            <Text type="small_semibold" text={item.quantity.toString()} />
            <AddCircle
              size="20"
              color="#F4AB19"
              variant="Bulk"
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            />
          </View>
          <Text type="small_regular" color="primary40" text={`£${item.price}`} />
        </View>
      </View>
    </View>
  );

  return (
    <Screen withBackBtn={false} pH={0} bgColor='#FFF9ED'>
      <>
        <View style={styles.container}>
          <Text type="headline_3_semibold" color="primary80" text="Your baskets" />
          <Text
            type="small_regular"
            color="primary40"
            text="Each basket is from a different shop. Checkout one at a time; choose where to start"
          />

          <View style={styles.contentContainer}>
            {totalItems > 0 ? (
              <>
                <View style={styles.iconContainer}>
                  
                </View>

                <FlatList
                  data={items}
                  renderItem={renderCartItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />

           
                 
                <View style={styles.buttonContainer}>
                  <Pressable onPress={()=>{setLogoutBottomSheet(true)}} style={styles.clearButton}>
                    <Text  text='Clear Cart' type={'body_bold'}/>
                  </Pressable>
                  <Pressable onPress={handleNavigateToCheckout} style={styles.checkoutButton}>
                    <Text color='white' type={'body_bold'} text={`Checkout: £${totalPrice.toFixed(2)}`} />
                  </Pressable>
                  
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <EmptyState />
                <Text type="body_regular" text="Your cart is empty" color="black" />
                <Text type="small_regular" text="Add some items to get started" color="black" />
              </View>
            )}
          </View>
        </View>

        {isBasketBottomsheet && (
          <BasketBottomsheet
            store={items.map((cartItem) => ({
              id: cartItem.id,
              label: cartItem.title,
              description: `Qty: ${cartItem.quantity} - £${(cartItem.price * cartItem.quantity).toFixed(2)}`,
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

        {/** Bottom sheet for logout confirmation */}
        <LogoutModal
          isVisible={logoutBottomSheet}
          onCancel={handleCancelCart}
          onConfirm={handleClearCart}
          buttonText='Clear'
          header='Clear your cart'
          description='Clearing your cart will clear all the items you have listed here, Are you sure you want to continue?'
        />
      </>
    </Screen>
  );
};

export default CustomerBasketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp(15),
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    rowGap: 15,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: wp(12),
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 10, 
  },
  clearButton: {
    width: '50%',
    paddingVertical: hp(12), 
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(24),
  },
  checkoutButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#324950',
    borderRadius: wp(24),
  },
  emptyContainer: {
    rowGap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(100),
  },
});
