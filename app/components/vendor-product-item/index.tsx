import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Image, Text } from 'app/design-system';
import { hp, wp } from 'app/resources/config';

export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  inStock: boolean;
  description: string;
  category: string;
  weight: string;
  discount: number;
};

type ProductItemProps = {
  product: Product;
  onToggleStock: (productId: string, newValue: boolean) => void; // Kept for compatibility but unused
  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
};

const ProductItem = ({ product, onToggleStock, onView, onEdit, onDelete }: ProductItemProps) => {
  // Toggle state is now determined solely by stock quantity
  const isInStock = product.stock > 0;

  return (
    <View style={styles.productContainer}>
      <Image uri={product.image} width={wp(47)} height={hp(35)} borderRadius={wp(5)} />

      <View style={styles.contentContainer}>
        <View style={styles.productInfo}>
          <View style={styles.textContainer}>
            <Text type="small_semibold" color="primary80" text={product.name} />
            <View style={styles.stockContainer}>
              <Text type="small_regular" color="primary40" text={`${product.stock} items `} />
              <Text
                style={[styles.stockValue, isInStock ? styles.inStock : styles.outOfStock]}
                text={isInStock ? 'In Stock' : 'Out of Stock'}
              />
            </View>
          </View>

          <Menu>
            <MenuTrigger>
              <MaterialIcons name="more-vert" size={wp(24)} color="#666" />
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.menuOptions}>
              <MenuOption onSelect={() => onView(product.id)} style={styles.menuOption}>
                <Text type="small_medium" text="View Product" />
              </MenuOption>
              <MenuOption onSelect={() => onEdit(product.id)} style={styles.menuOption}>
                <Text type="small_medium" text="Edit Product" />
              </MenuOption>
              <MenuOption onSelect={() => onDelete(product.id)} style={styles.menuOption}>
                <Text type="small_medium" text="Delete Product" />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        <View style={styles.actionsContainer}>
          <Text type="small_semibold" color="primary80" text={`£${product.price.toFixed(2)}`} />
          <Switch
            trackColor={{ false: '#ADB6B9', true: '#F4AB19' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#ADB6B9"
            value={isInStock} // Reflects stock status only
            disabled={true} // Prevents user interaction
            style={styles.switch}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    columnGap: wp(10),
    paddingVertical: hp(14),
    backgroundColor: '#fff',
    borderRadius: wp(8),
    paddingHorizontal: wp(11),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: hp(8),
  },
  contentContainer: {
    flex: 1,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(4),
  },
  textContainer: {
    rowGap: hp(5),
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockValue: {
    fontSize: wp(9),
    fontWeight: '500',
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    borderRadius: wp(10),
  },
  inStock: {
    color: '#0F973D',
    backgroundColor: '#E7F6EC',
  },
  outOfStock: {
    color: '#F44336',
    backgroundColor: '#FBEAE9',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuOptions: {
    borderRadius: wp(8),
    padding: wp(8),
    width: wp(126),
  },
  menuOption: {
    padding: wp(10),
  },
  menuOptionText: {
    fontSize: wp(16),
    color: '#333',
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: hp(4),
  },
  deleteOptionText: {
    color: '#F44336',
  },
  switch: {
    transform: [{ scaleX: wp(0.6) }, { scaleY: hp(0.6) }],
  },
});

export default ProductItem;