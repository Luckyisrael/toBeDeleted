import { StyleSheet, View } from 'react-native';
import React from 'react';
import { CustomerBookSlotDetailsScreenProps } from 'app/navigation/types';
import { Screen, Text } from 'app/design-system';
import { DeliveryDatePicker } from 'app/components';
import { ArrowRight2 } from 'iconsax-react-native';

const BookSlotDetailScreen = ({ route, navigation: { navigate }}: CustomerBookSlotDetailsScreenProps) => {
  const { bookedDetails, address, bookingType } = route.params

  const handleTimeSlotSelected = (date: string, time: string) => {
    // Here you can access all params and combine them
     navigate('SLOT_DETAIL_SCREEN', {
      date,
      time,
      bookedDetails,
      address,
      bookingType
    });
  };
  return (
    <Screen>
      <View>
        <View style={styles.header}>
          <View>
          <Text type='headline_3_bold'  text={bookingType} />
          <Text type='sub_medium'  color="grey500" text={address} numberOfLines={2} truncateWords={5}/>
          </View>
          <View style={styles.innerHeader}>
            <Text type='sub_semibold' text="change address" />
            <ArrowRight2 size="12" color="#000" />
          </View>
        </View>

        <DeliveryDatePicker onTimeSlotSelected={handleTimeSlotSelected} />
      </View>
    </Screen>
  );
};

export default BookSlotDetailScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  innerHeader: { flexDirection: 'row', columnGap: 5, alignItems: 'center' },
});
