import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import { Button, Input, KeyboardWrapper, Screen, Text } from 'app/design-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useVendorAuth } from 'app/hooks/api/vendor-api/use-vendor-auth';
import { EMPTY_STRING } from 'app/utils/constants';
import useAlert from 'app/hooks/useAlert';
import dayjs from 'dayjs';
import { LoaderModal } from 'app/modals';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import useVendorStore from 'app/store/use-vendor-store';

const BusinessWithLicense = () => {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { updateBankDetails, isProcessingLoading } = useVendorApi();
  const { errorAlert, successAlert, attentionAlert } = useAlert();

  type FormData = {
    firstName: string;
    lastName: string;
    companayName: string;
    dob: string;
    accountNumber: string;
    sortCode: string;
    accountName: string;
    bankName: string;
    taxId: string;
    dateOfBirth: string;
    companyName: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      companayName: '',
      dob: '',
      accountNumber: '',
      sortCode: '',
      accountName: '',
      bankName: '',
      taxId: '',
    },
  });
  const { vendor } = useVendorStore();

  const { vendorId } = vendor;

  const onSubmit = async (data: FormData) => {
    const {
      firstName,
      lastName,
      bankName,
      dateOfBirth,
      accountName,
      accountNumber,
      sortCode,
      taxId,
      companyName,
    } = data;
    const formattedAccountNumber = accountNumber.replace(/\s+/g, ''); // Remove spaces
    const formattedSortCode = sortCode.replace(/\s+/g, ''); // Remove spaces
    const formattedAccountName = accountName.replace(/\s+/g, ''); // Remove spaces
    const formattedBankName = bankName.replace(/\s+/g, ''); // Remove spaces
    const formattedTime = dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
    console.log('formatted: ', formattedTime);

    try {
      await updateBankDetails({
        firstName: firstName,
        lastName: lastName,
        bankName: bankName,
        dateOfBirth: dateOfBirth,
        accountName: accountName,
        accountNumber: accountNumber,
        sortCode: sortCode,
        taxId: taxId,
        vendorType: "individual",
        companyName: companyName,
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
    <Screen>
      <KeyboardWrapper>
        <LoaderModal isLoading={isProcessingLoading} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          <View style={{ flex: 1, rowGap: 20 }}>
            <View style={{ rowGap: 5 }}>
              <Text type="headline_3_semibold" text="Secure your payouts" />
              <Text
                type="small_regular"
                color="primary40"
                text="Add your bank details to receive payments seamlessly and on time"
              />
            </View>
            <View style={styles.gap}>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="First" />
                <Input
                  placeholder={'Enter first name'}
                  name="firstName"
                  type="text"
                  control={control}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Last name" />
                <Input
                  placeholder={'Enter last name'}
                  name="lastName"
                  type="text"
                  control={control}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Company name" />
                <Input
                  placeholder={'Enter Company name'}
                  name="companyName"
                  type="text"
                  control={control}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Bank name" />
                <Input
                  placeholder={'Enter bankk name'}
                  name="bankName"
                  type="text"
                  control={control}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Date of birth(DOB)" />
                <Input
                  placeholder={'DD/MM/YYYY'}
                  name="dob"
                  type="text"
                  control={control}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Account number" />
                <Input
                  placeholder={'Enter account number'}
                  name="accountNumber"
                  type="text"
                  control={control}
                  keyboardType="default"
                  maxLength={10}
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Account name" />
                <Input
                  placeholder={'Enter account name'}
                  name="accountName"
                  type="text"
                  control={control}
                  keyboardType="default"
                />
              </View>
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Sort code" />
                <Input
                  placeholder={'**********'}
                  name="sortCode"
                  type="text"
                  control={control}
                  //rules={VALIDATION.FIRST_NAME_INPUT_VALIDATION}
                  keyboardType="default"
                  maxLength={6}
                />
              </View>
              \
              <View style={{ rowGap: 5 }}>
                <Text type="body_regular" color="primary80" text="Business (Tax) ID" />
                <Input
                  placeholder={'**********'}
                  name="taxId"
                  type="password"
                  control={control}
                  keyboardType="default"
                />
              </View>
              <View style={[styles.gap, { marginTop: 20 }]}>
                <Button title="Submit" onPress={handleSubmit(onSubmit)} disabled={isProcessingLoading} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default BusinessWithLicense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  gap: {
    rowGap: 20,
  },
});
