import { StyleSheet, View, Text as CustomText, ScrollView } from 'react-native';
import React from 'react';
import { Button, Input, KeyboardWrapper, Screen, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { AppleIcon, GoogleIcon, PersonIcon } from 'app/assets/svg';
import { useNavigation } from '@react-navigation/native';
import { useVendorAuth } from 'app/hooks/api/vendor-api/use-vendor-auth';
import useAlert from 'app/hooks/useAlert';
import { LoaderModal } from 'app/modals';

const VendorLoginScreen = () => {
  const { navigate } = useNavigation();
  const { vendorLogin, isLoading } = useVendorAuth();
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

  const onLogin = async (data: { email: string; password: string }) => {
    try {
      const { email, password } = data;
      const userEmail = email.toLowerCase();
      await vendorLogin({
        email: userEmail,
        password,
        successCallback: () => {},
      });
    } catch (error) {
      console.error('Login failed:', error);
      errorAlert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Screen>
      <KeyboardWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
            <LoaderModal isLoading={isLoading}/>
          <View style={{ flex: 1, rowGap: 20 }}>
            <View style={{ rowGap: 5 }}>
              <Text type="headline_3_semibold" text="Login to your account" />
              <Text
                type="small_regular"
                color="primary40"
                text="Welcome back, sign in to your account"
              />
            </View>
            <View style={styles.gap}>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Email Address" />
                <Input
                  placeholder={'Enter email address'}
                  name="email"
                  type="text"
                  control={control}
                  //rules={VALIDATION.FIRST_NAME_INPUT_VALIDATION}
                  keyboardType="email-address"
                />
                {errors.email && <Text text={errors.email.message} color="error1" />}
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Password" />
                <Input
                  placeholder={'Enter Password'}
                  name="password"
                  type="password"
                  control={control}
                />
                <Text
                  text="Reset your password"
                  color="primary80"
                  type="display_1_medium"
                  align="right"
                  style={{ color: 'blue', textDecorationLine: 'underline'}}
                  onPress={()=>{navigate('VENDOR_FORGOT_PASSWORD_SCREEN')}}
                />
              </View>
              <View style={[styles.gap, { marginTop: 10 }]}>
                <Button
                  title="Login"
                  disabled={isLoading}
                  onPress={handleSubmit(onLogin)}
              
                />
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#98A2B3' }} text="Don't have an account? " />
                  <Text text={'Sign Up'} type="sub_semibold" style={{ color: '#F4AB19' }} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default VendorLoginScreen;

const styles = StyleSheet.create({
  gap: {
    rowGap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
