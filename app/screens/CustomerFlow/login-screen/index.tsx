import { StyleSheet, View, Text as CustomText, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Button, Input, KeyboardWrapper, Screen, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { AppleIcon, GoogleIcon, PersonIcon } from 'app/assets/svg';
import { CustomerLoginScreenProps } from 'app/navigation/types';
import { useAuth } from 'app/hooks/api/use-auth';
import useAlert from 'app/hooks/useAlert';
import { LoaderModal } from 'app/modals';

const CustomerLoginScreen = ({ navigation, route }: CustomerLoginScreenProps) => {
  const { onAuthSuccess } = route.params || {};
  const { loginCustomer, isLoading } = useAuth();
  const { attentionAlert, errorAlert, successAlert } = useAlert();

  type FormData = {
    email: string;
    password: string;
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { email, password } = data;
      if (!email || !password) {
        attentionAlert('Email and password are required');
        return;
      }
      const result = await loginCustomer({
        email: email,
        password,
        successCallback: (accessToken: string) => {
          if (onAuthSuccess) {
            console.log('Passing accessToken to callback:', accessToken);
            onAuthSuccess(accessToken);
            navigation.reset({
              index: 0,
              routes: [{ name: 'CUSTOMERTABS', params: { screen: 'CUSTOMER_BASKET_SCREEN' } }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'CUSTOMERTABS', params: { screen: 'CUSTOMER_HOME_SCREEN' } }],
            });
          }
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      errorAlert('Login failed. Please check your credentials.');
    }
  };

  // Navigate back to Registration Screen
  const handleRegisterNavigation = () => {
    //@ts-ignore
    navigation.navigate(
      'CUSTOMER_REGISTER_SCREEN',

      { onAuthSuccess }
    );
  };

  return (
    <Screen>
      <KeyboardWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
            <LoaderModal isLoading={isLoading} />
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
                  keyboardType="email-address"
                />
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
                  style={{ color: 'blue', textDecorationLine: 'underline' }}
                  onPress={() => {
                    navigation.navigate('USER_FORGOT_PASSWORD_SCREEN');
                  }}
                />
              </View>
              <View style={[styles.gap, { marginTop: 10 }]}>
                <Button title="Login"  onPress={handleSubmit(onSubmit)} />
                <View style={{ width: '100%' }}>
                  <Text text="Or" align="center" />
                </View>

                <Pressable
                  onPress={handleRegisterNavigation}
                  style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#98A2B3' }} text="Don't have an account? " />
                  <Text text={'Sign Up'} type="sub_semibold" style={{ color: '#F4AB19' }} />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default CustomerLoginScreen;

const styles = StyleSheet.create({
  gap: {
    rowGap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
