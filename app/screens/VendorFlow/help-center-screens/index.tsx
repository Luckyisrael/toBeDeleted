import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Screen, Text } from 'app/design-system';

const VendorHelpCenterScreen = () => {
  const navigation = useNavigation();

  return (
    <Screen bgColor="#fff">
      <View style={styles.container}>
        <View style={{ rowGap: 5 }}>
          <Text type="emphasized_medium" text="Help Center" />
          <Text
            type="small_regular"
            color="primary40"
            text="Find answers to common questions or get support when you need it."
          />
        </View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('VENDOR_FAQ_SCREEN')}>
          <Text type='body_medium' color='primary80' text="Frequently asked questions" />
          <Feather name="chevron-right" size={20} color="#849296" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('VENDOR_CONTACT_US_SCREEN')}>
          <Text type='body_medium' color='primary80' text='Contact Us' />
          <Feather name="chevron-right" size={20} color="#849296" />
        </TouchableOpacity>
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

export default VendorHelpCenterScreen;
