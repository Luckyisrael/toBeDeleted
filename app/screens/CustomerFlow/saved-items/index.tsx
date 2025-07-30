import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Button, Screen, ScrollView, Text , Image} from 'app/design-system';
import { EmptyState } from 'app/assets/svg';
import { hp, wp } from 'app/resources/config';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useViewUserHistory } from 'app/hooks/api/view-user-history';
import { OngoingOrders, OrderHistoryItem } from 'app/components';
import useUserStore from 'app/store/use-user-store';
import useCartStore from 'app/store/use-cart-store';
import { HapticFeedbackType, triggerHaptic } from 'app/utils/haptics';
import { AntDesign } from '@expo/vector-icons';
import { AddCircle, Heart, MinusCirlce } from 'iconsax-react-native';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import { LoaderModal } from 'app/modals';

const TABS = {
  FOODITEMS_TAB: 'Food items',
  SHOPS_TAB: 'Shops',
} as const;

const SavedItemsScreen = () => {
    const [activeTab, setActiveTab] = useState<string>(TABS.FOODITEMS_TAB);
    const { favorites: { data, isLoading, error, refresh }} = useUserProfileApi();
    const { accessToken } = useUserStore();
    const { addToCart, updateQuantity } = useCartStore();
  
    // Extract favorite items from the response
    const favoriteItems = data?.Favourites || [];

    console.log('the faverite items', favoriteItems);
    
    const navigateToHomeScreen = () => {
      //@ts-ignore
      navigation.navigate('CUSTOMER_HOME_SCREEN');
    };
  
    const handleProductPress = (product) => {
      //@ts-ignore
      navigation.navigate('INDIVIDUAL_PRODUCTS_DETAILS_SCREEN', {
        item: product,
      });
    };
  
    const handleAddToCart = async (item) => {
      await triggerHaptic(HapticFeedbackType.Light);
      addToCart({
        id: item.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
      });
    };
  
  
    const renderProductCard = ({ item }) => {
        const cartItem = useCartStore.getState().items.find((i) => i.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
    
        return (
          <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item.product)}>
            <View style={{ flex: 1, rowGap: 15 }}>
              <View style={styles.imageContainer}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Image
                    uri={item.product.image[0]} // Using first image from array
                    width={94}
                    height={70}
                    bR={3}
                    ui={{ alignSelf: 'center' }}
                  />
                </View>
                <Heart size={24} color="#f4ab19" variant="Bold" />
              </View>
              <Text
                type="small_semibold"
                text={item.product.title}
                truncateWords={3}
                style={{ marginLeft: 15 }}
              />
            </View>
            <View style={styles.priceQuantityContainer}>
              <Text type="small_semibold" color="cyan1" text={`£${item.product.price}`} />
              <View style={styles.quantityContainer}>
                {quantity > 0 ? (
                  <View style={styles.quantityControls}>
                    <MinusCirlce
                      size="24"
                      color="#CED3D5"
                      variant="Bulk"
                      onPress={() => updateQuantity(item.id, quantity - 1)}
                    />
                    <Text type="small_semibold" text={quantity.toString()} />
                    <AddCircle
                      size="20"
                      color="#F4AB19"
                      variant="Bulk"
                      onPress={() => updateQuantity(item.id, quantity + 1)}
                    />
                  </View>
                ) : (
                  <AddCircle
                    size="24"
                    color="#F4AB19"
                    variant="Bulk"
                    onPress={() => handleAddToCart(item)}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      };
    
      const renderFoodItems = () => {
        if (favoriteItems.length === 0) {
          return (
            <View style={styles.emptyState}>
              <EmptyState />
              <Text type="small_regular" color="primary40" text="No favorite items yet" />
              <Button title="Browse Items" onPress={navigateToHomeScreen} />
            </View>
          );
        }
    
        return (
          <FlatList
            data={favoriteItems}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        );
      };

      const renderShops = () => {
        // Since we're showing only food items in both tabs, we'll use the same renderer
        return renderFoodItems();
      };
    
  const renderErrorState = () => {
    if (!accessToken) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.gotoCenter}>
            <Text
              type="emphasized_medium"
              color="primary80"
              text="You're not logged in."
            />
            <Text 
              type="small_regular" 
              color="primary40" 
              text="Favorite an item to see your saved items." 
            />
          </View>
    
        </View>
      );
    }
  
    // Original error state
    return (
      <View style={styles.errorContainer}>
        <View style={styles.gotoCenter}>
          <Text
            type="emphasized_medium"
            color="primary80"
            text="Oops! Something went wrong."
          />
          <Text type="small_regular" color="primary40" text="Please try again later." />
        </View>
        <Button title="Retry" onPress={refresh} />
      </View>
    );
  };
  


  return (
    <Screen bgColor='white'>
      <View style={styles.container}>
        <LoaderModal isLoading={isLoading} />
        {/* Tabs are always visible */}
        <View style={styles.tabNavigation}>
          {Object.values(TABS).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text
                type="small_medium"
                color={activeTab === tab ? 'black' : 'primary30'}
                text={tab}
              />
            </Pressable>
          ))}
        </View>

        {/* Content area */}
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F4AB19" />
              <Text type="small_regular" color="primary40" text="Loading your favorites..." />
            </View>
          ) : error ? (
            renderErrorState()
          ) : (
            <>
              {activeTab === TABS.FOODITEMS_TAB && renderFoodItems()}
              {activeTab === TABS.SHOPS_TAB && renderShops()}
            </>
          )}
        </View>
      </View>
    </Screen>
  );
};

export default SavedItemsScreen;

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
    alignItems: 'center'
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
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: wp(8),
    width: '45%',
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    width: '100%',
    justifyContent: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: hp(10),
    borderRadius: wp(8),
    columnGap: wp(10),
  },
  quantityContainer: {
    gap: 8,
    alignItems: 'flex-end',
    elevation: 1,
    shadowColor: '#000',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    borderRadius: 8,
    borderColor: '#D7D7D7',
  },
  priceQuantityContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  listContainer: {
    justifyContent: 'space-between',
    gap: 10
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  shopCard: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
   
  },

});
