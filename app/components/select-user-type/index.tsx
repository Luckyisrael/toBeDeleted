import { StyleSheet, Pressable, View } from 'react-native';
import React from 'react';
import { UserProps } from './type';
import { Text } from 'app/design-system';
import { hp, wp } from 'app/resources/config';

const SelectUserType = ({ options, onToggle }: UserProps) => {
  return (
    
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option.id}
          style={styles.optionContainer}
          onPress={() => onToggle(option.id)}>
          <View style={{ flexDirection: 'row', columnGap: 10 }}>
            <View>{option.icon}</View>
            <View>
              <Text type="body_medium" text={option.label} color="black" />
              <Text text={option.description} type="small_regular" color="primary40" />
            </View>
          </View>
          <View style={[styles.radioButton, option.isSelected && styles.selectedBorder]}>
            <View style={option.isSelected && styles.selected} />
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default SelectUserType;

const styles = StyleSheet.create({
  container: {
    rowGap: 15,
  },
  optionContainer: {
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: hp(16),
    paddingVertical: hp(12),
    borderRadius: wp(12),
    borderColor: '#98A2B3',
    columnGap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderColor: '#F4AB19',
    backgroundColor: '#F4AB19',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  selectedBorder: {
    borderColor: '#F4AB19',
  },
});
