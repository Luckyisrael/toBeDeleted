import React, { useState } from 'react';
import { View, FlatList, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'app/design-system';
import OnboardingButton from '../onboarding-button';
import { hp, wp } from 'app/resources/config';

interface TimeSlot {
  time: string;
  price: string;
  bestValue?: boolean;
}

interface DateOption {
  label: string;
  date: string;
}

interface DeliveryDatePickerProps {
  onTimeSlotSelected: (date: string, time: string) => void;
}

const timeSlots: TimeSlot[] = [
  { time: '8am - 9am', price: '$5', bestValue: true },
  { time: '9am - 10am', price: '$4' },
  { time: '10am - 11am', price: '$3' },
  { time: '11am - 12pm', price: '$3' },
  { time: '12pm - 1pm', price: '$4' },
  { time: '1pm - 2pm', price: '$5', bestValue: true },
  { time: '2pm - 3pm', price: '$4' },
];

const generateDateOptions = (): DateOption[] => {
  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
  return days.map((day, index) => ({
    label: day,
    date: dayjs().add(index, 'day').format('MMM D'),
  }));
};

const DeliveryDatePicker = ({ onTimeSlotSelected }: DeliveryDatePickerProps) => {
  const dates = generateDateOptions();
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onTimeSlotSelected(selectedDate.date, selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.dateItem, selectedDate?.date === item.date && styles.selectedDate]}
            onPress={() => setSelectedDate(item)}>
            <Text
              type="emphasized_bold"
              color={selectedDate?.date === item.date ? 'black' : 'grey500'}
              text={item.label}
            />
            <Text
              type="small_regular"
              color={selectedDate?.date === item.date ? 'black' : 'grey500'}
              text={item.date}
            />
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
      />

      {selectedDate && (
        <View style={styles.timeContainer}>
          {timeSlots.map((slot) => (
            <Pressable
              key={slot.time}
              style={styles.timeSlot}
              onPress={() => setSelectedTime(slot.time)}>
              <View style={styles.row}>
                <Text type="small_semibold" style={styles.timeText} text={slot.time} />
                <Text
                //@ts-ignore
                  style={[styles.bestValue, { backgroundColor: slot.bestValue ? '#F3A218' : '' }]}
                  text={slot.bestValue ? 'Best Value' : ''}
                />
                <Text type="small_semibold" style={styles.price} text={slot.price} />
                <View style={styles.radioButton}>
                  {selectedTime === slot.time && (
                    <View
                      style={{ backgroundColor: 'black', height: 10, width: 10, borderRadius: 10 }}
                    />
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {selectedDate && selectedTime && (
        <OnboardingButton text={'Continue'} onPress={handleConfirm} />
      )}
    </View>
  );
};

export default DeliveryDatePicker;
const styles = StyleSheet.create({
  container: {},
  dateItem: {
    padding: hp(5),
    marginHorizontal: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  selectedDate: {
    borderBottomWidth: 4,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#555',
  },
  timeContainer: {
    marginTop: hp(12),
  },
  timeSlot: {
    padding: hp(8),
    borderRadius: wp(8),
    marginBottom: hp(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  timeText: {
    flex: 1,
  },
  price: {
    flex: 1,
    textAlign: 'center',
  },
  bestValue: {
    fontSize: 12,
    color: '#FFFFFF',

    borderRadius: 8,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 