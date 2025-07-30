import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button, Input, KeyboardWrapper, Screen, ScrollView, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { EMPTY_STRING } from 'app/utils/constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import useAlert from 'app/hooks/useAlert';
import { LoaderModal } from 'app/modals';
import useUserStore from 'app/store/use-user-store';

const EditProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { goBack } = useNavigation();
  const { errorAlert } = useAlert();
  const { userName, emailAddress, userAddress, phoneNumber, userId} = route.params;
  const { user, accessToken, setAccessToken, setUser } = useUserStore();

  const { userEditProfile, isProcessingLoading } = useUserProfileApi();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: userName,
      email: emailAddress,
      phoneNumber: phoneNumber,
    },
  });

  const onSave = async (formData) => {
    if (!accessToken) {
      navigation.navigate('CUSTOMER_LOGIN_SCREEN');
      return;
    }
  
    try {
      await userEditProfile({
        email: formData.email,
        address: formData.address,
        fullName: formData.fullName,
        
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
    <Screen bgColor='white'>
      <KeyboardWrapper>
        <View style={styles.container}>
          <LoaderModal isLoading={isProcessingLoading} />
          <Text text="Edit Profile" type='body_semibold' color='primary80'/>
          <Text text="Update your personal details to keep ypur account information accurate."  type='small_regular' color='primary40'/>
          <View style={{ flex: 1, marginTop: 15, rowGap: 15 }}>
            <View style={styles.gap}>
              <Text type='small_regular' color='primary40' text="Full name" />
              <Input
                placeholder={'Enter Your name'}
                name="fullName"
                type="text"
                control={control}
                rules={{
                  required: 'Full name is required',
                }}
                keyboardType="default"
              />
            </View>
            <View style={styles.gap}>
              <Text type='small_regular' color='primary40' text="Email address" />
              <Input
                placeholder={'Enter Your email'}
                name="email"
                type="text"
                control={control}
                rules={{
                  required: 'Email is required',
                }}
                editable={false}
                keyboardType="email-address"
                containerStyle={styles.disabledInput}
              />
            </View>
            <View style={styles.gap}>
              <Text type='small_regular' color='primary40' text="Phone number" />
              <Input
                placeholder={'Enter your phone number'}
                name="phoneNumber"
                type="text"
                control={control}
                rules={{
                  required: 'Phone numberis required',
                }}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Button onPress={handleSubmit(onSave)} title="Save edit" variant="secondary" />
        </View>
      </KeyboardWrapper>
    </Screen>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gap:{
    gap: 9
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});
