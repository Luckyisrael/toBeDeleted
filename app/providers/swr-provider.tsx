import { useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import type { AxiosError } from "axios";
import type { Revalidator, RevalidatorOptions } from "swr";
import { SWRConfig } from "swr";
import { useIsOnline } from "app/hooks/useIsOnline"; 

export const SWRProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { isOnline } = useIsOnline();
  const lastError = useRef<AxiosError | null>(null);

  return (
    <SWRConfig
      value={{
        isVisible: () => {
          return AppState.currentState === "active";
        },
        isOnline: () => {
          return isOnline;
        },
        initFocus(callback) {
          const onAppStateChange = (nextAppState: AppStateStatus) => {
            /*NOTE If it's resuming from background or inactive mode to active one */
            if (nextAppState === "active") {
              callback();
            }
          };

          //NOTE Subscribe to the app state change events
          const listener = AppState.addEventListener(
            "change",
            onAppStateChange
          );

          return () => {
            if (listener) {
              listener.remove();
            }
          };
        },
        initReconnect(callback) {
          const unsubscribe = NetInfo.addEventListener((s) => {
            if (s.isInternetReachable && s.isConnected) {
              callback();
            }
          });

          return unsubscribe;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
