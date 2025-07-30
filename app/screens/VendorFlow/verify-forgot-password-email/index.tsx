import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Screen, Text } from 'app/design-system';
import { useVendorAuth } from 'app/hooks/api/vendor-api/use-vendor-auth';
import useAlert from 'app/hooks/useAlert';
import { fs } from 'app/resources/config';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const VerifyVendorForgotPasswordEmail = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill('')); 
  const isCodeComplete = code.every((digit) => digit !== ''); 

  const route = useRoute()
  const { navigate } = useNavigation()
  const { verifyEmail, isLoading, } = useVendorAuth()
  const { errorAlert } = useAlert()

  const { userId } = route.params;
  console.log('response from registration: ', userId)

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus to the next input
    if (text && index < 5) {
      // @ts-ignore - focus the next input
      inputsRef.current[index + 1]?.focus();
    }
  };

  const inputsRef = React.useRef<Array<TextInput | null>>([]);

  const onVerify = async () => {
    try {
      // Combine the code array into a single string
      const otp = code.join('');

      // Log the data being sent to the API
      console.log('Data being sent to the API:', { userId, otp });

      // Make the API call
      await verifyEmail({
        userId: userId,
        otp: otp, // Send the combined OTP string
        successCallback: () => {
          navigate('VENDOR_CHANGE_PASSWORD_SCREEN', { userId });
        },
      });
    } catch (error) {
      console.error('Verification failed:', error);
      errorAlert('Verification failed. Please check the OTP and try again.');
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={styles.codeContainer}>
          <View style={{ rowGap: 5 }}>
            <Text type="headline_3_semibold" text="Verify your email" />
            <Text
              type="small_regular"
              color="primary40"
              text="We have sent a six digit code to your email. Enter the code below to verify your account."
            />
          </View>

          <View style={styles.inputsContainer}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  style={styles.input}
                  maxLength={1}
                  keyboardType="numeric"
                  value={code[index]}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
                      // @ts-ignore - focus the previous input on backspace
                      inputsRef.current[index - 1]?.focus();
                    }
                  }}
                />
              ))}
          </View>
        </Animated.View>

        <Button
          title="Verify Email"
          disabled={!isCodeComplete}
          isLoading={isLoading}
          onPress={onVerify}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#98A2B3' }} text="Didn't get the code? " />
          <Text text={'Resend OTP'} type="sub_semibold" style={{ color: '#F4AB19' }} />
        </View>
      </View>
    </Screen>
  );
};

export default VerifyVendorForgotPasswordEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 32,
  },
  codeContainer: {
    rowGap: 32,
  },

  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 51,
    height: 51,
    borderWidth: 0.5,
    borderColor: '#455A64',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: fs(16),
    fontWeight: 'bold',
  },
});
