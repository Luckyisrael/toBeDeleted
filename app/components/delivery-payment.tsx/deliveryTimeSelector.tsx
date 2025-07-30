import { Calendar } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from 'app/design-system';
import { hp, wp } from 'app/resources/config';

interface TimeSelectorProps {
  onModeChange: (mode: 'delivery' | 'pickup') => void;
  onTimeSelect: (time: { type: string; date?: Date; slot?: string }) => void;
  subTotal: string;
  deliveryFee: string;
  serviceCharge: string;
  totalPrice: string;
}

const timeSlots = ['10:00am - 12:00pm', '12:00pm - 2:00pm', '2:00pm - 4:00pm'];

const DeliveryTimeSelector = ({ onModeChange, onTimeSelect, totalPrice, subTotal, deliveryFee, serviceCharge }: TimeSelectorProps) => {
  const [selectedTime, setSelectedTime] = useState<'right now' | 'schedule'>('right now');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleModeChange = (mode: 'right now' | 'schedule') => {
    setSelectedTime(mode);
    if (mode === 'right now') {
      onModeChange('pickup');
      onTimeSelect({ type: 'right now' });
    } else {
      onModeChange('delivery');
      onTimeSelect({ type: 'schedule', date: selectedDate, slot: selectedSlot });
    }
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date !== undefined) {
      setSelectedDate(date);
      onTimeSelect({ type: 'schedule', date, slot: selectedSlot });
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const renderDateTimePicker = () => {
    if (!showDatePicker) {
      return null;
    }

    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange}
        minimumDate={new Date()}
        style={{ width: '100%' }}
      />
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <Text type="sub_semibold" color="black" text="Available Delivery Time" />

      <TouchableOpacity style={styles.radioOption} onPress={() => handleModeChange('right now')}>
        <View style={styles.radioTextContainer}>
          <Calendar size="16" color="#324950" />
          <Text type="small_medium" color="primary50" text="Right Now" />
        </View>
        <View style={[styles.radioOuter, selectedTime === 'right now' && styles.radioOuterActive]}>
          {selectedTime === 'right now' && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.radioOption} onPress={() => handleModeChange('schedule')}>
        <View style={styles.radioTextContainer}>
          <Calendar size="16" color="#324950" />
          <Text type="small_medium" color="primary50" text="Schedule Delivery" />
        </View>
        <View style={[styles.radioOuter, selectedTime === 'schedule' && styles.radioOuterActive]}>
          {selectedTime === 'schedule' && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      {/* Payment Summary (Visible only in right now mode) */}
      {selectedTime === 'right now' && (
        <View style={styles.paymentSummary}>
          <Text text="Payment Summary" type="sub_semibold" color="black" />
          <View style={{ rowGap: 12 }}>
            <View style={styles.paymentSummaryText}>
              <Text type="small_medium" color="primary50" text="Subtotal" />
              <Text type="small_medium" color="primary50" text={`£${subTotal}`} />
            </View>
            <View style={styles.paymentSummaryText}>
              <Text type="small_medium" color="primary50" text="Delivery Fee" />
              <Text type="small_medium" color="primary50" text={`£${deliveryFee}`} />
            </View>
            <View style={styles.paymentSummaryText}>
              <Text type="small_medium" color="primary50" text="Service Charge" />
              <Text type="small_medium" color="primary50" text={`£${serviceCharge}`} />
            </View>
            <View style={styles.paymentSummaryText}>
              <Text type="sub_semibold" color="primary50" text="Total" />
              <Text type="sub_semibold" color="primary50" text={`£${totalPrice}`} />
            </View>
          </View>
        </View>
      )}

      {selectedTime === 'schedule' && (
        <View style={styles.sectionContainer}>
          <Text type="sub_semibold" color="primary80" text="🕒 Available slots" />
          <Text type="body_regular" color="primary80" text="Select Pickup Date & Time" />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={openDatePicker}>
            <Text type="body_regular" color="primary80" text={selectedDate.toDateString()} />
            <Calendar size="24" color="#324950" />
          </TouchableOpacity>

          {Platform.OS === 'ios' ? (
            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity 
                    style={styles.doneButton} 
                    onPress={() => setShowDatePicker(false)}>
                    <Text type="body_medium" color="primary80" text="Done" />
                  </TouchableOpacity>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    style={{ width: '100%' }}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )
          )}

          <Text type="body_regular" color="primary80" text="Select a time" />
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, selectedSlot === slot && styles.selectedTimeSlot]}
                onPress={() => {
                  setSelectedSlot(slot);
                  onTimeSelect({ type: 'schedule', date: selectedDate, slot });
                }}>
                <Text type="small_medium" color="primary80" text={slot} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const PickupTimeSelector = ({ onModeChange, onTimeSelect }: TimeSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date !== undefined) {
      setSelectedDate(date);
      onTimeSelect({ type: 'schedule', date, slot: selectedSlot });
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.sectionContainer}>
      <Text type="sub_semibold" color="primary80" text="🕒 Available slots" />
      <Text type="body_regular" color="primary80" text="Select Pickup Date & Time" />
      <TouchableOpacity style={styles.datePickerButton} onPress={openDatePicker}>
        <Text type="body_regular" color="primary80" text={selectedDate.toDateString()} />
        <Calendar size="24" color="#324950" />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.doneButton} 
                onPress={() => setShowDatePicker(false)}>
                <Text type="body_medium" color="primary80" text="Done" />
              </TouchableOpacity>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={{ flex: 1, width: '100%' }}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )
      )}

      <Text type="body_regular" color="primary80" text="Select a time" />
      <View style={styles.timeSlotsContainer}>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[styles.timeSlot, selectedSlot === slot && styles.selectedTimeSlot]}
            onPress={() => {
              setSelectedSlot(slot);
              onTimeSelect({ type: 'schedule', date: selectedDate, slot });
            }}>
            <Text type="small_medium" color="primary80" text={slot} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    rowGap: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioTextContainer: {
    flex: 1,
    flexDirection: 'row',
    columnGap: 2,
    alignItems: 'center',
  },
  paymentSummary: {
    rowGap: 12,
  },
  datePickerButton: {
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#CED3D5',
    borderRadius: wp(12),
    alignItems: 'center',
    paddingVertical: hp(8),
    paddingHorizontal: wp(10),
    flexDirection: 'row',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  timeSlot: {
    padding: 10,
    borderRadius: wp(8),
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },
  selectedTimeSlot: {
    backgroundColor: '#FFF9ED',
    borderColor: '#F4AB19',
    borderWidth: 1
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#F4AB19',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F4AB19',
  },
  separator: {
    borderBottomWidth: 0.5,
    borderColor: '#CED3D5',
    marginVertical: 2,
  },
  paymentSummaryText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  doneButton: {
    alignSelf: 'flex-end',
    padding: 16,
  }
});

export { DeliveryTimeSelector, PickupTimeSelector };