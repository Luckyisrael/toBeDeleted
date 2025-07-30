import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Screen, Text, Button } from 'app/design-system';
import { SelectUserType } from 'app/components';
import { wp } from 'app/resources/config';
import { UserOptions } from 'app/components/select-user-type/type';
import { BuyerSvg, VendorIconSvg } from 'app/assets/svg';
import { ProfileCircle } from 'iconsax-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  FadeIn,
  SlideInUp,
  FadeInUp
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const SelectBusinessTypeScreen = () => {
    const navigation = useNavigation();
  const [options, setOptions] = useState<UserOptions[]>([
    {
      id: 1,
      label: 'Personal Account',
      isSelected: false,
      icon: <ProfileCircle size="29" color="#FF8A65"/>,
      description: "My shop is at home. I've no business license.",
    },
    {
      id: 2,
      label: 'Business Account',
      isSelected: false,
      icon: <ProfileCircle size="29" color="#FF8A65"/>,
      description: 'I am a registered business with a license.',
    },
  ]);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const buttonScale = useSharedValue(1);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    // Animate header and content on mount
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withTiming(0, { duration: 800 });
    contentTranslateY.value = withTiming(0, { duration: 600 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
      opacity: 1 - contentTranslateY.value / 50, // Fade in as it slides up
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const toggleSelection = (id: number) => {
    const updatedOptions = options.map((option) => ({
      ...option,
      isSelected: option.id === id ? !option.isSelected : false,
    }));
    setOptions(updatedOptions);
  };

  const handleNextPress = () => {
    const selectedOption = options.find((option) => option.isSelected);

    if (selectedOption?.id === 2) {
      navigation.navigate('BUSINESS_WITH_LICENSE');
    } else if (selectedOption?.id === 1) {
      navigation.navigate('VENDOR_SECURE_PAYOUT_SCREEN');
    }
  };

  const isNextButtonDisabled = !options.some((option) => option.isSelected);

  return (
    <Screen withBackBtn={false} pH={0}>
      <Animated.View 
        entering={FadeIn.duration(800)}
        style={styles.container}
      >
        <View style={styles.descriptionContainer}>
          {/* Icon and Title */}
          <Animated.View style={[styles.iconContainer, headerAnimatedStyle]}>
            <View style={styles.iconBackground}>
              <ProfileCircle size="24" color="#f4ab19" />
            </View>
            <Text type="headline_3_semibold" text="Select your type of business" color="black" />
            <Text
              type="small_regular"
              text="Tell us who you are to personalize your"
              color="black"
            />
            <Text type="small_regular" text="experience" color="black" />
          </Animated.View>

          {/* User Type Options */}
          <Animated.View style={[{ marginTop: wp(20) }, contentAnimatedStyle]}>
            <SelectUserType options={options} onToggle={toggleSelection} />
          </Animated.View>

          {/* Buttons */}
          <Animated.View 
            entering={FadeInUp.delay(1000)}
            style={[styles.buttonContainer]}
          >
            <Animated.View style={buttonAnimatedStyle}>
              <Button 
                title="Next" 
                onPress={handleNextPress} 
                disabled={isNextButtonDisabled} 
              />
            </Animated.View>
            <Button variant="secondary" title="Back" onPress={() => navigation.goBack()} />
          </Animated.View>
        </View>
      </Animated.View>
    </Screen>
  );
};

export default SelectBusinessTypeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9ED',
    paddingHorizontal: wp(20),
    borderTopLeftRadius: wp(24),
    borderTopRightRadius: wp(24),
    overflow: 'hidden',
  },
  descriptionContainer: {
    flex: 1,
    rowGap: 30,
    marginTop: wp(40),
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