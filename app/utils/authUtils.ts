import useUserStore from "app/store/use-user-store";
import { deleteAccessToken, deleteVendorAccessToken } from "./local-storage/accessToken";
import { setRefreshToken, setVendorRefreshToken } from "./local-storage/refreshToken";
import useCartStore from "app/store/use-cart-store";
import useVendorStore from "app/store/use-vendor-store";
import { clearAllStorage } from "./local-storage/localStorage";
import { useShippingAddressStore } from "app/store/shippingAddress";

export const logoutUser = () => {
  // Clear tokens
  deleteAccessToken();
  setRefreshToken(null);
  useShippingAddressStore.getState().clearShippingAddress();
 
  const clearUser= useUserStore.getState().clearUser;
  clearUser();
};

export const deleteUserAccount = () => {
 
    deleteAccessToken();
    setRefreshToken(null);
    
    const clearUser= useUserStore.getState().clearUser;
    clearUser();
    
    const clearCart = useCartStore.getState().clearCart;
    clearCart();
  };

  export const deleteVendorAccount = () => {
 
    deleteAccessToken();
    setRefreshToken(null);
    
    const clearVendor = useVendorStore.getState().clearVendor;
    clearVendor();
    
    const clearCart = useCartStore.getState().clearCart;
    clearCart();
  };


export const logoutVendor = () => {
  deleteVendorAccessToken();
  setVendorRefreshToken(null);
  
  const clearVendor = useVendorStore.getState().clearVendor;
  clearVendor();
};

export const clearAllData = () => {
  logoutUser();
  logoutVendor();
  clearAllStorage();
};