import { StyleSheet, View, Platform } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SelectUserTypeScreenProps } from 'app/navigation/types';
import { Screen, Text, Button } from 'app/design-system';
import { SelectUserType } from 'app/components';
import { wp } from 'app/resources/config';
import { UserOptions } from 'app/components/select-user-type/type';
import { BuyerSvg, VendorIconSvg } from 'app/assets/svg';
import { ProfileCircle } from 'iconsax-react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const CONTAINER_PADDING = wp(20);
const BORDER_RADIUS = wp(24);
const MARGIN_TOP = wp(40);
const CONTENT_MARGIN_TOP = wp(20);

const SelectUserTypeScreen = ({ navigation }: SelectUserTypeScreenProps) => {
  const [options, setOptions] = useState<UserOptions[]>([
    {
      id: 1,
      label: 'I am a buyer',
      isSelected: false,
      icon: <BuyerSvg />,
      description: 'Order fresh food items effortlessly.',
    },
    {
      id: 2,
      label: 'I am a retailer',
      isSelected: false,
      icon: <VendorIconSvg />,
      description: 'Sell more to customers.',
    },
  ]);

  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) });
  }, [headerOpacity]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const toggleSelection = useCallback((id: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        isSelected: option.id === id ? !option.isSelected : false,
      }))
    );
  }, []);

  const handleNextPress = useCallback(() => {
    const selectedOption = options.find((option) => option.isSelected);
    if (selectedOption?.id === 2) {
      navigation.navigate('VENDOR_REGISTRATION_SCREEN');
    } else if (selectedOption?.id === 1) {
      navigation.navigate('SEARCH_SCREEN');
    }
  }, [navigation, options]);

  const isNextButtonDisabled = !options.some((option) => option.isSelected);

  return (
    <Screen withBackBtn={false} pH={0}>
      <View style={styles.container}>
        <View style={styles.descriptionContainer}>
          {/* Icon and Title */}
          <Animated.View style={[styles.iconContainer, headerAnimatedStyle]}>
            <View style={styles.iconBackground}>
              <ProfileCircle size={24} color="#f4ab19" />
            </View>
            <Text
              type="headline_3_semibold"
              text="Fresh Food, your way"
              color="black"
            />
            <Text
              type="small_regular"
              text="Tell us who you are to personalize your"
              color="black"
            />
            <Text type="small_regular" text="experience" color="black" />
          </Animated.View>

          {/* User Type Options */}
          <View style={{ marginTop: CONTENT_MARGIN_TOP }}>
            <SelectUserType options={options} onToggle={toggleSelection} />
          </View>

          {/* Buttons */}
          <Animated.View style={styles.buttonContainer} entering={FadeIn.duration(600)}>
            <Button
              title="Next"
              onPress={handleNextPress}
              disabled={isNextButtonDisabled}
            />
            <Button
              variant="secondary"
              title="Back"
              onPress={() => navigation.goBack()}
            />
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
};

export default React.memo(SelectUserTypeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9ED',
    paddingHorizontal: CONTAINER_PADDING,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
  },
  descriptionContainer: {
    flex: 1,
    rowGap: 30,
    marginTop: MARGIN_TOP,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: '#FDEED1',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginBottom: 12,
  },
  buttonContainer: {
    rowGap: 15,
  },
});