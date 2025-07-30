import { ReusableBottomSheet } from 'app/design-system';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'app/design-system';
import { Ionicons } from '@expo/vector-icons';
import { hp, wp } from 'app/resources/config';

type Props = {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  isVisible: boolean;
  onClose: () => void;
};

const FilterBottomSheet = ({ selectedFilter, onSelectFilter, isVisible, onClose }: Props) => {
  const filters = ['all', 'restaurant', 'groceries', '1 mile radius'];
  const [localSelectedFilter, setLocalSelectedFilter] = useState(selectedFilter);

  const handleApplyFilter = () => {
    onSelectFilter(localSelectedFilter);
    onClose(); // Close bottom sheet after applying
  };

  const handleClearFilter = () => {
    setLocalSelectedFilter('all'); // Reset selection to default
  };

  return (
    <ReusableBottomSheet
      snapPoints={['40%']}
      enablePanDownToClose={true}
      showHandle={true}
      contentMarginTop={20}
      isVisible={isVisible}
      backgroundStyle={{ flex: 1, backgroundColor: 'white' }}
      onClose={onClose}>
      <View style={styles.container}>
        {/* Header with Close Button */}
        <View style={styles.header}>
          <Text text="Filter by distance" type="emphasized_medium" />
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-sharp" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTag, localSelectedFilter === filter && styles.selected]}
            onPress={() => setLocalSelectedFilter(filter)}>
            <Text text={filter} type="body_medium" color="primary40" />
            <View
              style={[styles.radioButton, localSelectedFilter === filter && styles.selectedBorder]}>
              {localSelectedFilter === filter && <View style={styles.innerCircle} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearFilter}>
            <Text text="Clear Filter" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApplyFilter}>
            <Text text="Apply Filter" color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ReusableBottomSheet>
  );
};

export default FilterBottomSheet;

const styles = StyleSheet.create({
  container: {
    
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(10),
  },

  filterTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(5),
    marginBottom: hp(5),
  },
  selected: {
    borderColor: '#09242D',
  },

  selectedText: {
    fontSize: 14,
    color: '#fff',
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
  selectedBorder: {
    borderColor: '#F4AB19',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F4AB19',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: hp(16),
    paddingHorizontal: wp(24),
    borderRadius: wp(24),
    alignItems: 'center',
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#E0E0E0',
  },
  applyButton: {
    backgroundColor: '#06181E',
  },
});
