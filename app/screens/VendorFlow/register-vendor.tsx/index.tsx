import { StyleSheet, View, Pressable, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button, KeyboardWrapper, Text, Screen, Input, ScrollView } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { CustomerRegisterScreenProps } from 'app/navigation/types';
import { AppleIcon, GoogleIcon, LocationIcon, MessageIcon, PersonIcon } from 'app/assets/svg';
import useAlert from 'app/hooks/useAlert';
import { EMPTY_STRING } from 'app/utils/constants';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useVendorAuth } from 'app/hooks/api/vendor-api/use-vendor-auth';
import axios from 'axios';
import { PhoneInput, TimePicker } from 'app/components';
import dayjs from 'dayjs';
import { LoaderModal } from 'app/modals';

const VendorRegistrationScreen = ({ route, navigation }: CustomerRegisterScreenProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const { registerVendor, isLoading } = useVendorAuth();
  const { errorAlert, successAlert, attentionAlert } = useAlert();

  // Define the form data type
  type FormData = {
    companyName: string;
    email: string;
    address: string;
    password: string;
    coverPhoto: string;
    description: string;
    phoneNumber: string;
    postCode: string;
    openingTime: string;
    closingTime: string;
    accountNumber: string;
    sortCode: string;
    accountName: string;
    bankName: string;
    confirmPassword: string;
  };

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      companyName: EMPTY_STRING,
      email: EMPTY_STRING,
      address: EMPTY_STRING,
      password: EMPTY_STRING,
      coverPhoto: EMPTY_STRING,
      description: EMPTY_STRING,
      phoneNumber: EMPTY_STRING,
      postCode: EMPTY_STRING,
      openingTime: EMPTY_STRING,
      closingTime: EMPTY_STRING,
      accountNumber: EMPTY_STRING,
      sortCode: EMPTY_STRING,
      accountName: EMPTY_STRING,
      bankName: EMPTY_STRING,
      confirmPassword: EMPTY_STRING,
    },
  });

  const selectImage = async () => {
    // Request camera roll permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Sorry, we need camera roll permissions to select an image.'
      );
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageUri) {
      Alert.alert('No image selected', 'Please select an image first');
      return null;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      const fileType = imageUri.split('.').pop(); // Get the file extension
      formData.append('file', {
        uri: imageUri,
        type: `image/${fileType === 'png' ? 'png' : 'jpeg'}`, // Dynamically set type
        name: `upload.${fileType}`, // Dynamically set name
      } as any);
      formData.append('upload_preset', 'wkel6g2m'); // Replace with your Cloudinary upload preset

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dwxehgnfx/image/upload', // Replace with your Cloudinary URL
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          },
        }
      );

      const uploadedImageUrl = response.data.secure_url;
      setImageUrl(uploadedImageUrl);
      return uploadedImageUrl;
    } catch (error: any) {
      console.error('Error uploading image: ', error.response?.data || error.message);
      Alert.alert('Error uploading image');
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data: FormData) => {
    const { openingTime, closingTime, phoneNumber } = data;
    setUploading(true);
    try {
      // First upload the image and get the URL
      const uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        errorAlert('Image upload failed. Please try again.');
        return;
      }

      const formattedOpeningTime = dayjs(openingTime).format('HH:mm');
      const formattedClosingTime = dayjs(closingTime).format('HH:mm');

      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  
      const isValidUKMobile = /^7\d{9}$/.test(cleanedPhoneNumber);
      
      if (!isValidUKMobile) {
        attentionAlert('Please enter a valid UK mobile number starting with 7');
        return;
      }
      
      // Format the phone number with the international prefix
      const formattedPhone = `+44${cleanedPhoneNumber}`;
      console.log('Formatted UK number:', formattedPhone);

      // Combine data from route params and UI inputs
      const payload = {
        companyName: getValues('companyName'),
        email: getValues('email').toLowerCase(),
        address: getValues('address'),
        password: getValues('password'),
        description: getValues('description'),
        phoneNumber: formattedPhone,
        coverPhoto: uploadedImageUrl,
        postCode: getValues('postCode'),
        openingTime: formattedOpeningTime,
        closingTime: formattedClosingTime,
      };

      // Log the data being sent to the API
      console.log('Data being sent to the API:', payload);

      const response = await registerVendor({
        ...payload,
        successCallback: (response) => {
          console.log('the response in callback: ', response);
          const userId = response.userData.id;
          navigation.navigate('VENDOR_EMAIL_VERIFICATION_SCREEN', { userId });
        },
      });
    } catch (error) {
      setUploading(false);
      console.error('Registration failed:', error);
      errorAlert('Registration failed. Please try again.');
    }
  };
  return (
    <Screen>
      <KeyboardWrapper>
        <ScrollView>
          <View style={{ flex: 1, rowGap: 20 }}>
            <LoaderModal isLoading={uploading || isLoading} />
            <View style={{ rowGap: 5 }}>
              <Text type="headline_3_semibold" text="Create a new account" />
              <Text
                type="small_regular"
                color="primary40"
                text="Register today and access the best vendors near you."
              />
            </View>
            <View style={[styles.gap]}>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Upload Image" />

                <View style={{ flexDirection: 'row', columnGap: 15, alignItems: 'center' }}>
                  {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

                  <TouchableOpacity style={styles.button} onPress={selectImage}>
                    <Text text="Upload Image" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Company Name" />
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
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Description" />
                <Input
                  placeholder={'Enter company description'}
                  name="description"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Company name is required',
                  }}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
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
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Address" />
                <Input
                  placeholder={'Enter Your address'}
                  name="address"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      message: 'Invalid email address',
                    },
                  }}
                  keyboardType="email-address"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Phone Number" />
                <PhoneInput
                  name="phoneNumber"
                  control={control}
                  rules={{ required: 'Phone number is required' }}
                  placeholder="7123456789"
                />
                
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Post Code" />
                <Input
                  placeholder={'Enter Your Postcode'}
                  name="postCode"
                  type="text"
                  control={control}
                  rules={{
                    required: 'Postcode is required',
                  }}
                  keyboardType="default"
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ rowGap: 5 }}>
                  <Text type="body_regular" color="primary80" text="Opening Time" />
                  <TimePicker
                    name="openingTime"
                    control={control}
                    placeholder="8:00"
                    rules={{ required: 'Opening time is required' }}
                  />
                </View>
                <View style={{ rowGap: 5 }}>
                  <Text type="body_regular" color="primary80" text="Closing Time" />
                  <TimePicker
                    name="closingTime"
                    control={control}
                    placeholder="18:00"
                    rules={{ required: 'Closing time is required' }}
                  />
                </View>
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Password" />
                <Input
                  placeholder={'Enter password'}
                  name="password"
                  type="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                  }}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Confirm Password" />
                <Input
                  placeholder={'Confirm password'}
                  name="confirmPassword"
                  type="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                  }}
                  keyboardType="default"
                />
              </View>
            </View>
          </View>

          <Pressable onPress={toggleCheckbox} style={styles.checkboxContainer}>
            {isChecked ? (
              <AntDesign name="checksquare" size={12} color="black" />
            ) : (
              <AntDesign name="checksquareo" size={12} color="black" />
            )}
            <Text
              type="sub_regular"
              text="By checking this box you confirm that you have read, understood, and agree to sweefftly, Terms and Conditions and Privacy Policy"
            />
          </Pressable>

          <View style={[styles.gap, { marginTop: 30 }]}>
            <Button
              title="Proceed"
              disabled={!isChecked || uploading}
              onPress={handleSubmit(onSubmit)}
            />
            {/**<View style={{ width: '100%' }}>
              <Text text="Or" align="center" />
            </View>
            <Button
              title="Continue with Google"
              variant="secondary"
              leftIcon={<GoogleIcon />}
              containerStyle={{ borderColor: '#CED3D5' }}
            />
            <Button
              title="Continue with Apple"
              variant="secondary"
              leftIcon={<AppleIcon />}
              containerStyle={{ borderColor: '#CED3D5' }}
            />
            <Button
              title="Continue as Guest"
              variant="secondary"
              leftIcon={<PersonIcon />}
              containerStyle={{ borderColor: '#CED3D5' }}
            /> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{ color: '#98A2B3' }} text="Already have an account? " />
              <Text
                text={'Login'}
                type="sub_semibold"
                style={{ color: '#F4AB19' }}
                onPress={() => {
                  navigation.navigate('VENDOR_LOGIN_SCREEN');
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default VendorRegistrationScreen;

const styles = StyleSheet.create({
  gap: {
    rowGap: 20,
  },
  scrollContainer: {
    //flexGrow: 1,
    paddingBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 10,
    width: 100,
    height: 40,
    borderWidth: 0.5,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
