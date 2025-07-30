import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import { Button, Input, KeyboardWrapper, Screen, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import { LoaderModal } from 'app/modals';
import useAlert from 'app/hooks/useAlert';

const VendorEditProfileScreen = () => {
  const { goBack } = useNavigation();
  const route = useRoute();
  const { companyName, coverPhoto, email, description, phoneNumber, address, vendorId } =
    route.params;

  const { vendorEditProfile, isProcessingLoading } = useVendorApi();
  const { errorAlert } = useAlert();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: companyName,
      email: email,
      address: address,
      coverPhoto: coverPhoto,
      description: description,
      phoneNumber: phoneNumber,
    },
  });

  const onSave = async (formData) => {
    try {
      await vendorEditProfile({
        companyName: formData.companyName,
        email: formData.email,
        address: formData.address,
        description: formData.description,
        phoneNumber: formData.phoneNumber,
        coverPhoto: formData.coverPhoto,
        userId: vendorId,
        successCallback: () => {
          goBack();
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      errorAlert('Updating profile failed. Please try again');
    }
  };

  return (
    <Screen bgColor="white">
      <KeyboardWrapper>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <LoaderModal isLoading={isProcessingLoading} />
          <View style={styles.container}>
            <Text text="Edit Profile" type="body_semibold" color="primary80" />
            <Text
              text="Update your personal details to keep your account information accurate."
              type="small_regular"
              color="primary40"
            />

            <View style={styles.formContainer}>
              <View style={styles.gap}>
                <Text type="small_regular" color="primary40" text="Company Name" />
                <Input
                  placeholder={'Enter company name'}
                  name="companyName"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Company name is required',
                  }}
                  keyboardType="default"
                />
              </View>

              <View style={styles.gap}>
                <Text type="small_regular" color="primary40" text="Email address" />
                <Input
                  placeholder={'Enter Your email'}
                  name="email"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Email is required',
                  }}
                  keyboardType="email-address"
                  editable={false}
                  containerStyle={styles.disabledInput}
                />
              </View>

              <View style={styles.gap}>
                <Text type="small_regular" color="primary40" text="Phone number" />
                <Input
                  placeholder={'Enter your phone number'}
                  name="phoneNumber"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                  }}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.gap}>
                <Text type="small_regular" color="primary40" text="Address" />
                <Input
                  placeholder={'Enter your address'}
                  name="address"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Address is required',
                  }}
                  keyboardType="default"
                />
              </View>

              <View style={styles.gap}>
                <Text type="small_regular" color="primary40" text="Description" />
                <Input
                  placeholder={'Enter company description'}
                  name="description"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Description is required',
                  }}
                  keyboardType="default"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <Button
              onPress={handleSubmit(onSave)}
              title="Save edit"
              variant="secondary"
              containerStyle={styles.submitButton}
              disabled={isProcessingLoading}
            />
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default VendorEditProfileScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    marginTop: 15,
    rowGap: 15,
  },
  gap: {
    gap: 9,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    marginTop: 30,
  },
});
