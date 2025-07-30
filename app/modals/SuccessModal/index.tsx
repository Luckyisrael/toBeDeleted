import useColors from 'app/hooks/useColors';

import { hp, wp } from 'app/resources/config';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Image, Text } from 'app/design-system';

import { useNavigation } from '@react-navigation/native';
import { NoAuthStackParamList } from 'app/navigation/types';
import { TickCircle } from 'iconsax-react-native';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;

  onPress: () => void;
}

const SuccessModal = ({ visible, onClose, title, description, onPress }: SuccessModalProps) => {
  const { colors } = useColors();
  const styles = successModalStyles();
  const { navigate } = useNavigation();
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropColor={ "#F4AB19" }
      backdropOpacity={0.2}
      style={{ margin: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut">
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TickCircle size="50" color="#4FBF26" />
        </View>

        <Text type='emphasized_medium' align="center" text={description} />
      </View>
    </Modal>
  );
};

export default SuccessModal;

const successModalStyles = () =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',

      borderRadius: wp(16),
      marginHorizontal: 20,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 44,
      rowGap: 20,
    },
    imageContainer: {
      alignSelf: 'center',
    },
  });
