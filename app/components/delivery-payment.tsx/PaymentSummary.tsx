import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryItem {
  label: string;
  amount: number | string;
}

export const PaymentSummary = () => {
  const summaryItems: SummaryItem[] = [
    { label: 'Sub-total', amount: 45.99 },
    { label: 'Number of Items', amount: 3 },
    { label: 'Delivery Fee', amount: 5.99 },
    { label: 'Service Charge', amount: 2.50 },
  ];

  const total = summaryItems.reduce((sum, item) => 
    typeof item.amount === 'number' ? sum + item.amount : sum, 0);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Payment Summary</Text>
      {summaryItems.map(item => (
        <View key={item.label} style={styles.summaryRow}>
          <Text>{item.label}</Text>
          <Text>
            {typeof item.amount === 'number' 
              ? `$${item.amount.toFixed(2)}` 
              : item.amount}
          </Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalText}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontWeight: 'bold',
  },
});

export default PaymentSummary;