import React from 'react';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { View, ViewProps, StyleSheet } from 'react-native';

// Base types for animation props
type AnimationBaseProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
  easing?: any;
  springify?: boolean;
  damping?: number;
  mass?: number;
  stiffness?: number;
  from?: any;
};

// Props with enter/exit functionality
type AnimatedComponentProps = AnimationBaseProps & {
  exitDuration?: number;
  exitDelay?: number;
  onExitComplete?: () => void;
  entering?: any;
  exiting?: any;
} & ViewProps;

/**
 * Base Animated Component
 */
export const AnimatedView = ({
  children,
  delay = 0,
  duration = 500,
  exitDuration = 300,
  exitDelay = 0,
  style = {},
  easing = Easing.inOut(Easing.ease),
  springify = false,
  entering,
  exiting,
  ...props
}: AnimatedComponentProps) => {
  // Apply default entering animation if none provided
  const enterAnimation = entering || FadeIn;
  
  // Configure animation parameters
  let finalEntering = enterAnimation.duration(duration).delay(delay);
  if (springify) {
    finalEntering = finalEntering.springify();
  } else if (easing) {
    finalEntering = finalEntering.easing(easing);
  }

  // Configure exit animation if provided
  let finalExiting = exiting;
  if (finalExiting) {
    finalExiting = finalExiting.duration(exitDuration).delay(exitDelay);
    if (springify) {
      finalExiting = finalExiting.springify();
    } else if (easing) {
      finalExiting = finalExiting.easing(easing);
    }
  }

  return (
    <Animated.View
      entering={finalEntering}
      exiting={finalExiting}
      style={style}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Fade In Animation Component
 */
export const FadeInView = (props: AnimationBaseProps) => (
  <AnimatedView entering={FadeIn} exiting={FadeOut} {...props} />
);

/**
 * Fade In Up Animation Component
 */
export const FadeInUpView = (props: AnimationBaseProps) => (
  <AnimatedView entering={FadeInUp} exiting={FadeOut} {...props} />
);

/**
 * Fade In Down Animation Component
 */
export const FadeInDownView = (props: AnimationBaseProps) => (
  <AnimatedView entering={FadeInDown} exiting={FadeOut} {...props} />
);

/**
 * Slide In Up Animation Component
 */
export const SlideInUpView = (props: AnimationBaseProps) => (
  <AnimatedView entering={SlideInUp} exiting={SlideOutDown} {...props} />
);

/**
 * Slide In Down Animation Component
 */
export const SlideInDownView = (props: AnimationBaseProps) => (
  <AnimatedView entering={SlideInDown} exiting={SlideOutUp} {...props} />
);

/**
 * Slide In Left Animation Component
 */
export const SlideInLeftView = (props: AnimationBaseProps) => (
  <AnimatedView entering={SlideInLeft} exiting={SlideOutRight} {...props} />
);

/**
 * Slide In Right Animation Component
 */
export const SlideInRightView = (props: AnimationBaseProps) => (
  <AnimatedView entering={SlideInRight} exiting={SlideOutLeft} {...props} />
);

/**
 * Zoom In Animation Component
 */
export const ZoomInView = (props: AnimationBaseProps) => (
  <AnimatedView entering={ZoomIn} exiting={ZoomOut} {...props} />
);

/**
 * Staggered Animation Container
 * Applies staggered animation to children
 */
export const StaggerView = ({
  children,
  baseDelay = 150,
  staggerDelay = 100,
  duration = 500,
  animation = FadeInUp,
  style = {},
  ...props
}: AnimationBaseProps & {
  baseDelay?: number;
  staggerDelay?: number;
  animation?: any;
}) => {
  return (
    <View style={style} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const delay = baseDelay + index * staggerDelay;
        
        return (
          <AnimatedView
            key={index}
            delay={delay}
            duration={duration}
            entering={animation}
            style={child.props.style}
          >
            {child}
          </AnimatedView>
        );
      })}
    </View>
  );
};

/**
 * Pulse Animation Component
 */
export const PulseView = ({
  children,
  intensity = 1.1,
  duration = 1500,
  style = {},
  ...props
}: AnimationBaseProps & {
  intensity?: number;
}) => {
  const pulseValue = useSharedValue(1);
  
  React.useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(intensity, { 
        duration, 
        easing: Easing.inOut(Easing.ease) 
      }),
      -1, // Infinite repeats
      true // Reverse (pulse in and out)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }]
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

/**
 * Bounce Animation Component
 */
export const BounceView = ({
  children,
  intensity = 1.1,
  duration = 1000,
  style = {},
  ...props
}: AnimationBaseProps & {
  intensity?: number;
}) => {
  const bounceValue = useSharedValue(1);
  
  React.useEffect(() => {
    bounceValue.value = withSequence(
      withTiming(intensity, { duration: duration * 0.4 }),
      withTiming(0.9, { duration: duration * 0.2 }),
      withTiming(1, { duration: duration * 0.4 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bounceValue.value }]
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

/**
 * Selection Animation Component
 * For items that can be selected/deselected
 */
export const SelectionView = ({
  children,
  isSelected,
  activeColor = 'rgba(244, 171, 25, 0.05)',
  inactiveColor = 'white',
  borderWidth = 1,
  borderColor = '#F4AB19',
  inactiveBorderColor = 'transparent',
  duration = 300,
  style = {},
  ...props
}: AnimationBaseProps & {
  isSelected: boolean;
  activeColor?: string;
  inactiveColor?: string;
  borderWidth?: number;
  borderColor?: string;
  inactiveBorderColor?: string;
}) => {
  const selectionScale = useSharedValue(1);
  const bgColor = useSharedValue(isSelected ? activeColor : inactiveColor);
  const borderWidthAnim = useSharedValue(isSelected ? borderWidth : 0);
  
  React.useEffect(() => {
    bgColor.value = withTiming(
      isSelected ? activeColor : inactiveColor,
      { duration }
    );
    
    borderWidthAnim.value = withTiming(
      isSelected ? borderWidth : 0,
      { duration }
    );
    
    if (isSelected) {
      selectionScale.value = withSequence(
        withTiming(1.03, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: bgColor.value,
      borderWidth: borderWidthAnim.value,
      borderColor: isSelected ? borderColor : inactiveBorderColor,
      transform: [{ scale: selectionScale.value }]
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

// Example of usage as a Higher Order Component
export const withAnimation = (Component, animationType, config = {}) => {
  return (props) => {
    const AnimationComponent = 
      animationType === 'fade' ? FadeInView :
      animationType === 'fadeUp' ? FadeInUpView :
      animationType === 'fadeDown' ? FadeInDownView :
      animationType === 'slideUp' ? SlideInUpView :
      animationType === 'slideDown' ? SlideInDownView :
      animationType === 'slideLeft' ? SlideInLeftView :
      animationType === 'slideRight' ? SlideInRightView :
      animationType === 'zoom' ? ZoomInView :
      animationType === 'pulse' ? PulseView :
      animationType === 'bounce' ? BounceView : FadeInView;
    
    return (
      <AnimationComponent {...config}>
        <Component {...props} />
      </AnimationComponent>
    );
  };
};