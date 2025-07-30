import { ReactNode } from "react";
import { ViewStyle } from "react-native";

// Animation types supported by our component
export type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'none';

// Define a more specific type for easing functions
export type EasingType = (x: number) => number;

export interface AnimatedWrapperProps {
  children: ReactNode;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  easing?: EasingType; 
  initialValues?: {
    opacity?: number;
    translateX?: number;
    translateY?: number;
    scale?: number;
  };
  isList?: boolean;
  itemDuration?: number; // Duration for each list item animation
  itemDelay?: number; // Delay between each list item animation
}