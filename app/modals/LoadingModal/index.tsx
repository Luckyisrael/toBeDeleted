import useColors from 'app/hooks/useColors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

const LoaderModal = ({ isLoading = false }) => {
  const { colors } = useColors();
  return (
    <Modal
      isVisible={isLoading} 
      backdropColor={'#06181E'}
      backdropOpacity={0.7}
      
      
      animationIn="fadeIn"
      animationOut="fadeOut">
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={'#F4AB19'} style={{ alignSelf: 'center'}}/>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
     
    
     
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }
});

export default LoaderModal;