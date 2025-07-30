import useUserStore from "app/store/use-user-store";
import useVendorStore from "app/store/use-vendor-store";
import { logout, getActiveUserType } from "app/services/authService";

export const useNavigationAuth = () => {
  const userStore = useUserStore();
  const vendorStore = useVendorStore();

  const activeUserType = getActiveUserType();
  const isAuthenticated = Boolean(activeUserType);

  const currentUserType = activeUserType;
  const currentUser = activeUserType === 'customer' ? userStore.user : vendorStore.vendor;

  return {
    isAuthenticated,
    currentUserType,
    currentUser,
    userStore,
    vendorStore,
    logout,
  };
};