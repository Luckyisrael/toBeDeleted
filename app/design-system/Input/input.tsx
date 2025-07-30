import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, ViewStyle, TextStyle, Text, StyleSheet } from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { Controller } from 'react-hook-form';
import { CustomInputProps } from './types';
import { fs, hp, wp } from 'app/resources/config';
import useColors from 'app/hooks/useColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: wp(12),
    padding: wp(16),
    height: hp(40),
  },
  input: {
    flex: 1,
    height: hp(40),
    backgroundColor: 'transparent',
  },
  toggleButton: {
    alignItems: 'flex-end',
    width: 20,
  },
  leftIconContainer: {
    marginRight: wp(8),
    width: wp(20),
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: wp(16),
    fontSize: fs(10),
  },
});

const PasswordToggle = React.memo(({ isPasswordVisible, togglePasswordVisibility, color }: { isPasswordVisible: boolean; togglePasswordVisibility: () => void; color: string }) => (
  <TouchableOpacity style={styles.toggleButton} onPress={togglePasswordVisibility}>
    {isPasswordVisible ? (
      <EyeSlash color={color} size={18} variant="Bold" />
    ) : (
      <Eye color={color} size={18} variant="Bold" />
    )}
  </TouchableOpacity>
));

const Input = ({
  type = 'text',
  containerStyle,
  inputStyle,
  placeholder,
  name,
  control,
  rules = {},
  leftIcon,
  ...rest
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { colors } = useColors();

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
    <View>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <View style={[styles.container, containerStyle]}>
              {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
              <TextInput
                {...rest}
                placeholder={placeholder}
                secureTextEntry={type === 'password' && !isPasswordVisible}
                style={[styles.input, inputStyle]}
                onFocus={(e) => {
                  setIsFocused(true);
                  rest.onFocus?.(e);
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                  onBlur();
                  rest.onBlur?.(e);
                }}
                onChangeText={(text) => {
                  onChange(text);
                  rest.onChangeText?.(text);
                }}
                value={value}
                placeholderTextColor={'#ADB6B9'}
              />
              {type === 'password' && (
                <PasswordToggle
                  isPasswordVisible={isPasswordVisible}
                  togglePasswordVisibility={togglePasswordVisibility}
                  color={colors.grey2}
                />
              )}
            </View>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
};

export default React.memo(Input);