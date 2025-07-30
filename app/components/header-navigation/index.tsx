import React, { useState } from 'react';
import { Pressable, StyleSheet, View, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CartTabIcon, LeftArrow } from 'app/assets/svg';
import { SearchNormal1 } from 'iconsax-react-native';
import { fs, wp } from 'app/resources/config';
import { useNavigation } from '@react-navigation/native';
import { Touchable, Text } from 'app/design-system';
import useCartStore from 'app/store/use-cart-store';

type StoreHeaderNavigationProps = {
  onSearch?: (query: string) => void;
  onTouchCart?: () => void;
  isSearchVisible?: boolean;
};

const StoreHeaderNavigation: React.FC<StoreHeaderNavigationProps> = ({
  onSearch,
  onTouchCart,
  isSearchVisible = false,
}) => {
  const { canGoBack, goBack } = useNavigation();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

 
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchInputOffset = useSharedValue(-wp(60)); // Start off-screen to the left

  const animatedSearchInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchInputOffset.value }],
    opacity: isSearchInputVisible ? 1 : 0, // invisible when not active
  }));

  const toggleSearchInput = () => {
    setIsSearchInputVisible((prev) => {
      searchInputOffset.value = withTiming(prev ? -wp(60) : 0, { duration: 300 });
      if (!prev && onSearch) onSearch(''); 
      if (prev) setSearchQuery('');
      return !prev;
    });
  };

  const handleSearchInput = (text: string) => {
    setSearchQuery(text);
    if (onSearch) onSearch(text);
  };

  return (
    <View style={styles.container}>

      <Touchable onPress={goBack}>
        <View style={styles.backBtnBg}>
          <LeftArrow />
          <Text type={'small_medium'} text={'Back'} color="primary80" />
        </View>
      </Touchable>


      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 25 }}>
        {isSearchVisible && (
          <View style={styles.searchContainer}>
         
            {isSearchInputVisible && (
              <Animated.View style={[styles.searchInputContainer, animatedSearchInputStyle]}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search products..."
                  value={searchQuery}
                  onChangeText={handleSearchInput}
                  autoFocus={true} 
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    if (onSearch) onSearch(searchQuery);
                  }}
                />
                <Pressable style={styles.closeButton} onPress={toggleSearchInput}>
                  <Text type="small_medium" text="X" color="primary80" />
                </Pressable>
              </Animated.View>
            )}

    
            <Pressable onPress={toggleSearchInput}>
              <SearchNormal1 size={20} color="#081E26" />
            </Pressable>
          </View>
        )}


        <Pressable style={styles.iconButton} onPress={onTouchCart}>
          <CartTabIcon />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text
                type="small_bold"
                text={totalItems > 99 ? '99+' : totalItems.toString()}
                color="white"
                style={styles.badgeText}
              />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default StoreHeaderNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  backBtnBg: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CED3D5',
    paddingHorizontal: 8,
    width: wp(160), 
    height: 35, 
    position: 'absolute',
    right: wp(25), 
  },
  searchInput: {
    flex: 1,
    fontSize: fs(14),
    color: '#081E26',
    paddingVertical: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
});