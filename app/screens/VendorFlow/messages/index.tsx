import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Image, Screen, Text } from 'app/design-system';
import {
  LogoutSvgIcon,
  AccountSettingSvg,
  NotificationSettingSvg,
  ReportProblemSvg,
  HelpCenterSvg,
  LegalSvg,
  BankSvg,
} from 'app/assets/svg';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from 'app/resources/config';
import { ArrowRight2 } from 'iconsax-react-native';
import { NOT_AVAILABLE } from 'app/utils/constants';
import { LogoutModal } from 'app/modals';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import useVendorStore from 'app/store/use-vendor-store';
import { useNavigationAuth } from 'app/hooks/useNavigationAuth';

const settings = [
  {
    title: '',
    options: [
      {
        label: 'Account Settings',
        description: 'Manage your preference and personal information.',
        screen: 'VENDOR_ACCOUNT_SETTINGS_SCREEN',
        icon: <AccountSettingSvg />,
      },
      {
        label: 'Bank Details',
        description: 'Add your bank details to receive quick payments',
        screen: 'SELECT_BUSINESS_TYPE_SCREEN',
        icon: <BankSvg />,
      },
      {
        label: 'Notification Setting',
        description: 'Customise alert for orders, promotions and updates',
        screen: 'VENDOR_NOTIFICATION_SCREEN',
        icon: <NotificationSettingSvg />,
      },
    ],
  },
];

const support = [
  {
    title: 'SUPPORT',
    options: [
      {
        label: 'Help center',
        description: 'Your goto resource for answers and assistance.',
        background: '',
        screen: 'VENDOR_HELP_CENTER_SCREEN',
        icon: <HelpCenterSvg />,
      },
      {
        label: 'Report a problem',
        description: 'Facing an issue? Let us know, and we will fix it',
        background: '',
        screen: 'VENDOR_FEEDBACK_SCREEN',
        icon: <ReportProblemSvg />,
      },
      {
        label: 'Legal',
        description: 'Important policies that guide your use of Sweeftly.',
        background: '',
        screen: 'VENDOR_LEGAL_SCREEN',
        icon: <LegalSvg />,
      },
      {
        label: 'Log Out',
        description: 'Sign out securely from your account.',
        background: '',
        screen: 'LogoutScreen', // This will not be used for navigation
        icon: <LogoutSvgIcon />,
      },
    ],
  },
];

const ProfileOptions = ({
  title,
  description,
  screen,
  icon,
  onLogoutPress,
}: {
  title: string;
  description: string;
  screen: string;
  icon: JSX.Element;
  onLogoutPress?: () => void;
}) => {
  const navigation = useNavigation();

  return (
    //@ts-ignore
    <Pressable
      style={styles.settingNavigation}
      onPress={() => {
        if (title === 'Log Out') {
          // Trigger the logout bottom sheet
          onLogoutPress?.();
        } else {
          // Navigate to the specified screen
          navigation.navigate(screen);
        }
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
        <View style={styles.iconContainer}>{icon}</View>
        <View>
          <Text text={title} type="body_medium" color="primary80" />
          <Text text={description} type="sub_regular" color="primary40" />
        </View>
      </View>
      <ArrowRight2 size="20" color="#5B6D73" />
    </Pressable>
  );
};

const VendorProfileScreen = () => {
  const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  const { logout } = useNavigationAuth();

  const { vendor, vendorAccessToken } = useVendorStore();
  if (!vendor || !vendorAccessToken) {
    return null; 
  }

  const companyNnameText = vendor?.companyName || NOT_AVAILABLE;
  const emailText = vendor?.email || NOT_AVAILABLE;

  const handleConfirmLogout = () => {
    logout();
    setLogoutBottomSheet(false);
  };

  const handleCancelLogout = () => {
    setLogoutBottomSheet(false);
  };


  return (
    <Screen withBackBtn={false}>
      <>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 7,
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <Image uri={vendor?.coverPhoto} width={54} height={54} bR={27} />
              <View>
                <Text
                  type="emphasized_medium"
                  color="primary80"
                  text={`Hi, ${companyNnameText}`}
                  truncateWords={4}
                />
                <Text type="small_regular" color="primary40" text={emailText} />
              </View>
            </View>

            <View style={{ marginTop: 15, rowGap: 30}}>
              {settings.map((section, index) => (
                <View key={index}>
                  <View style={styles.navigationContainer}>
                    {section.options.map((option, idx) => (
                      <ProfileOptions
                        key={idx}
                        title={option.label}
                        description={option.description}
                        screen={option.screen}
                        icon={option.icon}
                        onLogoutPress={() => {
                          setLogoutBottomSheet(true);
                        }}
                      />
                    ))}
                  </View>
                </View>
              ))}

              {support.map((section, index) => (
                <View key={index}>
                  <Text text={section?.title} style={{ paddingVertical: 15 }} color='primary40'/>
                  <View style={styles.navigationContainer}>
                    {section.options.map((option, idx) => (
                      <ProfileOptions
                        key={idx}
                        title={option.label}
                        description={option.description}
                        screen={option.screen}
                        icon={option.icon}
                        onLogoutPress={() => {
                          setLogoutBottomSheet(true);
                        }}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        {/** Bottom sheet for logout confirmation */}
        <LogoutModal
          isVisible={logoutBottomSheet}
          onCancel={handleCancelLogout}
          onConfirm={handleConfirmLogout}
        />
      </>
    </Screen>
  );
};

export default VendorProfileScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  navigationContainer: {
    rowGap: 25,
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingVertical: wp(15),
    marginTop: wp(5),
    borderColor: '#98A2B3',
  },
  logoutContainer: {
    rowGap: 10,
    backgroundColor: '#FFF9ED',
  },
  logoutBtn: {
    height: hp(54),
    width: wp(154),
    borderRadius: wp(24),
  },
});
