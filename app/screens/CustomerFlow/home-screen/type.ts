// Define the API response type
export type LocationTypes = {
  vendorId: string;
  vendor: string;
  image: string;
  address: string;
  distance: number;
};

export type Result = {
  name: string;
  vendor: string;
  image: string;
  address: string;
  distance: number;
};