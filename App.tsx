import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AppProviders } from 'app/providers/app-providers';
import { LogBox, View } from 'react-native';
import AppStack from 'app/navigation';
import * as Updates from 'expo-updates';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as Linking from 'expo-linking';
import { MenuProvider } from 'react-native-popup-menu';
import { usePushNotifications } from 'app/hooks/usePushNotification';
import config from 'app/utils/config';
import * as Sentry from "@sentry/react-native";

SplashScreen.preventAutoHideAsync();
export const navigationRef = createNavigationContainerRef();

Sentry.init({
  dsn: "https://cb606c9769027b4b35a28fa4ae800963@o4506130167037952.ingest.us.sentry.io/4509201556111360",
  sendDefaultPii: true,
});

const App = () => {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);

  
  const [fontsLoaded] = useFonts({
    InterRegular: require('./app/assets/fonts/Inter-Regular.ttf'),
    InterMedium: require('./app/assets/fonts/Inter-Medium.ttf'),
    InterSemibold: require('./app/assets/fonts/Inter-SemiBold.ttf'),
    InterBold: require('./app/assets/fonts/Inter-Bold.ttf'),
    InterBlack: require('./app/assets/fonts/Inter-Black.ttf'),
    InterHeavy: require('./app/assets/fonts/Inter-ExtraBold.ttf'),
    InterThin: require('./app/assets/fonts/Inter-Thin.ttf'),
    InterLight: require('./app/assets/fonts/Inter-Light.ttf'),
  });

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log(`Error fetching latest Expo update: ${error}`);
    }
  }
  useEffect(() => {
  onFetchUpdateAsync()
  }, [])

  LogBox.ignoreAllLogs();
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer ref={navigationRef}>
        <AppProviders>
          <StripeProvider
            publishableKey={config.STRIPE_LIVE_KEY}
            merchantIdentifier={config.MERCHANT_ID}
            urlScheme={Linking.createURL('/').split(':')[0]}>
            <MenuProvider>
              <AppStack />
            </MenuProvider>
          </StripeProvider>
        </AppProviders>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
export default Sentry.wrap(App);