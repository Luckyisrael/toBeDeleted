import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Button, Text } from 'app/design-system';
import OnboardingButton from '../onboarding-button';

type BookingTypeProps = {
  title: string;
  icon: any;
  onPress: () => void;
  desc_one: string;
  desc_two: string;
  desc_three: string;
  button_text: string;
};

const BookSlotComponent = ({
  icon,
  title,
  onPress,
  desc_one,
  desc_two,
  desc_three,
  button_text,
}: BookingTypeProps) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
        <View style={{ backgroundColor: '#F8F8F8', padding: 20, borderRadius: 10 }}>{icon}</View>
        <View style={{ rowGap: 10}}>
          <Text type='body_semibold' text={title} />
          <Text type='small_regular' text={desc_one} />          
          <Text type='small_regular' text={desc_two} />
        </View>
      </View>
      <Text type='small_regular' text={desc_three} />
      <OnboardingButton text={button_text} onPress={onPress} />
    </View>
  );
};

export default BookSlotComponent;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    rowGap: 15,
    borderColor: '#D0D5DD'
  },
});
