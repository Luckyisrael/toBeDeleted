import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'app/design-system';
import { Card } from 'iconsax-react-native';
import { PaymentMethod } from 'app/types/paymentTypes';
import { useStripe } from '@stripe/stripe-react-native';

// Update your PaymentMethod type to include "Stripe" if not already included
// You might need to update this in your types file
// export type PaymentMethod = 'Cash' | 'Credit/Debit Card' | 'Apple Pay' | 'Amazon Pay' | 'PayPal' | 'GeePay' | 'Stripe';

interface PaymentMethodSelectorProps {
  mode: 'delivery' | 'pickup';
  onPaymentSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ mode, onPaymentSelect }) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    mode === 'delivery' ? 'Credit/Debit Card' : 'Cash'
  );


  // Define available payment methods based on mode and device capabilities
  const getPaymentMethods = () => {
    let methods: PaymentMethod[] = [];
    
    if (mode === 'pickup') {
      methods = ['Cash'];
    }
    
    methods.push('Credit/Debit Card');
    
    methods = [...methods ]; //'Amazon Pay', 'PayPal', 'GeePay'
    
    return methods;
  };

  const paymentMethods = getPaymentMethods();

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    onPaymentSelect(method);
  };

  // Function to render payment method icon
  const renderPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'Credit/Debit Card':
        return <Card size={18} color="#324950" />;
      case 'Apple Pay':
      case 'Amazon Pay':
      case 'PayPal':
      case 'GeePay':
      case 'Cash':
      default:
        return <Card size={16} color="#324950" />;
    }
  };

  return (
    <View style={styles.sectionContainer}>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method}
          style={styles.paymentOption}
          onPress={() => handlePaymentSelect(method)}
        >
          <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
            {renderPaymentIcon(method)}
            <Text type="small_medium" color="primary50" text={method} />
          </View>
          <View style={[styles.radioOuter, selectedPayment === method && styles.radioOuterActive]}>
            {selectedPayment === method && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { rowGap: 16 },
  paymentOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 5,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#F4AB19' },
  radioInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F4AB19' },
});

export default PaymentMethodSelector;