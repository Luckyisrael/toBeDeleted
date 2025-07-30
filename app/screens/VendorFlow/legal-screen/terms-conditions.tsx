import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text } from 'app/design-system';

const TermsAndConditionsScreen = () => {
  return (
    <Screen>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Terms Header */}

        <View style={{ rowGap: 5 }}>
          <Text type="emphasized_medium"  color='primary80'  text="Sweeftly Terms & Condition" />
          <Text type="small_regular" color="primary40" text="Last Updated: 2nd February, 2025" />
        </View>

        {/* Introduction Section */}
        <View style={[styles.section, { marginVertical: 15}]}>
          <Text type="emphasized_medium" color='primary80' text="Introduction" />
          <Text
          type='small_regular' color='primary40'
            text="Welcome to Sweeftly! By using our platform, you agree to follow these terms and conditions. 
            Please read them carefully before placing an order."
          />
        </View>

        <View style={[styles.divider, { marginBottom: 10}]} />

        {/* User Accounts Section */}
        <View style={styles.section}>
          <Text text="User Accounts" type='body_medium' color='primary80'/>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="You must create an account to use our services." />
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="Keep your login details secure. You're responsible for any activity under your account." />
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text
              type='small_regular' color='primary40'
                text="Providing false or misleading information may lead to 
                account suspension."
              />
            </View>
          </View>
        </View>

        {/* Orders & Payments Section */}
        <View style={styles.section}>
          <Text text="Orders & Payments" type='body_medium' color='primary80'/>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="Orders placed through Sweeftly are final once confirmed." />
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="Payments must be made through the app using accepted methods." />
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="If an order cannot be fulfilled, you may be eligible for a refund based on our Refund Policy." />
            </View>
          </View>
        </View>

        {/* Delivery & Pickup Section */}
        <View style={styles.section}>
          <Text text="Delivery & Pickup" type='body_medium' color='primary80'/>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="Delivery times are estimated and may vary due to traffic, weather, or vendor delays." />
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="If you choose Pickup, ensure you arrive within the selected timeframe to avoid order cancellation." />
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="Sweeftly is not responsible for food quality after pickup/delivery." />
            </View>
          </View>
        </View>

        {/* Vendor & Product Responsibility Section */}
        <View style={styles.section}>
          <Text text="Vendor & Product Responsibility" type='body_medium' color='primary80'/>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="Vendors are responsible for the quality, pricing, and availability of their products." />
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint} text="•" />
              <Text type='small_regular' color='primary40' text="If you receive an incorrect or defective item, report it within [X] hours via the Help Center." />
            </View>
          </View>
        </View>

        {/* Add more space at the bottom for scrolling */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    rowGap: 10
  },
  section: {
    rowGap: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  bulletList: {
    marginTop: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 18,
    marginRight: 8,
    color: '#333333',
  },

  bottomSpace: {
    height: 40,
  },
});

export default TermsAndConditionsScreen;
