export type StoreDetialsProps = {
    storeImage?: any;
    storeName?: string;
    storeAddress?: string;
    storeRating?: number;
    storeLink?: string;
    totalOrders?: string;
    favourited?: boolean;
    openingHour?: any;
    closingHour?: any;
}

  
 export type Props = {
  isLoading?: boolean;
    store: StoreDetialsProps;
    onViewStore: () => void;
  };
  