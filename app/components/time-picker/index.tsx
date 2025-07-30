import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { hp, wp } from 'app/resources/config';
import { Text } from 'app/design-system';

interface TimePickerProps {
  name: string;
  control: any;
  placeholder: string;
  rules?: object;
}

const TimePicker= ({ name, control, placeholder, rules }: TimePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <View style={styles.input}>
              <Text 
                text={value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : placeholder}
              />
            </View>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  onChange(selectedDate.toISOString());
                }
              }}
            />
          )}
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: wp(158),
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: wp(12),
    paddingVertical: 10,
    height: hp(40),
    paddingLeft: 10
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default TimePicker;