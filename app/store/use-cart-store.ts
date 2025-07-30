import { mmkvStorage, zustandMMKVStorage } from 'app/utils/local-storage/localStorage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


// Define Interfaces
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface VendorDetails {
  vendorName: string;
  coverPhoto: string;
  description: string;
}

interface CartStore {
  items: CartItem[];
  vendorDetails: VendorDetails | null;
  addToCart: (item: Omit<CartItem, 'quantity'>, vendorDetails?: VendorDetails) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setVendorDetails: (vendorDetails: VendorDetails) => void;
}

// Check if this is the first launch
const isFirstLaunch = mmkvStorage.getBoolean('isFirstLaunch') === undefined;

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: isFirstLaunch ? [] : undefined, // Set to empty array only on first launch
      vendorDetails: null, // Initialize as null
      addToCart: (item, vendorDetails) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
          set({
            items: currentItems.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1 }],
            vendorDetails: vendorDetails || get().vendorDetails, // Set or preserve vendorDetails
          });
        }
      },
      removeFromCart: (itemId) => {
        const updatedItems = get().items.filter((item) => item.id !== itemId);
        set({
          items: updatedItems,
          vendorDetails: updatedItems.length === 0 ? null : get().vendorDetails, // Clear if cart is empty
        });
      },
      updateQuantity: (itemId, quantity) => {
        const currentItems = get().items;
        if (quantity <= 0) {
          const updatedItems = currentItems.filter((item) => item.id !== itemId);
          set({
            items: updatedItems,
            vendorDetails: updatedItems.length === 0 ? null : get().vendorDetails, // Clear if cart is empty
          });
        } else {
          set({
            items: currentItems.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => {
        set({ items: [], vendorDetails: null }); // Reset vendorDetails when clearing cart
      },
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      setVendorDetails: (vendorDetails) => {
        set({ vendorDetails });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate cart store:', error);
        } else {
          console.log('Cart store rehydrated:', state?.items, state?.vendorDetails);
          // If first launch, clear the cart and set the flag
          if (isFirstLaunch) {
            state?.clearCart();
            mmkvStorage.set('isFirstLaunch', false);
          }
        }
      },
    }
  )
);

export default useCartStore;