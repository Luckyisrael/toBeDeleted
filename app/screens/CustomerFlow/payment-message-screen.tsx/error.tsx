import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, Screen, Text } from 'app/design-system';
import { useNavigation } from '@react-navigation/native';
import { DoneErrorSvg } from 'app/assets/svg';

// Get screen height for dynamic sizing
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PaymentErrorScreen = () => {

  const navigation = useNavigation();


  const handlePaymentError = () => {
    console.log('handlePaymentError called');
    
    navigation.navigate('CUSTOMERTABS', { screen: 'CUSTOMER_BASKET_SCREEN' });
  };

  return (
    <Screen withBackBtn={false} pH={0} bgColor="#021014D9">
      <View style={{ flex: 1 }}>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            

            <View style={{ marginTop: 40 }}>
              <DoneErrorSvg />
            </View>
            <View style={{ rowGap: 40, alignItems: 'center' }}>
              <View style={{ rowGap: 8, alignItems: 'center' }}>
                <Text text="Opps! Something’s not right" color="primary80" type="body_semibold" />

                {/* Body */}
                <Text
                  color="primary40"
                  type="small_regular"
                  text="Payment didn’t go through. Verify your card details or choose a different payment method."
                  align="center"
                />
              </View>

              <Button
                title="Back to Home"
                onPress={handlePaymentError}
                containerStyle={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default PaymentErrorScreen;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: SCREEN_HEIGHT * 0.5, // Occupy bottom half of the screen
    width: '100%', // Ensure full width
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#051217',
  },
});