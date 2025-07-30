import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Button, Screen } from 'app/design-system';
import { StoreItemListScreenProps } from 'app/navigation/types';
import { HeaderNavigation, OpeningHoursDeliveryTime, StoreHeader } from 'app/components';
import { SearchNormal1 } from 'iconsax-react-native';

interface Item {
  id: string;
  name: string;
  image: string;
  price: number;
}

const items: Item[] = [
  { id: '1', name: 'Sausage', image: 'https://via.placeholder.com/150', price: 2.99 },
  { id: '2', name: 'Bacon', image: 'https://via.placeholder.com/150', price: 3.49 },
];

export const StoreItemsListScreen = ({ navigation, route }: StoreItemListScreenProps) => {
  const { storeName, category } = route.params;
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (id: string, delta: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: Math.max((prevCart[id] || 0) + delta, 0),
    }));
  };

  const total = Object.entries(cart).reduce(
    (sum, [id, quantity]) => sum + quantity * (items.find((item) => item.id === id)?.price || 0),
    0
  );

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Screen withBackBtn={false} pH={0}>
      <View style={styles.container}>
        <View style={styles.Hpadding}>
          <HeaderNavigation />
        </View>
        {/** Store Header */}
        <StoreHeader />

        {/**Main Container */}
        <View style={styles.mainContainer}>

          {/** Search Box */}

          <View style={styles.searchBox}>
            <SearchNormal1 size="20" color="#D9D9D9" />
            <TextInput
              style={styles.input}
              placeholder="Searchh"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="default"
            />
          </View>

          <View>
            {/**Opening HOurs and delivery time */}
            <OpeningHoursDeliveryTime openingHours='8:00am - 04:00pm' deliveryTimeFrame='10 - 15mins'/>
          </View>

          <Text style={styles.path}>{`${storeName} / ${category}`}</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                  <View style={styles.quantityContainer}>
                    <Button
                      onPress={() => handleQuantityChange(item.id, -1)}
                      disabled={!(cart[item.id] > 0)}
                      title="-"
                    />

                    <Text style={styles.quantity}>{cart[item.id] || 0}</Text>
                    <Button onPress={() => handleQuantityChange(item.id, 1)} title="-" />
                  </View>
                </View>
                <Button
                  onPress={() => navigation.navigate('PRODUCT_DETAILS_SCREEN', { product: item })}
                  title="View"
                />
              </View>
            )}
          />
          {total > 0 && (
            <Button
              onPress={() => navigation.navigate('Checkout', { cart, total, storeName })}
              containerStyle={styles.checkoutButton}
              title={`Proceed to Checkout - ${total.toFixed(2)}`}
            />
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
    paddingHorizontal: 20,
    marginTop: 15,
  },
  path: { fontSize: 16, marginVertical: 10 },
  itemContainer: { flexDirection: 'row', marginBottom: 10 },
  itemImage: { width: 60, height: 60, borderRadius: 10 },
  details: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: 'gray' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  checkoutButton: { marginTop: 20 },
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
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
  },
});
