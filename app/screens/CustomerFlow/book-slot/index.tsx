import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Screen, Text } from 'app/design-system';
import { CustomerBookSlotScreenProps } from 'app/navigation/types';
import { BookSlotComponent } from 'app/components';
import { BagIcon, BusIcon } from 'app/assets/svg';
import { ArrowRight2 } from 'iconsax-react-native';

const BookSlotScreen = ({ route, navigation: { navigate } }: CustomerBookSlotScreenProps) => {
  const { bookedDetails, address } = route.params
  return (
    <Screen>
      <View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text type='headline_3_bold' text="Book a Slot" />
          <View style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center'}}>
            <Text type='sub_semibold' text={address} truncateWords={5} />
            <ArrowRight2 size="12" color="#000"/>
          </View>
        </View>
        <View style={{ rowGap: 20, marginTop: 10}}>
          <BookSlotComponent
            icon={<BagIcon />}
            title="Click and Collect"
            desc_one="Packed and packaged for as low as $1.50"
            desc_two="Same day slots available"
            desc_three="Collect your shopping at the store, at a time that suits you"
            button_text="Book a Slot"
            onPress={() => { navigate('BOOK_SLOT_DETAIL_SCREEN', { bookedDetails, address, bookingType: "Click and Collect"})}}
          />
          <BookSlotComponent
            icon={<BusIcon />}
            title="Home Delivery"
            desc_one="Select your time that suits you best."
            desc_two="Book early to get same day delivery slot"
            desc_three="Collect your shopping at the store, at a time that suits you"
            button_text="Book a Slot"
            onPress={() => { navigate('BOOK_SLOT_DETAIL_SCREEN', { bookedDetails, address, bookingType: "Home Delivery"})}}
          />
        </View>
      </View>
    </Screen>
  );
};

export default BookSlotScreen;

const styles = StyleSheet.create({});
