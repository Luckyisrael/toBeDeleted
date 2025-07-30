import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Text, Button } from 'app/design-system';
import useAlert from 'app/hooks/useAlert';

type ChangeAddressModalProps = {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (data: { address: string; postCode: string }) => void;
  currentAddress: string;
  currentPostCode?: string;
  isLoading?: boolean;
};

const ChangeAddressModal = ({
  isVisible,
  onCancel,
  onConfirm,
  currentAddress,
  currentPostCode = '',
  isLoading,
}: ChangeAddressModalProps) => {
  const [newAddress, setNewAddress] = useState(currentAddress || '');
  const [postCode, setPostCode] = useState(currentPostCode || '');
  const { attentionAlert, showErrorMessage, clearAlertMessage, alertMessage } = useAlert();

  useEffect(() => {
    setNewAddress(currentAddress || '');
    setPostCode(currentPostCode || '');
  }, [currentAddress, currentPostCode]);

  const handleApply = () => {
    const trimmedAddress = newAddress.trim();
    const trimmedPostCode = postCode.trim().toUpperCase();

    if (!trimmedAddress || !trimmedPostCode) {
      attentionAlert('Please fill in all the fields');
      return;
    }

    const isAddressValid = /glasgow/i.test(trimmedAddress);
    const isPostCodeValid = /^G\d{1,2}/i.test(trimmedPostCode);

    if (!isAddressValid || !isPostCodeValid) {
      showErrorMessage(
        'We currently only deliver to valid Glasgow addresses. Please ensure your address includes "Glasgow" and a correct Glasgow postcode.'
      );
      return;
    }

    if (
      trimmedAddress === currentAddress.trim() &&
      trimmedPostCode === currentPostCode.trim().toUpperCase()
    ) {
      handleCancel();
      return;
    }

    onConfirm({ address: trimmedAddress, postCode: trimmedPostCode });
    handleCancel(); // Close modal after confirming
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    clearAlertMessage();
    onCancel();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleCancel}
      onBackButtonPress={handleCancel}
      backdropColor="#021014"
      backdropOpacity={0.85}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection="down"
      onSwipeComplete={handleCancel}
      style={styles.modal}>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ margin: 0 }}>
      <View style={styles.modalContainer}>
        <View style={styles.swipeIndicator} />
        <View style={styles.modalHeader}>
          <Text text="Change Delivery Address" color="primary80" type="body_semibold" />
          <TouchableOpacity onPress={handleCancel} accessibilityLabel="Close modal">
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
          enableAutomaticScroll={true}>
          <View style={styles.addressContainer}>
            <Text
              color="primary40"
              type="small_regular"
              text="Current Address"
              style={styles.label}
            />
            <Text
              color="primary80"
              type="small_regular"
              text={currentAddress || 'No address set'}
              style={styles.currentAddress}
            />
            <Text color="primary40" type="small_regular" text="Postcode" style={styles.label} />
            <TextInput
              style={[
                styles.currentAddress,
                { backgroundColor: 'white', borderWidth: 1, borderColor: '#E0E0E0' },
              ]}
              placeholder="Enter new postcode"
              placeholderTextColor="#999"
              value={postCode}
              onChangeText={(text) => {
                setPostCode(text);
                clearAlertMessage();
              }}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleApply}
              autoCapitalize="characters"
              accessibilityLabel="Enter new postcode"
            />
            <Text
              color="primary40"
              type="small_regular"
              text="Enter New Address"
              style={styles.label}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g 39 Renfield Street, Glasgow"
              placeholderTextColor="#999"
              value={newAddress}
              onChangeText={(text) => {
                setNewAddress(text);
                clearAlertMessage();
              }}
              multiline
              numberOfLines={3}
              editable={!isLoading}
              accessibilityLabel="Enter new delivery address"
            />
            {alertMessage && (
              <Text style={styles.errorMessage} text={alertMessage} />
            )}
          </View>
          <View style={styles.modalFooter}>
            <Button
              variant="secondary"
              title="Cancel"
              onPress={handleCancel}
              containerStyle={styles.modalButton}
            />
            <Button
              title="Apply"
              onPress={handleApply}
              containerStyle={[styles.modalButton, { backgroundColor: '#000' }]}
              disabled={
                !newAddress.trim() ||
                !postCode.trim() ||
                (newAddress.trim() === currentAddress.trim() &&
                  postCode.trim().toUpperCase() === currentPostCode.trim().toUpperCase()) ||
                isLoading
              }
              isLoading={isLoading}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      </KeyboardAvoidingView>
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
    maxHeight: '100%',
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
  addressContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 4,
  },
  currentAddress: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 80,
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
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ChangeAddressModal;