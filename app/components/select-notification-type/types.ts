export type NotificationOptions = {
    id: number;
    label: string;
    description: string;
    isSelected: boolean;
    isRecommended?: boolean;
  };
  
 export type NotificationProps = {
    options: NotificationOptions[];
    onToggle: (id: number) => void;
  };