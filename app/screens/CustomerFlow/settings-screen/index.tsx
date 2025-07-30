import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import React, { useState, useCallback, memo } from 'react';
import { Screen, Text } from 'app/design-system';
import {
  LogoutSvgIcon,
  AccountSettingSvg,
  NotificationSettingSvg,
  ReportProblemSvg,
  HelpCenterSvg,
  SavedItemSvg,
  LegalSvg,
  AddressSvg,
} from 'app/assets/svg';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from 'app/resources/config';
import { ArrowRight2, ProfileCircle } from 'iconsax-react-native';
import { useGetUserProfile } from 'app/hooks/api/view-user-history';
import { NOT_AVAILABLE } from 'app/utils/constants';
import { useNavigationAuth } from 'app/hooks/useNavigationAuth';
import { LogoutModal } from 'app/modals';
import useUserStore from 'app/store/use-user-store';
import useAlert from 'app/hooks/useAlert';

type CustomerNavigationProp = any; 

interface SettingOption {
  label: string;
  description: string;
  screen: string;
  icon: JSX.Element;
  restricted?: boolean; 
}

interface SettingSection {
  title: string;
  options: SettingOption[];
}


const settings: SettingSection[] = [
  {
    title: '',
    options: [
      {
        label: 'Account Settings',
        description: 'Manage your preference and personal information.',
        screen: 'CUSTOMER_ACCOUNT_SETTINGS_SCREENS',
        icon: <AccountSettingSvg />,
        restricted: true,
      },
      {
        label: 'Saved Items',
        description: 'Access your favourite products and shops',
        screen: 'CUSTOMER_SAVED_ITEMS_SCREEN',
        icon: <SavedItemSvg />,
        restricted: true,
      },
      {
        label: 'My Addresses',
        description: 'Manage your saved delivery location for a faster checkout',
        screen: 'CUSTOMER_ADDRESS_SCREEN',
        icon: <AddressSvg />,
        restricted: true,
      },
      {
        label: 'Notification Setting',
        description: 'Customise alert for orders, promotions and updates',
        screen: 'CUSTOMER_NOTIFICATION_SCREEN',
        icon: <NotificationSettingSvg />,
      },
    ],
  },
  {
    title: 'Support',
    options: [
      {
        label: 'Help center',
        description: 'Your goto resource for answers and assistance.',
        screen: 'CUSTOMER_HELP_CENTER_SCREEN',
        icon: <HelpCenterSvg />,
      },
      {
        label: 'Report a problem',
        description: 'Facing an issue? Let us know, and we will fix it',
        screen: 'CUSTOMER_FEEDBACK_SCREEN',
        icon: <ReportProblemSvg />,
      },
      {
        label: 'Legal',
        description: 'Important policies that guide your use of Sweeftly.',
        screen: 'CUSTOMER_LEGAL_SCREEN',
        icon: <LegalSvg />,
      },
      {
        label: 'Log Out',
        description: 'Sign out securely from your account.',
        screen: 'LogoutScreen',
        icon: <LogoutSvgIcon />,
      },
    ],
  },
];


const SettingOption: React.FC<{
  title: string;
  description: string;
  screen: string;
  icon: JSX.Element;
  restricted?: boolean;
  onLogoutPress?: () => void;
  accessToken: string | null;
}> = memo(({ title, description, screen, icon, restricted, onLogoutPress, accessToken }) => {
  const navigation = useNavigation<CustomerNavigationProp>();
  const { errorAlert } = useAlert();

  const handlePress = useCallback(() => {
    if (title === 'Log Out') {
      onLogoutPress?.();
    } else if (restricted && !accessToken) {
      errorAlert('Please log in to access this feature');
      //navigation.navigate('CUSTOMER_LOGIN_SCREEN');
    } else {
      navigation.navigate(screen);
    }
  }, [title, screen, restricted, accessToken, navigation, onLogoutPress, errorAlert]);

  return (
    <Pressable style={styles.settingNavigation} onPress={handlePress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
        <View>{icon}</View>
        <View>
          <Text text={title} type="body_medium" color="primary80" />
          <Text text={description} type="sub_regular" color="primary40" />
        </View>
      </View>
      <ArrowRight2 size="20" color="#5B6D73" /> 
    </Pressable>
  );
});


const CustomerSettingScreen = () => {
const navigation = useNavigation()
  const [logoutBottomSheet, setLogoutBottomSheet] = useState(false);
  const { logout } = useNavigationAuth();
  const { accessToken } = useUserStore();
  const { data, isLoading } = useGetUserProfile();

  const { errorAlert } = useAlert();

  const userName = data?.fullName || NOT_AVAILABLE;
  const emailAddress = data?.email || NOT_AVAILABLE;

  const handleConfirmLogout = useCallback(() => {
    logout();
    setLogoutBottomSheet(false); 
  }, [logout]);

  const handleCancelLogout = useCallback(() => {
    setLogoutBottomSheet(false);
  }, []);

  const gotoLoginScreen = () => {
    navigation.navigate('CUSTOMER_LOGIN_SCREEN');
  }
  const renderSection = useCallback(
    (section: SettingSection, index: number) => (
      <View key={index}>
        {section.title ? (
          <Text text={section.title} style={{ paddingVertical: 15 }} />
        ) : null}
        <View style={styles.navigationContainer}>
          {section.options.map((option, idx) => (
            <SettingOption
              key={`${index}-${idx}`}
              title={option.label}
              description={option.description}
              screen={option.screen}
              icon={option.icon}
              restricted={option.restricted}
              accessToken={accessToken}
              onLogoutPress={option.label === 'Log Out' ? () => setLogoutBottomSheet(true) : undefined}
            />
          ))}
        </View>
      </View>
    ),
    [accessToken]
  );

  return (
    <Screen withBackBtn={false} bgColor="white">
     <>
     <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Pressable
          onPress={gotoLoginScreen}
            style={{
              flexDirection: 'row',
              columnGap: 7,
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <ProfileCircle size="54" color="#e5e5e5" variant="Bold" />
            <View>
              <Text
                type="emphasized_medium"
                color="primary80"
                text={accessToken ? `Hi, ${userName}` : 'Guest User'}
              />
              <Text
                type="small_regular"
                color="primary40"
                text={accessToken ? emailAddress : 'Please log in'}
              />
            </View>
          </Pressable>

          {settings.map(renderSection)}
        </View>
      </ScrollView>
      <LogoutModal
        isVisible={logoutBottomSheet}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
     </>
    </Screen>
  );
};

export default memo(CustomerSettingScreen);

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
    marginTop:  20
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
    backgroundColor: '#FFF9ED' 
  },
  logoutBtn: {
    height: hp(54),
    width: wp(154),
    borderRadius: wp(24)
  }
});