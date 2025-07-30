// components/PlacedOrderModal.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Text, Button } from 'app/design-system';
import { DoneSvg } from 'app/assets/svg';

type PlacedOrderModalProps = {
  isVisible: boolean;
  goBackHome: () => void;
};

const PlacedOrderModal: React.FC<PlacedOrderModalProps> = ({ isVisible, goBackHome }) => {
  console.log('PlacedOrderModal isVisible:', isVisible);
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={goBackHome}
      onBackButtonPress={goBackHome}
      backdropColor="#021014D9"
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection="down"
      onSwipeComplete={goBackHome}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        {/* Swipe indicator */}
        <View style={styles.swipeIndicator} />

        <View style={{ marginTop: 40 }}>
          <DoneSvg />
        </View>
        <View style={{ rowGap: 40, alignItems: 'center' }}>
          <View style={{ rowGap: 8, alignItems: 'center' }}>
            <Text text="Your order has been placed!" color="primary80" type="body_semibold" />

            {/* Body */}
            <Text
              color="primary40"
              type="small_regular"
              text="We’ve received your order, you’ll be updated on the process of your order."
              align="center"
            />
          </View>

          <Button title="Back to Home" onPress={goBackHome} containerStyle={styles.modalButton} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    zIndex: 1000 
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalButton: {
    backgroundColor: '#051217',
  },
});

export default PlacedOrderModal;
