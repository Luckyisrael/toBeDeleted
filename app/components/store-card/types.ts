export type Store = {
    id: string;
    name: string;
    tag: string;
    price: string;
    distance: string;
    deliveryTime: string;
    image: any;
    rating?: number; // Added rating property
  };
  
 export type Props = {
    store: Store;
    onViewStore: () => void;
  };
  