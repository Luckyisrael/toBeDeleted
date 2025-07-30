import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Button } from 'react-native-paper';

interface VoucherCodeSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
}

export const VoucherCodeSheet: React.FC<VoucherCodeSheetProps> = ({ 
  isVisible, 
  onClose, 
  onApply 
}) => {
  const [voucherCode, setVoucherCode] = useState('');

  const handleApply = () => {
    onApply(voucherCode);
    onClose();
  };

  return (
    <BottomSheet
      isVisible={isVisible}
      onBackdropPress={onClose}
    >
      <View style={styles.bottomSheetContainer}>
        <Text style={styles.sectionTitle}>Enter Voucher Code</Text>
        <TextInput
          value={voucherCode}
          onChangeText={setVoucherCode}
          placeholder="Enter your voucher code"
          style={styles.voucherInput}
        />
        <Button 
          mode="contained"
          onPress={handleApply}
        >
          Apply Voucher
        </Button>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  voucherInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default VoucherCodeSheet;