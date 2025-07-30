export type StoreBasket = {
    id: number;
    label: string;
    description: string;
    isSelected: boolean;
    image?: any;
    numberOfItemsInBasket?: number;
  };
  
 export type BasketProps = {
    store: StoreBasket[];
    visible: boolean;
    closeBottomsheet: () => void;
    onBasketPress: () => void;
    onToggle: (id: number) => void;
    isButtonDisable: boolean;
  };