import { StyleSheet, View, Text as CustomText, ScrollView } from 'react-native';
import React from 'react';
import { Button, Input, KeyboardWrapper, Screen, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { AppleIcon, GoogleIcon, PersonIcon } from 'app/assets/svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVendorAuth } from 'app/hooks/api/vendor-api/use-vendor-auth';
import useAlert from 'app/hooks/useAlert';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import { LoaderModal } from 'app/modals';
import useVendorStore from 'app/store/use-vendor-store';

const VendorChangePassword = () => {
  const { navigate, goBack } = useNavigation();
  const { vendorUpdatePassword, isProcessingLoading } = useVendorApi();
  const { errorAlert } = useAlert();

  const { vendor } = useVendorStore()

  const { vendorId } = vendor;  
  console.log('the vendor details :', vendorId)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onChangePassword = async (data: { currentPassword: string, newPassword: string }) => {
    try {
      const { currentPassword, newPassword } = data;

      await vendorUpdatePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        userId: vendorId,
        successCallback: () => {
          goBack();
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
            <LoaderModal isLoading={isProcessingLoading} />
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
                <Text type="body_regular" color="primary80" text="Enter Old Password" />
                <Input
                  placeholder={'Enter Old Password'}
                  name="currentPassword"
                  type="password"
                  control={control}
                />
                
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Enter new Password" />
                <Input
                  placeholder={'Enter new Password'}
                  name="newPassword"
                  type="password"
                  control={control}
                />
              </View>
              <View style={[styles.gap, { marginTop: 10 }]}>
                <Button
                  title="Update Password"
                  disabled={isProcessingLoading}
                  onPress={handleSubmit(onChangePassword)}
                  isLoading={isProcessingLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default VendorChangePassword;

const styles = StyleSheet.create({
  gap: {
    rowGap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
