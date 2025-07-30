import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Text, Button } from 'app/design-system';
import { DoneErrorSvg, DoneSvg, EasterEggSvg } from 'app/assets/svg';
import { hp } from 'app/resources/config';

type HampperModalProps = {
  isVisible: boolean;
  goBackHome: () => void;
};

const HampperModal = ({ isVisible, goBackHome }: HampperModalProps) => {
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'Instagram' | 'TikTok' | null>(null);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const toValue = showPlatformDropdown ? 0 : 1;
    Animated.timing(dropdownAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowPlatformDropdown(!showPlatformDropdown);
  };

  const handleSubmit = () => {
    if (!agreed) {
      console.log('Please agree to the terms');
      return;
    }

    console.log({
      socialMediaHandle,
      platform: selectedPlatform,
      agreed,
    });

    goBackHome();
  };

  const dropdownScaleY = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const dropdownOpacity = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

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
        <View style={styles.swipeIndicator} />

          <TouchableOpacity onPress={goBackHome} style={{alignSelf: 'flex-end'}}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
 
        <View style={{ rowGap: 40 }}>
          <View style={{ marginTop: 40, alignItems: 'center', rowGap: 12 }}>
            <EasterEggSvg />
            <Text
              align="center"
              text="Congratulations! You've qualified for our Easter Hamper Draw!"
              color="primary80"
              type="body_semibold"
            />
            <Text
              color="primary40"
              type="small_regular"
              text="Want to increase your chances of winning? Follow us on Tiktok and Instagram: @sweeftly_UK"
              align="center"
            />
          </View>
          <View style={{ rowGap: 8, width: '100%' }}>
            <View style={{ rowGap: 10 }}>
              <Text
                color="primary40"
                type="small_regular"
                text="Input your social media handle (Instagram/ TikTok)"
              />
              <View style={styles.socialsContainer}>
                <TextInput
                  value={socialMediaHandle}
                  onChangeText={setSocialMediaHandle}
                  placeholder="e.g., @yourusername"
                  style={{ padding: 12, flex: 1 }}
                />
                <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
                  <Text
                    color="primary40"
                    type="small_medium"
                    text={selectedPlatform || 'Select platform'}
                  />
                  <MaterialIcons
                    name={showPlatformDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="#051217"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.dropdownWrapper}>
              <Animated.View
                style={[
                  styles.dropdownOptions,
                  {
                    opacity: dropdownOpacity,
                    transform: [
                      { scaleY: dropdownScaleY },
                      {
                        translateY: dropdownAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                    // Ensure the dropdown is hidden when scaleY is 0 to prevent click-through
                    display: showPlatformDropdown ? 'flex' : 'none',
                  },
                ]}>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedPlatform('Instagram');
                    toggleDropdown();
                  }}>
                  <Text color="primary40" type="small_medium" text="Instagram" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedPlatform('TikTok');
                    toggleDropdown();
                  }}>
                  <Text color="primary40" type="small_medium" text="Tiktok" />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkbox} onPress={() => setAgreed(!agreed)}>
                {agreed ? (
                  <MaterialIcons name="check-box" size={20} color="#F4AB19" />
                ) : (
                  <MaterialIcons name="check-box-outline-blank" size={20} color="#051217" />
                )}
              </TouchableOpacity>
              <Text
                color="primary80"
                type="sub_regular"
                text="I agree to post my hamper on Instagram if I win, tagging @sweeftly_UK and using #SweeftlyEaster"
              />
            </View>
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
  modalButton: {
    backgroundColor: '#051217',
  },
  socialsContainer: {
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: '#D0D5DD',
    height: hp(48),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20
  },
  dropdown: {
    borderRadius: 5,
    borderColor: '#D0D5DD',
    height: hp(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: '#F9FAFB',
  },
  dropdownWrapper: {
    //minHeight: hp(96), // Reserve space for dropdown
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 999
  },
  dropdownOptions: {
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: '#D0D5DD',
    width: 86,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D0D5DD',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FDEED1',
    borderWidth: 0.5,
    borderColor: '#E4E7EC',
    borderRadius: 10,
    marginBottom: hp(150)
  },
  checkbox: {
    marginRight: 8,
  },
});

export default HampperModal;
