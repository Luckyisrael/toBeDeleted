import { StyleSheet, View } from 'react-native';
import React, { useRef, useEffect, useMemo } from 'react';
import { ReusableBottomSheet, Text, Button } from 'app/design-system';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Location } from 'iconsax-react-native';
import { hp, wp } from 'app/resources/config';
import { useFocusEffect } from '@react-navigation/native';

type UserBottomsheetProps = {
  userLocation: string;
  onPress: () => void;
  isVisible: boolean;
};

const UserAddressBottomsheet = ({ userLocation, onPress, isVisible }: UserBottomsheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  // Using useMemo to prevent unnecessary re-renders
  const snapPoints = useMemo(() => ['35%'], []);

  // When the component mounts or when isVisible changes
  useEffect(() => {
    if (isVisible && bottomSheetRef.current) {
      // Force the bottom sheet to expand
      bottomSheetRef.current.snapToIndex(0);
    }
  }, [isVisible]);

  // When the screen comes into focus (for navigation)
  useFocusEffect(
    React.useCallback(() => {
      if (bottomSheetRef.current) {
        // Ensure it's expanded when screen gains focus
        bottomSheetRef.current.snapToIndex(0);
      }
      
      return () => {
        // Optional cleanup if needed
      };
    }, [])
  );

  // Custom backdrop component that doesn't close the sheet when tapped
  const renderBackdrop = useMemo(
    () => (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        pressBehavior="none" // Prevents closing on backdrop press
      />
    ),
    []
  );

  // Handler to prevent closing attempts
  const handleSheetChanges = (index: number) => {
    // If someone tries to close the sheet (index = -1), snap it back to open
    if (index === -1 && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  return (
    <ReusableBottomSheet
      bottomSheetRef={bottomSheetRef}
      snapPoints={snapPoints}
      initialIndex={0} // Always start at the first snap point
      enablePanDownToClose={false} // Disable closing by panning down
      enableContentPanningGesture={false} // Disable panning on content
   
     
      handleComponent={() => (
        <View style={styles.handle} />
      )}
      //backdropComponent={renderBackdrop}
      //ronChange={handleSheetChanges}
      isVisible={isVisible}
      backgroundStyle={styles.backgroundStyle}>
      <View style={styles.bottomSheetContent}>
        <View>
          <Text color="primary90" type="body_semibold" text="Find shops near you" align="center" />
          <Text
            color="primary90"
            type="small_regular"
            text="Enter your location to see vendors around you."
            align="center"
          />
        </View>
        <View style={styles.locationContainer}>
          <Location size="20" color="#f4ab19" variant="Outline" />
          <Text color="primary80" type="small_regular" text={userLocation} />
        </View>

        <Button title="Confirm" onPress={onPress} />
      </View>
    </ReusableBottomSheet>
  );
};

export default UserAddressBottomsheet;

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    rowGap: 10,
    //paddingHorizontal: wp(16),
  },
  locationContainer: {
    flexDirection: 'row',
    columnGap: 10,
    borderRadius: wp(8),
    paddingVertical: hp(13),
    paddingHorizontal: wp(16),
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(10)
  },
  handle: {
    width: wp(40),
    height: hp(4),
    borderRadius: hp(2),
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginTop: hp(10),
    marginBottom: hp(20),
  },
  backgroundStyle: {
    backgroundColor: 'white',
  }
});