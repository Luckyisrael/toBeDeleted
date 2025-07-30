import { ConfigContext, ExpoConfig } from "expo/config";
import { version } from "../../package.json";

const EAS_PROJECT_ID = "891eaef2-a358-4951-9493-f692f0a27b39";
const PROJECT_SLUG = "sweeftly";
const OWNER = "luckyisrael";

// App production config
const APP_NAME = "Sweeftly";
const BUNDLE_IDENTIFIER = "com.luckyisrael.sweeftly";
const PACKAGE_NAME = "com.luckyisrael.sweeftly";
const ICON = "./app/assets/icon.png";
const ADAPTIVE_ICON = "./app/assets/adaptive-icon.png";
const SCHEME = "sweeftly";


export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicAppConfig(
      (process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name: name,
    version,
    slug: PROJECT_SLUG, 
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    icon: icon,
    scheme: scheme,
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleIdentifier,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        usesNonExemptEncryption: false,
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      package: packageName,
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: OWNER,
  };
};

// Dynamically configure the app based on the environment.
// Update these placeholders with your actual values.
export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: "./app/assets/icon.png",
      adaptiveIcon: "./app/assets/adaptive-icon.png",
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: "./app/assets/icon.png",
    adaptiveIcon: "./app/assets/adaptive-icon.png",
    scheme: `${SCHEME}-dev`,
  };
};