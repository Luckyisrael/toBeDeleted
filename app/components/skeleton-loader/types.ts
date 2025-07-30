import { ViewStyle, Animated } from "react-native";

export type SkeletonLoaderProps = {
  width: number | `${number}%`;
  height: number | string;
  style?: ViewStyle;
  bR?: number;
};

export type SkeletonLoaderStylesProps = {
  translateX: Animated.AnimatedInterpolation<string | number>;
  width: number | `${number}%`;
  height: number;
};
