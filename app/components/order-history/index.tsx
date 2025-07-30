import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Image, Text } from 'app/design-system';
import { ChefLogo } from 'app/assets/images';
import { useNavigation } from '@react-navigation/native';
import { Edit } from 'iconsax-react-native';
import { hp, wp } from 'app/resources/config';

interface OrderHistoryItemProps {
  image: string;
  storeName: string;
  itemsCount: number;
  price: number;
  deliveryAddress: string;
  onViewReceipt: () => void;
}

const OrderHistoryItem = ({
  image,
  storeName,
  itemsCount,
  price,
  deliveryAddress,
  onViewReceipt,
}: OrderHistoryItemProps) => {
  const navigation = useNavigation();

  const handleConfirm = () => {
    //@ts-ignore
    navigation.navigate('CUSTOMER_AUTH_INDEX', { screen: 'VIEW_RECEIPT_SCREEN' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Image */}
        <Image uri={ChefLogo} ui={styles.image} />

        {/* Order Details */}
        <View style={styles.details}>
          <Text type="emphasized_bold" text={storeName} />
          <Text
            type="small_regular"
            style={styles.info}
            text={`${itemsCount} items • ${price.toFixed(2)}`}
          />
          <Text type="small_regular" text={`Deliver to: ${deliveryAddress}`} />
        </View>

        <Edit size="16" color="#000000" />
      </View>

      {/* View Receipt Button */}
      <Button title="View Receipt" onPress={handleConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: hp(8),
    marginVertical: hp(6),
    borderRadius: wp(8),

    rowGap: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    columnGap: 15,
    alignItems: 'center',
    marginBottom: hp(10),
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  }, 
  info: {
    marginVertical: hp(4),
  }, 
 
});

export default OrderHistoryItem;
