import { ColorDefinitions, ColorKeys } from "app/resources/colors";

export type AlertsProps = {
  message: string;
  type: "error" | "success" | "attention";
  title?: string;
  titleColor: string; 
  textColor: string;  
};

export type AlertsDataProps = {
  icon: React.ReactNode;
  bG: ColorKeys | string;
  title: string;
  titleColor: string; 
  textColor: string;  
};
