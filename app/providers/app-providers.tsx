import { ToastConfig } from "app/utils/toast-config";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { SWRProvider } from "./swr-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
      <SWRProvider>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        <Toast config={ToastConfig} topOffset={0} />
      </SWRProvider>
  );
};