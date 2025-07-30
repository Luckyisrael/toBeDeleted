import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button, Input, Screen, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { useVendorAuth } from 'app/hooks/api/vendor-api/use-vendor-auth';
import { useNavigation } from '@react-navigation/native';
import useAlert from 'app/hooks/useAlert';

const UserForgotPassword = () => {
    const { navigate } = useNavigation();
    const { vendorForgotPassword, isLoading } = useVendorAuth();
    const { errorAlert } = useAlert();
  
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        email: '',
        password: '',
      },
    });
  
    const onForgotPassword = async (data: { email: string;  }) => {
      try {
        const { email } = data;
        const userEmail = email.toLowerCase();
        await vendorForgotPassword({
          email: userEmail,
          successCallback: (response) => {
            // Extract userId from the response
            console.log('the respose in callback: ', response)
            const userId = response.user;
    
            // Navigate to the next screen and pass the userId
            navigate('USER_VERIFY_FORGOT_PASSWORD_EMAIL', { userId });
          },
        });
      } catch (error) {
        console.error('Forgot password failed:', error);
        errorAlert('Error resetting your password');
      }
    };
  
  return (
    <Screen>
      <View style={styles.container}>
        <View style={{ rowGap: 5 }}>
          <Text type="headline_3_semibold" text="Forgot your password?" />
          <Text
            type="small_regular"
            color="primary40"
            text="enter your email and we will send you a link to reset your password"
          />
        </View>
        <View style={{ rowGap: 10 }}>
          <Text type="body_regular" color="primary80" text="Email Address" />
          <Input
            placeholder={'Enter Your email'}
            name="email"
            type="text"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            keyboardType="email-address"
          />
        </View>
        <Button title='Send link' isLoading={isLoading} onPress={handleSubmit(onForgotPassword)} />
      </View>
    </Screen>
  );
};

export default UserForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 28
  },
});
