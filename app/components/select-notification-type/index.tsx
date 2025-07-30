import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useCallback, memo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { Text } from 'app/design-system';
import { fs, hp, wp } from 'app/resources/config';

interface NotificationOption {
  id: number;
  label: string;
  description: string;
  isSelected: boolean;
  isRecommended?: boolean;
}

interface NotificationProps {
  options: NotificationOption[];
  onToggle: (id: number) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SelectNotificationType: React.FC<NotificationProps> = ({ options, onToggle }) => {
  const entranceDelay = 300;

  // Render option
  const renderOption = useCallback(
    (option: NotificationOption, index: number) => {
      const selectionScale = useSharedValue(1);
      const borderWidth = useSharedValue(option.isSelected ? 1 : 0);
      const backgroundColor = useSharedValue(
        option.isSelected ? 'rgba(244, 171, 25, 0.05)' : 'white'
      );

      // Pulse animation for selection
      const pulseAnimation = () => {
        selectionScale.value = withSequence(
          withTiming(1.03, { duration: 150 }),
          withTiming(1, { duration: 150 })
        );
      };

      // Update animations on selection change
      useEffect(() => {
        borderWidth.value = withTiming(option.isSelected ? 1 : 0, { duration: 200 });
        backgroundColor.value = withTiming(
          option.isSelected ? 'rgba(244, 171, 25, 0.05)' : 'white',
          { duration: 300 }
        );
        if (option.isSelected) {
          pulseAnimation();
        }
      }, [option.isSelected, borderWidth, backgroundColor, selectionScale]);

      const animatedStyle = useAnimatedStyle(() => ({
        borderWidth: borderWidth.value,
        backgroundColor: backgroundColor.value,
      }));

      const touchableAnimatedStyle = useAnimatedStyle(() => ({
        transform: option.isSelected ? [{ scale: selectionScale.value }] : [],
      }));

      return (
        <Animated.View
          key={option.id}
          entering={FadeInDown.delay(index * entranceDelay).springify()}
        >
          <AnimatedTouchableOpacity
            style={[
              styles.optionContainer,
              { borderColor: option.isSelected ? '#F4AB19' : '#98A2B3' },
              animatedStyle,
              touchableAnimatedStyle,
            ]}
            onPress={() => onToggle(option.id)}
          >
            <View style={styles.recommended}>
              <Text type="body_medium" text={option.label} color="black" />
              {option.isRecommended && (
                <Animated.View entering={ZoomIn.delay(800 + index * entranceDelay)}>
                  <Text
                    type="small_semibold"
                    text="Recommended"
                    color="green"
                    style={{
                      fontSize: fs(8),
                      backgroundColor: '#EBFFEE',
                      paddingVertical: 4,
                      paddingHorizontal: 6,
                      borderRadius: 34,
                    }}
                  />
                </Animated.View>
              )}
            </View>
            <Text type="small_regular" text={option.description} color="primary40" />
          </AnimatedTouchableOpacity>
        </Animated.View>
      );
    },
    [onToggle]
  );

  return <View style={styles.container}>{options.map(renderOption)}</View>;
};

export default memo(SelectNotificationType);

const styles = StyleSheet.create({
  container: {
    rowGap: 15,
  },
  optionContainer: {
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: hp(16),
    paddingVertical: hp(10),
    borderRadius: wp(12),
    borderColor: '#98A2B3',
    columnGap: 8
  },
  recommended: {
    flexDirection: 'row',
    columnGap: 10,
  },
});