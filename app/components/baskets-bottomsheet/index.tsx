import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { fs, hp, wp } from 'app/resources/config';
import { Button, Image, ReusableBottomSheet, ScrollView, Text } from 'app/design-system';
import { BasketProps } from './types';
import { CartTabIcon } from 'app/assets/svg';
import { useNavigation } from '@react-navigation/native';
import { ChefLogo } from 'app/assets/images';

interface StoreBasket {
  id: string;
  label: string;
  image: string;
  description: string;
  isSelected: boolean;
}

interface BasketBottomsheetProps {
  store: StoreBasket[];
  onToggle: (id: string) => void; // Not used here, kept for compatibility
  visible: boolean;
  closeBottomsheet: () => void;
  onBasketPress: () => void;
  isButtonDisable: boolean;
  extraData?: { totalPrice: string }; // Optional prop for total price
}

const BasketBottomsheet = ({
  store,
  onToggle,
  visible,
  closeBottomsheet,
  onBasketPress,
  isButtonDisable,
  extraData,
}: BasketBottomsheetProps) => {
  return (
    <ReusableBottomSheet
      isVisible={visible}
      onClose={closeBottomsheet}
      snapPoints={['90%']}
     
      showHandle={true}
      backdropOpacity={0.8}
      backgroundStyle={{ backgroundColor: '#FFF9ED' }}
      backdropStyle={{ backgroundColor: '#06181E' }}
      handleIndicatorStyle={styles.bottomSheetIndicator}>
   
     <View style={styles.container}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <CartTabIcon />
          </View>
          <Text type="headline_3_semibold" text="Your Cart" color="black" />
          <Text type="small_regular" text="Each basket is from a different shop." color="black" />
          <Text
            type="small_regular"
            text="Checkout one at a time; choose where to start from."
            color="black"
          />
        </View>
        <ScrollView>
        <View>
          {store.length === 0 ? (
            <Text type="body_regular" text="Your cart is empty" />
          ) : (
            store.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <Image
                  uri={item.image}
                  width={31} // Adjust size as needed
                  height={31}
                  bR={15.5}
                />
                <View>
                  <Text type="body_medium" text={item.label} />
                  <Text type="sub_regular" text={item.description} color="primary40" />
                </View>
              </View>
            ))
          )}
          {extraData && store.length > 0 && (
            <Text type="body_regular" text={`Total: ${extraData.totalPrice}`} />
          )}
        </View>

        <Button
          title="Next"
          onPress={onBasketPress}
          disabled={isButtonDisable}
          containerStyle={{ marginTop: 20 }}
        />
          </ScrollView>
      </View>
   
    </ReusableBottomSheet>
  );
};

export default BasketBottomsheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 15,
    zIndex: 2,
  },
  storeContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: wp(12),
    borderColor: '#98A2B3',
    columnGap: 8,
    flexDirection: 'row',
  },
  selected: {
    borderColor: '#F4AB19',
    borderWidth: 1,
  },
  recommended: {
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
  },
  bottomSheetIndicator: {
    width: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: '#FDEED1',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginBottom: 12,
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
});
