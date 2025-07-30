import React, { useEffect } from "react";
import { Animated, Easing, View } from "react-native";
import { SCREEN_WIDTH } from "app/resources/config";
import { LinearGradient } from "expo-linear-gradient";
import { skeletonLoaderStyles } from "./styles";
import type { SkeletonLoaderProps } from "./types";

const SkeletonLoader = ({
  width,
  height,
  style,
  bR = 0,
}: SkeletonLoaderProps) => {
  const animatedValue = new Animated.Value(0);
  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const styles = skeletonLoaderStyles({ translateX, width, height });
  return (
    <View style={[styles.gradientBg, style, { borderRadius: bR }]}>
      <AnimatedLG
        colors={[
          // TODO: Use colors from design system palette
          "rgba(219, 219, 219, 0.3)",
          "rgba(219, 219, 219, 0.7)",
          "rgba(219, 219, 219, 1)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1.5 }}
        style={styles.gradientWrap}
      />
    </View>
  );
};

export default SkeletonLoader;
const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
