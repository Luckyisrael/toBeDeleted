import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'app/design-system';
import { ProductDetailScreenProps } from 'app/navigation/types';

export const ProductDetailScreen = ({ route, navigation }: ProductDetailScreenProps) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Text>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text>🛒</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: product.image }} style={styles.bigImage} />
      <FlatList
        data={[product.image, product.image, product.image]}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Image source={{ uri: item }} style={styles.smallImage} />
          </TouchableOpacity>
        )}
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>This is a placeholder description for {product.name}.</Text>
      <View style={styles.quantityContainer}>
        <Button onPress={() => setQuantity((q) => Math.max(q - 1, 1))}>-</Button>
        <Text style={styles.quantity}>{quantity}</Text>
        <Button onPress={() => setQuantity((q) => q + 1)}>+</Button>
      </View>
      <Button onPress={() => {}} style={styles.addToCart}>
        Add to Cart - ${(quantity * product.price).toFixed(2)}
      </Button>
      <Button onPress={() => navigation.navigate('Checkout')} style={styles.checkout}>
        Proceed to Checkout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  bigImage: { width: '100%', height: 200, marginBottom: 10 },
  smallImage: { width: 60, height: 60, marginHorizontal: 5 },
  name: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  price: { fontSize: 18, color: 'gray' },
  description: { fontSize: 16, marginVertical: 10 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  addToCart: { marginTop: 10, backgroundColor: 'blue' },
  checkout: { marginTop: 10, backgroundColor: 'green' },
});
