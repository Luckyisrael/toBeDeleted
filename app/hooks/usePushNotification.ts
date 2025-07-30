import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { mmkvStorage } from "app/utils/local-storage/localStorage";

import Constants from "expo-constants";

import { Platform } from "react-native";
import { axios } from "app/config/axios";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      console.log('push token ', token)
    } else {
      alert("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );

      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};



export const useRegisterDeviceToken = (userType: string, accessToken: string | null) => {
  const { expoPushToken } = usePushNotifications();
  const [isRegistered, setIsRegistered] = useState(false);
  
  useEffect(() => {
    const checkAndRegisterToken = async () => {
     
      if (!expoPushToken?.data || !accessToken) return;
      console.log('the uer token: ', expoPushToken?.data)
      try {
       
        const storageKey = `@DeviceTokenRegistered:${expoPushToken.data}:${userType}`;
        const isAlreadyRegistered = mmkvStorage.getString(storageKey);
        
        if (isAlreadyRegistered === 'true') {
          setIsRegistered(true);
          return;
        }
        
        const response = await axios({
          url: 'user/device-token',
          method: 'POST',
          data: { deviceToken: expoPushToken.data, userType: userType, },
          accessToken: accessToken, 
        });
        console.log('thw token response ', response)
        
        if (response.ok) {
          console.log(`Device token registered for ${userType}`);
     
          mmkvStorage.set(storageKey, 'true');
          setIsRegistered(true);
        } else {
          const errorData = await response.json();
          console.error('Token registration failed:', errorData);
        }
      } catch (error) {
        console.error('Failed to register device token:', error);
      }
    };
    
    checkAndRegisterToken();
  }, [expoPushToken, userType, accessToken]);

  const forceRegistration = async () => {
    if (!expoPushToken?.data) return;

    const storageKey = `@DeviceTokenRegistered:${expoPushToken.data}:${userType}`;
    mmkvStorage.delete(storageKey);
    setIsRegistered(false);
  };
  
  return { isRegistered, forceRegistration };
};