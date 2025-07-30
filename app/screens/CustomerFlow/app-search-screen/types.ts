// Define the API response type
export type LocationProps = {
  vendorId: string;
  vendor: string;
  image: string;
  address: string;
  distance: number;
};

// Define the Store type for properly typed data
export type Store = {
  id: string;
  name: string;
  tag: string;
  price: string;
  distance: string;
  deliveryTime: string;
  image: string;
};