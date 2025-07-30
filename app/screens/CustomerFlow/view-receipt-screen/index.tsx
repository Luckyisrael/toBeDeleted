import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import { Screen, Text } from 'app/design-system';
import { CustomerViewRecieptScreenProps } from 'app/navigation/types';
import { hp } from 'app/resources/config';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const orderItems: OrderItem[] = [
  { name: 'Sausage', price: 7.99, quantity: 1 },
  { name: 'Pizza', price: 12.99, quantity: 2 },
  { name: 'Pizza', price: 12.99, quantity: 2 },
  { name: 'Pizza', price: 12.99, quantity: 2 },
];

const deliveryFee = 5.0;
const discount = 3.0;

const ViewReceiptScreen = ({ navigation }: CustomerViewRecieptScreenProps) => {
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee - discount;
  const totalItemInCart = orderItems.length;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={{ marginBottom: hp(20) }}>
          <Text type="headline_3_bold" text="Reciept" />
          <View style={styles.receiptcontainer}>
            <View style={styles.recieptRow}>
              <Text text="Order Id: " />
              <Text text="Delivery Mode: " />
            </View>
            <View style={styles.recieptRow}>
              <Text text="Name: " />
              <Text text="Address: " />
            </View>
            <View style={styles.recieptRow}>
              <Text text="Order Id"></Text>
              <Text text="Delivery Mode" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text text="Status: " />
              <Text style={styles.deliveredText} type="sub_semibold" text="Delivered" />
            </View>
          </View>
        </View>

        <Text text="Order Details" type="headline_3_bold" />

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={{ flex: 2 }} type="small_semibold" text={`Item (${totalItemInCart}) `} />
          <Text style={{ flex: 1, textAlign: 'center' }} type="small_semibold" text="Price" />
          <Text style={{ flex: 1, textAlign: 'center' }} type="small_semibold" text="Quantity" />
          <Text style={{ flex: 1, textAlign: 'right' }} type="small_semibold" text="Total" />
        </View>

        {/* Order Items List */}
        <FlatList
          data={orderItems}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.itemText, { flex: 2 }]} text={item.name} type="small_regular" />
              <Text
                style={[styles.priceText, { flex: 1, textAlign: 'center' }]}
                text={`$ ${item.price.toFixed(2)}`}
                type="small_regular"
              />

              <Text
                style={[styles.quantityText, { flex: 1, textAlign: 'center' }]}
                text={`${item.quantity} item`}
                type="small_regular"
              />

              <Text
                style={[styles.totalText, { flex: 1, textAlign: 'right' }]}
                text={`$ ${(item.price * item.quantity).toFixed(2)}`}
                type="small_regular"
              />
            </View>
          )}
        />

        {/* Delivery Fee */}
        {/* <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel} text="Delivery " />
          <Text style={styles.summaryValue} text={`${deliveryFee.toFixed(2)}`} />
        </View> */}

        {/* Discount */}
        <View style={styles.summaryRow}>
          <Text type="small_semibold" text="Discount" />
          <Text type="small_semibold" text={`-$${discount.toFixed(2)}`} />
        </View>

        {/* Total Price */}
        <View style={styles.summaryRow}>
          <Text type="headline_3_bold" text="Total" />
          <Text type="headline_3_bold" text={`$ ${total.toFixed(2)}`} />
        </View>
      </View>
    </Screen>
  );
};

export default ViewReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: hp(8),
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: hp(4),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(8),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: { flex: 2 },
  priceText: { flex: 1, textAlign: 'center' },
  quantityText: { flex: 1, textAlign: 'center' },
  totalText: { flex: 1, textAlign: 'right' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(6),
  },
  summaryLabel: { fontSize: 16, color: '#666' },
  summaryValue: { fontSize: 16, fontWeight: 'bold' },
  discount: { color: 'red' },

  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  recieptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptcontainer: {
    rowGap: 10,
  },
  deliveredText: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#D0FFBE',
    borderWidth: 1,
    borderColor: '#4FBF26',
    color: '#4FBF26',
    borderRadius: 5,
  },
});
