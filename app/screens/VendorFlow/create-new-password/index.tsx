import { StyleSheet, View, Text as CustomText, ScrollView } from 'react-native';
import React from 'react';
import { Button, Input, KeyboardWrapper, Screen, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { AppleIcon, GoogleIcon, PersonIcon } from 'app/assets/svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVendorAuth } from 'app/hooks/api/vendor-api/use-vendor-auth';
import useAlert from 'app/hooks/useAlert';
import { LoaderModal } from 'app/modals';

const VendorCreateNewPassword = () => {
  const { navigate } = useNavigation();
  const { vendorChangePassword, isLoading } = useVendorAuth();
  const { errorAlert } = useAlert();

  const route = useRoute();

  const { userId } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onChangePassword = async (data: { password: string, confirmPassword: string }) => {
    try {
      const { password, confirmPassword } = data;

      await vendorChangePassword({
        newpass: password,
        ref: 'A',
        userId: userId,
        successCallback: () => {
          navigate('VENDOR_LOGIN_SCREEN');
        },
      });
    } catch (error) {
      console.error('Chaning password:', error);
      errorAlert('Changing password failed. Please try again');
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
              <Text type="headline_3_semibold" text="Create a new password" />
              <Text
                type="small_regular"
                color="primary40"
                text="Enter a new password to secure your account."
              />
            </View>
            <View style={styles.gap}>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Enter Password" />
                <Input
                  placeholder={'Enter Password'}
                  name="password"
                  type="password"
                  control={control}
                />
                
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Confirm Password" />
                <Input
                  placeholder={'Confirm Password'}
                  name="confirmPassword"
                  type="password"
                  control={control}
                />
              </View>
              <View style={[styles.gap, { marginTop: 10 }]}>
                <Button
                  title="Reset Password"
                  disabled={isLoading}
                  onPress={handleSubmit(onChangePassword)}
                  
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default VendorCreateNewPassword;

const styles = StyleSheet.create({
  gap: {
    rowGap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
