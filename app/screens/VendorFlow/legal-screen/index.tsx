import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Screen, Text } from 'app/design-system';

const VendorLegalScreen = () => {
  const navigation = useNavigation();

  return (
    <Screen bgColor="#fff">
      <View style={styles.container}>
        <View style={{ rowGap: 5 }}>
          <Text type="emphasized_medium" text="Legal" />
        </View>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('VENDOR_TERMS_CONDITIONS_SCREEN')}>
            <View style={{ width: '80%'}}>
            <Text type="body_medium" color="primary80" text="Terms & Conditions" />
            <Text type="sub_regular" color="primary40" text="Review our terms of service to understand your rights and responsibilities while using Sweeftly" />
          </View>
          <Feather name="chevron-right" size={20} color="#849296" />
        </Pressable>

        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('VENDOR_PRIVACY_POLICY_SCREEN')}>
          <View style={{ width: '80%'}}>
            <Text type="body_medium" color="primary80" text="Privacy Policy" />
            <Text type="sub_regular" color="primary40" text="Your data is important to us. Learn how we collect, use, and protect your personal information." />
          </View>
          <Feather name="chevron-right" size={20} color="#849296" />
        </Pressable>
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('VENDOR_CONTACT_US_SCREEN')}>
          <View style={{ width: '80%'}}>
            <Text type="body_medium" color="primary80" text="Vendor & Delivery Policy" />
            <Text type="sub_regular" color="primary40" text="Guidelines for vendors and delivery partners to ensure smooth transactions and service quality." />
          </View>
          <Feather name="chevron-right" size={20} color="#849296" />
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default VendorLegalScreen;
