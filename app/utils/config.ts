const config = {
    STRIPE_LIVE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_LIVE_KEY ?? "",
    PRODUCTION_URL: process.env.EXPO_PUBLIC_PRODUCTION_BASE_URL ?? "",
    MERCHANT_ID: process.env.EXPO_PUBLIC_MERCHANT_ID ?? "",
    STRIPE_TEST_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_TEST_KEY ?? "",
  };
  
  export default config;