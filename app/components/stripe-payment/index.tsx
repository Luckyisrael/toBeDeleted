import { StripeProvider } from '@stripe/stripe-react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

const merchantId = Constants.expoConfig?.plugins?.find(
    (p) => p[0] === "@stripe/stripe-react-native"
)?.[1].merchantIdentifier;

console.log('merchantId', merchantId);
if (!merchantId) {
    console.log('Missing Expo config for "@stripe/stripe-react-native"');
    throw new Error('Missing Expo config for "@stripe/stripe-react-native"');
}

export default function SweeftlyStripeProvider(
    props: Omit<React.ComponentProps<typeof StripeProvider>, 'publishableKey' | 'merchantIdentifier'> 
) {

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={"merchant.com.sweeftly"} // required for Apple Pay
      urlScheme={Linking.createURL("/")?.split(":")[0]}// required for 3D Secure and bank redirects
      {...props}
    />
  );
}