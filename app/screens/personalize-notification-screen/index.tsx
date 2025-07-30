import { StyleSheet, View, Platform } from 'react-native';
import React, { useEffect, useState, useCallback, memo } from 'react';
import { Button, Screen, Text } from 'app/design-system';
import { SelectNotificationType } from 'app/components';
import { wp } from 'app/resources/config';
import { PersonalizeNotificationScreenProps } from 'app/navigation/types';
import { NotificationOptions } from 'app/components/select-notification-type/types';
import { Notification } from 'iconsax-react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const CONTAINER_PADDING = wp(20);
const BORDER_RADIUS = wp(24);
const MARGIN_TOP = wp(40);

const PersonalizeNotification = ({
  navigation: { navigate },
}: PersonalizeNotificationScreenProps) => {
  const [options, setOptions] = useState<NotificationOptions[]>([
    {
      id: 1,
      label: 'Orders + Deals',
      description: 'Get order update, discount & offers',
      isSelected: false,
      isRecommended: true,
    },
    {
      id: 2,
      label: 'Orders only',
      description: 'Just updates on your orders',
      isSelected: false,
      isRecommended: false,
    },
  ]);

  const toggleSelection = useCallback((id: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        isSelected: option.id === id ? !option.isSelected : false,
      }))
    );
  }, []);

  const isNextButtonDisabled = !options.some((option) => option.isSelected);

  const scaleValue = useSharedValue(1);

  useEffect(() => {
    scaleValue.value = withTiming(
      1.05,
      { duration: 1000, easing: Easing.inOut(Easing.ease) },
      () => {
        scaleValue.value = withTiming(1, { duration: 1000 });
      }
    );
  }, [scaleValue]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Screen withBackBtn={false} pH={0}>
      <View style={styles.container}>
        <View style={styles.descriptionContainer}>
          {/* Notification Icon and Title */}
          <View style={styles.iconContainer}>
            <Animated.View style={[styles.iconBackground, iconAnimatedStyle]}>
              <Notification size={24} color="#f4ab19" />
            </Animated.View>
            <Text
              type="headline_3_semibold"
              text="Stay Updated!"
              color="black"
            />
            <Text
              type="small_regular"
              text="Choose how you'd like to receive"
              color="black"
            />
            <Text
              type="small_regular"
              text="notifications to stay informed"
              color="black"
            />
          </View>

          {/* Notification Options */}
          <SelectNotificationType options={options} onToggle={toggleSelection} />

          {/* Buttons */}
          <Animated.View style={styles.buttonContainer} entering={FadeIn}>
            <Button
              title="Continue"
              onPress={() => navigate('SELECT_USER_TYPE_SCREEN')}
              disabled={isNextButtonDisabled}
            />
            <Button
              variant="secondary"
              title="Back"
              onPress={() => navigate('WELCOME_SCREEN')}
            />
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
};

export default memo(PersonalizeNotification);

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