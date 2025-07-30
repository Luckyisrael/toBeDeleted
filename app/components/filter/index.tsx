import { wp } from 'app/resources/config';
import { ArrowDown2 } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'app/design-system';

interface FilterComponentProps {
  width?: number | string;
  filters: string[];
  onFilterPress: (filter: string) => void;
  defaultFilter?: string; // Optional: Allow parent to set initial filter
}

const FilterComponent = ({ width = '100%', filters, onFilterPress, defaultFilter }: FilterComponentProps) => {
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter || filters[0]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
    onFilterPress(filter);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <View style={[styles.container, { width }]}>
      <TouchableOpacity style={styles.filterItem} onPress={toggleDropdown}>
        <Text color="primary80" type="sub_medium" text={selectedFilter} />
        <ArrowDown2 size={20} color="#000000" variant="Outline" />
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dropdownItem,
                filter === selectedFilter && styles.selectedDropdownItem,
              ]}
              onPress={() => handleFilterPress(filter)}
            >
              <Text
                color={filter === selectedFilter ? 'primary80' : 'primary80'}
                type="sub_medium"
                text={filter}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(12),
    backgroundColor: '#fff',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 10, // Ensure dropdown is above other elements
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 10,
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f0f0',
  },
});

export default FilterComponent;