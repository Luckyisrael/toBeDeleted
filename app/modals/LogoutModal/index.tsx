import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Text, Button } from 'app/design-system';

type LogoutModalProps = {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  header?: string;
  description?: string;
  buttonText?: string;
};

const LogoutModal = ({ isVisible, onCancel, onConfirm, header, description, buttonText }: LogoutModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      backdropColor="#021014D9"
      backdropOpacity={0.9}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection="down"
      onSwipeComplete={onCancel}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        {/* Swipe indicator */}
        <View style={styles.swipeIndicator} />

        {/* Header */}
        <View style={styles.modalHeader}>
          <Text text={header || 'Logout of sweeftly'} color="primary80" type="body_semibold" />
          <TouchableOpacity onPress={onCancel}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <Text
          color="primary40"
          type="small_regular"
          text={description || "You will need to log in again to access your account. Are you sure you want to continue?"}
        />

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Button
            variant="secondary"
            title="Cancel"
            onPress={onCancel}
            containerStyle={styles.modalButton}
          />
          <Button
            title={buttonText || "Logout"}
            onPress={onConfirm}
            containerStyle={[styles.modalButton, { backgroundColor: '#000' }]}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#FFF9ED',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 30,
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
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default LogoutModal;
