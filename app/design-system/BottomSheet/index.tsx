import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { wp } from 'app/resources/config'; // Ensure this exists

type ReusableBottomSheetProps = {
  children: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
  snapPoints?: (string | number)[];
  initialIndex?: number;
  showHandle?: boolean;
  handleComponent?: React.FC<BottomSheetHandleProps>;
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  backdropOpacity?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  contentMarginTop?: number;
  expandToFullHeight?: boolean;
  bottomSheetRef?: React.RefObject<BottomSheet>;
}; 

const ReusableBottomSheet: React.FC<ReusableBottomSheetProps> = ({
  children,
  isVisible = false,
  onClose,
  snapPoints: customSnapPoints,
  initialIndex = 0,
  showHandle = true,
  handleComponent,
  enablePanDownToClose = true,
  enableContentPanningGesture = true,
  backdropOpacity = 0.5,
  contentContainerStyle,
  handleIndicatorStyle,
  backdropStyle,
  backgroundStyle,
  contentMarginTop = 10,
  expandToFullHeight = false,
  bottomSheetRef: externalRef,
}) => {
  const internalRef = useRef<BottomSheet>(null);
  const bottomSheetRef = externalRef || internalRef;
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const defaultSnapPoints = useMemo(() => ['45%', '50%', '90%'], []);
  const snapPoints = useMemo(
    () => customSnapPoints || defaultSnapPoints,
    [customSnapPoints]
  );

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (isVisible) {
        bottomSheetRef.current.snapToIndex(initialIndex);
      } else {
        bottomSheetRef.current.close();
      }
    }
  }, [isVisible, initialIndex, bottomSheetRef]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={backdropOpacity}
        style={[styles.backdrop, backdropStyle]}
        pressBehavior={enablePanDownToClose ? 'close' : 'none'}
      />
    ),
    [backdropOpacity, backdropStyle, enablePanDownToClose]
  );

  const CustomHandleComponent = handleComponent;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? initialIndex : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      enableContentPanningGesture={enableContentPanningGesture}
      onClose={onClose}
      handleComponent={
        CustomHandleComponent ||
        (showHandle ? undefined : () => <View style={styles.noHandle} />)
      }
      handleIndicatorStyle={[
        styles.indicator,
        { display: showHandle ? 'flex' : 'none' },
        handleIndicatorStyle,
      ]}
      backdropComponent={renderBackdrop}
      backgroundStyle={[styles.background, backgroundStyle]}
      keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableOverDrag={false}
      animateOnMount={true}
      containerStyle={styles.bottomSheetContainer}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          {
            marginBottom: safeAreaBottom,
            marginTop: contentMarginTop,
            height: expandToFullHeight ? '100%' : undefined,
          },
          contentContainerStyle,
        ]}
      >
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginTop: 8,
  },
  noHandle: {
    height: 12,
  },
  backdrop: {
    backgroundColor: '#e5e5e5',
    // Ensure backdrop covers full screen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
  },
  bottomSheetContainer: {
    // Prevent layout interference
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ReusableBottomSheet;