// components/ErrorPlacingOrderModal.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Text, Button } from 'app/design-system';
import { DoneErrorSvg, DoneSvg } from 'app/assets/svg';

type ErrorPlacingOrderModalProps = {
  isVisible: boolean;
  goBackHome: () => void;
};

const ErrorPlacingOrderModal: React.FC<ErrorPlacingOrderModalProps> = ({ isVisible, goBackHome }) => {
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
      <></>
    </Modal>
  );
};

const styles = StyleSheet.create({


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

export default ErrorPlacingOrderModal;
