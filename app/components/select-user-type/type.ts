export type UserOptions = {
    id: number;
    label: string;
    isSelected: boolean;
    icon: React.ReactNode;
    description: string;
  };
  
 export type UserProps = {
    options: UserOptions[];
    onToggle: (id: number) => void;
  };