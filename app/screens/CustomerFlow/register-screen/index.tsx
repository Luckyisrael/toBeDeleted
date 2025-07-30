import { StyleSheet, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, KeyboardWrapper, Text, Screen, Input } from 'app/design-system';
import { Controller, useForm } from 'react-hook-form';
import { CustomerRegisterScreenProps } from 'app/navigation/types';
import { useAuth } from 'app/hooks/api/use-auth';
import useAlert from 'app/hooks/useAlert';
import useAddressStore from 'app/store/use-address-store';
import { AppleIcon, GoogleIcon, PersonIcon } from 'app/assets/svg';
import { useShippingAddressStore } from 'app/store/shippingAddress';
import { LoaderModal } from 'app/modals';
import { CheckBox } from 'react-native-btr';
import { hp, wp } from 'app/resources/config';
import { PhoneInput } from 'app/components';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { EMPTY_STRING } from 'app/utils/constants';

type GooglePlacesAutocompleteRef = {
  setAddressText: (text: string) => void;
  getAddressText: () => string;
};

type CustomerRegisterScreenProps = {
  route: any;
  navigation: any;
};

const CustomerRegistrationScreen = ({ route, navigation }: CustomerRegisterScreenProps) => {
  const { onAuthSuccess } = route.params || {};
  const { registerCustomer, isLoading } = useAuth();
  const { errorAlert, attentionAlert } = useAlert();

  type FormData = {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    postCode: string;
    password: string;
    confirmPassword: string;
    agreement: boolean;
  };

  const [currentSection, setCurrentSection] = useState(1);
  const [showAddressConfirm, setShowAddressConfirm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [userInputPostcode, setUserInputPostcode] = useState<string>(''); // Track user-entered postcode
  const [loading, setLoading] = useState(false); // Add loading state for visibility
  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null); // Ref for autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ description: string; place_id: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: EMPTY_STRING,
      email: EMPTY_STRING,
      phoneNumber: EMPTY_STRING,
      address: EMPTY_STRING,
      postCode: EMPTY_STRING,
      password: EMPTY_STRING,
      confirmPassword: EMPTY_STRING,
      agreement: false,
    },
  });

  // Add useEffect to reset specific fields when changing sections
  useEffect(() => {
    if (currentSection === 2) {
      setValue('postCode', '', { shouldValidate: false });
      setUserInputPostcode('');
    } else if (currentSection === 3) {
      setValue('password', '', { shouldValidate: false });
      setValue('confirmPassword', '', { shouldValidate: false });
    }
  }, [currentSection, setValue]);

  useEffect(() => {
    // Function to manually fetch place predictions
    const fetchAddressPredictions = async () => {
      if (userInputPostcode.length >= 3) {
        try {
          setLoading(true);
          const apiKey = 'AIzaSyDN6s9y6WezcKzlz6cPp1hu8SlJ1AcYScs';
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${userInputPostcode}&components=country:gb&key=${apiKey}`
          );

          const data = await response.json();
          if (data.predictions) {
            setAddressSuggestions(data.predictions);
            setShowSuggestions(true);
          } else {
            setAddressSuggestions([]);
          }
        } catch (error) {
          console.error('Error fetching address predictions:', error);
          setAddressSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Set up a debounce timer for the API call
    const debounceTimer = setTimeout(() => {
      if (userInputPostcode.length >= 3) {
        fetchAddressPredictions();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [userInputPostcode]);

  // UK postcode regex for validation
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

  // Handle address selection from Google Places Autocomplete
  const handleAddressSelect = async (data: any, details: any = null) => {
    setLoading(true);
    setShowSuggestions(false);

    try {
      let addressDetails = details;

      // If details aren't provided, fetch them using place_id
      if (!details && data.place_id) {
        const apiKey = 'AIzaSyDN6s9y6WezcKzlz6cPp1hu8SlJ1AcYScs';
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.place_id}&key=${apiKey}`
        );
        const result = await response.json();
        if (result.result) {
          addressDetails = result.result;
        }
      }

      const formattedAddress = addressDetails?.formatted_address || data.description;
      setSelectedAddress(formattedAddress);
      setValue('address', formattedAddress, { shouldValidate: true });
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual address entry
  const handleManualAddress = () => {
    setSelectedAddress(null);
    setValue('address', '', { shouldValidate: false });
  };

  const handlePostcodeChange = (text: string) => {
    setValue('postCode', text, { shouldValidate: true });
    setUserInputPostcode(text);
    setLoading(text.length >= 3);

    if (text.length >= 3) {
      setShowSuggestions(true);
      if (autocompleteRef.current) {
        autocompleteRef.current.setAddressText(text);
      }
    } else {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { fullName, email, phoneNumber, address, password, confirmPassword, postCode } = data;

      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

      const isValidUKMobile = /^7\d{9}$/.test(cleanedPhoneNumber);

      if (!isValidUKMobile) {
        attentionAlert('Please enter a valid UK mobile number starting with 7');
        return;
      }

      // Format the phone number with the international prefix
      const formattedPhone = `+44${cleanedPhoneNumber}`;
      console.log(
        'registration deets: ',
        fullName, '||',
        email, '||',
        address, '||',
        postCode, '||',
        formattedPhone, '||',
        password
      );
      await registerCustomer({
        fullName,
        email,
        address,
        postCode,
        phoneNumber: formattedPhone,
        password,
        successCallback: (accessToken: string) => {
          if (onAuthSuccess) {
            onAuthSuccess(accessToken);
          }
          navigation.goBack();
        },
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleContinue = async () => {
    const fieldsToValidate = {
      1: ['fullName', 'email', 'agreement'],
      2: ['phoneNumber', 'postCode', 'address'],
      3: ['password', 'confirmPassword'],
    };

    const isValid = await trigger(fieldsToValidate[currentSection]);
    if (isValid) {
      if (currentSection === 2) {
        const { postCode, address } = getValues();
        if (!postCode || !address) {
          attentionAlert('Please provide both a postcode and address.');
          return;
        }
        if (!ukPostcodeRegex.test(postCode)) {
          attentionAlert('Please enter a valid UK postcode.');
          return;
        }
        if (showAddressConfirm) {
          attentionAlert('Please confirm or manually enter your address.');
          return;
        }
      }
      if (currentSection === 3) {
        const { password, confirmPassword } = getValues();
        if (password !== confirmPassword) {
          attentionAlert('Passwords do not match.');
          return;
        }
        handleSubmit(onSubmit)();
      } else {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderProgressIndicator = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={{
            width: '30%',
            height: 4,
            borderRadius: 5,
            backgroundColor: step <= currentSection ? '#F4AB19' : '#98A2B3',
            marginHorizontal: 5,
          }}
        />
      ))}
    </View>
  );

  const renderHeaderText = () => {
    let title = '';
    let subtitle = '';

    switch (currentSection) {
      case 1:
        title = 'Create a new account';
        subtitle = 'Register today and access the best vendors near you.';
        break;
      case 2:
        title = 'Provide Additional Information';
        subtitle = 'In order to serve you well, we need just a few more information.';
        break;
      case 3:
        title = 'Secure your account';
        subtitle = 'Add a secure password';
        break;
      default:
        title = 'Create a new account';
        subtitle = 'Register today and access the best vendors near you.';
    }

    return (
      <View style={{ rowGap: 5 }}>
        <Text type="headline_3_semibold" text={title} />
        <Text type="small_regular" color="primary40" text={subtitle} />
      </View>
    );
  };

  const CustomGooglePlacesAutocomplete = () => (
    <View style={{ height: 0, overflow: 'hidden' }}>
      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        placeholder="Hidden"
        onPress={(data, details) => handleAddressSelect(data, details)}
        query={{
          key: 'AIzaSyDN6s9y6WezcKzlz6cPp1hu8SlJ1AcYScs',
          language: 'en',
          components: 'country:gb',
          types: 'postal_code',
        }}
        fetchDetails={true}
        textInputProps={{
          editable: true,
        }}
        onFail={(error) => {
          setLoading(false);
          console.error('Google Places error:', error);
        }}
        suppressDefaultStyles={true}
        styles={{
          container: { height: 0 },
          textInputContainer: { height: 0 },
          textInput: { height: 0 },
        }}
        enablePoweredByContainer={false}
        debounce={300}
        minLength={3}
        nearbyPlacesAPI="GooglePlacesSearch"
        filterReverseGeocodingByTypes={['postal_code', 'street_address']}
        predefinedPlaces={[]}
        predefinedPlacesAlwaysVisible={false}
        onTimeout={() => setLoading(false)}
        renderRow={(rowData) => {
          return <View />;
        }}
        listEmptyComponent={() => null}
        listViewDisplayed={false}
        onNotFound={() => setLoading(false)}
        renderDescription={(row) => row.description}
        listUnderlayColor="transparent"
      />
    </View>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <View style={styles.gap}>
            <View style={{ rowGap: 5 }}>
              <Text type="body_regular" color="primary80" text="Full Name" />
              <Input
                placeholder="Enter Your name"
                name="fullName"
                control={control}
                rules={{ required: 'Full name is required' }}
              />
            </View>
            <View style={{ rowGap: 5 }}>
              <Text type="body_regular" color="primary80" text="Email Address" />
              <Input
                placeholder="Enter Your email"
                name="email"
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
            <View style={{ flexDirection: 'row', columnGap: 5 }}>
              <View style={{ height: 18, width: 18, borderRadius: 5 }}>
                <Controller
                  control={control}
                  name="agreement"
                  rules={{ required: 'You must agree to proceed' }}
                  render={({ field: { onChange, value } }) => (
                    <CheckBox checked={value} onPress={() => onChange(!value)} borderRadius={5} />
                  )}
                />
              </View>
              <Text
                type="sub_regular"
                text="By checking this box, you confirm that you have read, understood, and agree to Sweeftly Terms and Conditions and Privacy Policy"
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.gap}>
            <View style={{ rowGap: 5 }}>
              <Text type="body_regular" color="primary80" text="Phone Number" />
              <PhoneInput
                name="phoneNumber"
                control={control}
                rules={{ required: 'Phone number is required' }}
                placeholder="7123456789"
              />
            </View>
            <View style={{ rowGap: 5, zIndex: 10 }}>
              <Text type="body_regular" color="primary80" text="Post Code" />
              <Input
                placeholder="Enter Your Postcode (e.g., SW1A 1AA)"
                name="postCode"
                control={control}
                rules={{
                  required: 'Postcode is required',
                  pattern: {
                    value: ukPostcodeRegex,
                    message: 'Invalid UK postcode',
                  },
                }}
                autoCapitalize="characters"
                onChangeText={handlePostcodeChange}
              />
              {loading && (
                <ActivityIndicator size="small" color="#F4AB19" style={{ marginTop: 10 }} />
              )}
              {showSuggestions && addressSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <ScrollView
                    style={styles.suggestionsList}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}>
                    {addressSuggestions.map((item, index) => (
                      <Pressable
                        key={item.place_id || index}
                        style={styles.suggestionItem}
                        onPress={() => handleAddressSelect(item)}>
                        <Text type="small_regular" text={item.description} />
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
              <CustomGooglePlacesAutocomplete />
            </View>
            <View style={{ rowGap: 5 }}>
              <Text type="body_regular" color="primary80" text="Address" />
              <Input
                placeholder="e.g 39 Renfield Street, Glasgow"
                name="address"
                control={control}
                rules={{ required: 'Address is required' }}
                editable={!selectedAddress}
              />
              {selectedAddress && (
                <Text
                  text="Enter Manually"
                  type="small_regular"
                  color="secondary"
                  align="right"
                  onPress={handleManualAddress}
                />
              )}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.gap}>
            <View style={{ rowGap: 5 }}>
              <Text type="body_regular" color="primary80" text="Password" />
              <Input
                placeholder="Enter password"
                name="password"
                type="password"
                control={control}
                rules={{ required: 'Password is required' }}
              />
            </View>
            <View style={{ rowGap: 5 }}>
              <Text type="body_regular" color="primary80" text="Confirm Password" />
              <Input
                placeholder="Confirm password"
                name="confirmPassword"
                type="password"
                control={control}
                rules={{
                  required: 'Password confirmation is required',
                  validate: (value) => value === getValues('password') || 'Passwords do not match',
                }}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Screen bgColor="#FFFEFA">
      <KeyboardWrapper>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <LoaderModal isLoading={isLoading} />
          <View style={{ flex: 1, rowGap: 20 }}>
            {renderProgressIndicator()}
            {renderHeaderText()}
            {renderSection()}
            <View style={[styles.gap, { marginTop: 30 }]}>
              <Button
                title={currentSection === 3 ? 'Submit' : 'Continue'}
                onPress={handleContinue}
                isLoading={isLoading}
              />
              {currentSection > 1 && (
                <Button title="Back" onPress={handleBack} variant="secondary" />
              )}
              <Pressable
                onPress={() => navigation.navigate('CUSTOMER_LOGIN_SCREEN', { onAuthSuccess })}
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#98A2B3' }} text="Already have an account? " />
                <Text text="Login" type="sub_semibold" style={{ color: '#F4AB19' }} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default CustomerRegistrationScreen;
const styles = StyleSheet.create({
  gap: {
    rowGap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 85, // Adjust based on your input height
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
});
