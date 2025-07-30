import { StyleSheet } from "react-native";
import { SCREEN_WIDTH, wp } from "app/resources/config";
import type { SkeletonLoaderStylesProps } from "./types";

export const skeletonLoaderStyles = ({
  translateX,
  width,
  height,
}: SkeletonLoaderStylesProps) =>
  StyleSheet.create({
    gradientWrap: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: SCREEN_WIDTH / 2,
      transform: [{ translateX }],
    },
    gradientBg: {
      backgroundColor: "rgba(219, 219, 219, 0.6)",
      overflow: "hidden",
      width,
      height,
    },
    loaderRadius: {
      borderRadius: wp(24),
    },
  });
