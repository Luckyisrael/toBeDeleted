import useColors from 'app/hooks/useColors';
import { hp, wp } from 'app/resources/config';
import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  View,
} from 'react-native';
import Text from '../Text';
import { triggerHaptic, HapticFeedbackType } from 'app/utils/haptics';


type ButtonVariant = 'primary' | 'secondary';

interface CustomButtonProps {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: any;
  rightIcon?: any;
  withHaptics?: boolean;
}

const Button = ({
  title,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onPress,
  containerStyle,
  textStyle,
  leftIcon,
  rightIcon,
  withHaptics = true,
}: CustomButtonProps) => {
  const { colors } = useColors();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: wp(24),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      columnGap: 10,
      paddingVertical: hp(16),
      paddingHorizontal: wp(20),
    };

    if (disabled) {
      return variant === 'primary'
        ? { ...baseStyle, backgroundColor: '#849296' }
        : { ...baseStyle, borderWidth: 1, borderColor: 'rgba(7, 12, 7, 0.04)' };
    }

    return variant === 'primary'
      ? { ...baseStyle, backgroundColor: '#324950' }
      : { ...baseStyle, borderWidth: 1, borderColor: '#051217' };
  };

  const getTextStyle = (): TextStyle => {
    if (disabled) {
      return variant === 'primary' ? { color: 'rgba(255, 255, 255, 0.7)' } : { color: '#000000' };
    }
    return variant === 'primary' ? { color: 'white' } : { color: colors.grey400 };
  };

  const handlePress = async (event: GestureResponderEvent) => {
    if (!isLoading && !disabled && withHaptics) {
      await triggerHaptic(HapticFeedbackType.Light); 
    }
    if (onPress) onPress(event);
  };

  return (
    <Pressable
      style={[getButtonStyle(), containerStyle]}
      onPress={handlePress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : 'green'} size="large" />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {leftIcon ? <View>{leftIcon}</View> : <View style={{ width: 24 }} />}
          <Text
            type={'body_bold'}
            color={variant === 'primary' ? 'white' : 'black'}
            text={title}
            align="center"
          />
          {rightIcon ? <View>{rightIcon}</View> : <View style={{ width: 24 }} />}
        </View>
      )}
    </Pressable>
  );
};

export default Button;