import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'app/design-system';
import { AddCircle, MinusCirlce } from 'iconsax-react-native';
import { hp, wp } from 'app/resources/config';

const OrderSummaryProductCard = ({
  name,
  price,
  initialQuantity,
  onQuantityChange,
}: {
  name: string;
  price: number;
  initialQuantity: number;
  onQuantityChange: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrement = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text type="body_medium" color="primary80" text={name} truncateWords={3}/>
        <Text type="small_regular" color="primary50" text={`£${price.toFixed(2)}`} />
      </View>

      <View style={styles.quantityContainer}>
        <Pressable onPress={decrement}>
          <MinusCirlce size={20} color="#CED3D5" variant="Bulk" />
        </Pressable>

        <Text text={quantity.toString()} />

        <Pressable onPress={increment}>
          <AddCircle size={20} color="#cb8e15" variant="Bulk" />
        </Pressable>
        <View style={{ borderBottomWidth: 0.5, borderColor: 'black'}} />
      </View>
      
    </View>
  );
};

export default OrderSummaryProductCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,

    marginVertical: 5,
    borderRadius: 8,
  
  },

  quantityContainer: {
    paddingVertical: hp(3),
    paddingHorizontal: wp(5),
    borderRadius: wp(12),
    columnGap: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
