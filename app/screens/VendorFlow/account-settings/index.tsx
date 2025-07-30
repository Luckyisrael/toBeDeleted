import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { Button, Screen, ScrollView, Text } from 'app/design-system';
import { hp, wp } from 'app/resources/config';
import { Key } from 'iconsax-react-native';
import { BinSvg, KeySvg } from 'app/assets/svg';
import { useNavigation } from '@react-navigation/native';
import { useGetUserProfile } from 'app/hooks/api/view-user-history';
import { NOT_AVAILABLE } from 'app/utils/constants';
import useVendorStore from 'app/store/use-vendor-store';

const VendorAccountSettings = () => {
    {/**
      const { data, isLoading, error, refresh } = useGetUserProfile();
      
    const userName = data?.fullName || NOT_AVAILABLE;
    const emailAddress = data?.email || NOT_AVAILABLE
    const phoneNUmber = data?.phoneNumber || NOT_AVAILABLE
    const userAddress = data?.address || NOT_AVAILABLE
      */}
    const { navigate } = useNavigation();


  const { vendor } = useVendorStore()

  //const { companyName, coverPhoto, email, description, phoneNumber, address, vendorId } = vendor;

  const companyName = vendor?.companyName || NOT_AVAILABLE;
  const coverPhoto = vendor?.coverPhoto || NOT_AVAILABLE;
  const email = vendor?.email || NOT_AVAILABLE;
  const description = vendor?.description || NOT_AVAILABLE;
    const phoneNumber = vendor?.phoneNumber || NOT_AVAILABLE;
    const address = vendor?.address || NOT_AVAILABLE;
    const vendorId = vendor?.userId || NOT_AVAILABLE;

    const onChangeLocation = () => {
        console.log('Change Location');
    }
    const onResetPassword = () => {
        console.log('Reset Password');
        navigate('VENDOR_UPDATE_PASSWORD_SCREEN')
    }
    const onDeleteAccount = () => {
     
        navigate('VENDOR_DELETE_ACCOUNT_SCREEN')
    }
    const onEditProfile = () => {
        //@ts-ignore
        navigate('VENDOR_EDIT_PROFILE_SCREEN', {companyName, coverPhoto, email, description, phoneNumber, address, vendorId});
    }

  return (
    <Screen bgColor='white'>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text text="Account Settings" type="body_bold" />
            <Text text="Manage your preference and personal information." />
          </View>
          <View style={styles.content}>
            <View style={styles.innerContent}>
              <Text text="Company name" color="primary40" type="small_regular" />
              <Text text={companyName} color="primary80" type="body_medium" />
            </View>
            <View style={styles.innerContent}>
              <Text text="Brief description" color="primary40" type="small_regular" />
              <Text text={description} color="primary80" type="body_medium" />
            </View>
            <View style={styles.innerContent}>
              <Text text="Email address" color="primary40" type="small_regular" />
              <Text text={email} color="primary80" type="body_medium" />
            </View>
            <View style={styles.innerContent}>
              <Text text="Phone number" color="primary40" type="small_regular" />
              <Text text={phoneNumber} color="primary80" type="body_medium" />
            </View>
            <View style={[styles.innerContent, { rowGap: 10}]}>
              <Text text="Location" color="primary40" type="small_regular" />
              <Text
                text={address}
                color="primary80"
                type="body_medium"
              />
              <Text text="Change Location" align="right" color="secondary" type="small_semibold"  onPress={onChangeLocation}/>
            </View>
            <View style={styles.seperation} />
            <View style={styles.buttonContainer}>
              <Pressable onPress={onResetPassword} style={[styles.button, { backgroundColor: '#F3F3F3' }]}>
                <KeySvg />
                <Text text="Reset Password" />
              </Pressable>
              <Pressable onPress={onDeleteAccount} style={[styles.button, { backgroundColor: '#FBEAE9' }]}>
                <BinSvg/>
                <Text text="Delete Account" style={{ color: '#D42620' }} />
              </Pressable>
            </View>
            <View style={{ marginTop: 20 }}>
              <Button onPress={onEditProfile} title="Edit Profile" variant="secondary" />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default VendorAccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 4,
  },
  content: {
    rowGap: 15,
    marginTop: wp(20),
  },
  innerContent: {
    backgroundColor: '#F3F3F3',
    borderRadius: wp(12),
    paddingHorizontal: wp(16),
    paddingVertical: wp(10),
  },
  seperation: {
    borderBottomWidth: 0.5,
    borderColor: '#CED3D5',
    marginVertical: hp(10)
  },
  buttonContainer: {
    rowGap: 15,
  },
  button: {
    flexDirection: 'row',
    columnGap: 10,
    backgroundColor: '#F3F3F3',
    borderRadius: wp(12),
    padding: wp(16),
    alignItems: 'center',
  },
});
