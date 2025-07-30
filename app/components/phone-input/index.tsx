import React from 'react';
import { View, TextInput, Text, ViewStyle, TextStyle } from 'react-native';
import { Controller } from 'react-hook-form';
import { fs, hp, wp } from 'app/resources/config';
import useColors from 'app/hooks/useColors';

type PhoneInputProps = {
  name: string;
  control: any;
  rules?: object;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
};

const PhoneInput = ({
  name,
  control,
  rules = {},
  placeholder = '7123 456789',
  containerStyle,
  inputStyle,
}: PhoneInputProps) => {
  const { colors } = useColors();

  const containerBaseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: wp(12),
    height: hp(40),
  };

  const countryCodeStyle: ViewStyle = {
    paddingLeft: wp(16),
    paddingRight: wp(8),
    borderRightWidth: 1,
    borderColor: '#D0D5DD',
    justifyContent: 'center',
  };

  const inputBaseStyle: TextStyle = {
    flex: 1,
    height: hp(40),
    paddingHorizontal: wp(10),
  };

  // Helper for formatting phone with spaces
  const formatPhoneWithSpaces = (phone: string) => {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Format with a space after the first 4 digits
    if (digitsOnly.length > 4) {
      return `${digitsOnly.substring(0, 4)} ${digitsOnly.substring(4)}`;
    }
    
    return digitsOnly;
  };

  // Custom validation rules with better messages
  const enhancedRules = {
    ...rules,
    pattern: {
      value: /^7\d{9}$/,
      message: 'Please enter a valid UK mobile number starting with 7'
    },
    validate: {
      startsWithSeven: (value: string) => 
        value.startsWith('7') || 'UK mobile numbers should start with 7',
      ...((rules as any)?.validate || {})
    }
  };

  return (
    <View>
      <View style={[containerBaseStyle, containerStyle]}>
        <View style={countryCodeStyle}>
          <Text style={{ color: '#ADB6B9', fontSize: fs(12) }}>+44</Text>
        </View>
        <Controller
          control={control}
          name={name}
          rules={enhancedRules}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <TextInput
              placeholder={placeholder}
              style={[inputBaseStyle, inputStyle]}
              onBlur={onBlur}
              onChangeText={(text) => {
                // Only allow digits
                const digitsOnly = text.replace(/\D/g, '');
                
                // Format with spaces for better readability
                const formatted = formatPhoneWithSpaces(digitsOnly);
                
                // Store without spaces in the form value
                onChange(digitsOnly);
              }}
              value={formatPhoneWithSpaces(value || '')}
              keyboardType="number-pad"
              maxLength={11} // Allow for 10 digits plus one space
              placeholderTextColor="#ADB6B9"
            />
          )}
        />
      </View>
      <Controller
        control={control}
        name={name}
        render={({ fieldState: { error } }) => (
          <>
            {error && (
              <Text style={{ color: 'red', marginTop: 4, marginLeft: wp(16), fontSize: fs(10) }}>
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default PhoneInput;