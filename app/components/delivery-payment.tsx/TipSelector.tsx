import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'app/design-system';
import { wp } from 'app/resources/config';

interface TipSelectorProps {
  onTipSelect: (tip: number) => void; // Callback for selected tip
}

export const TipSelector: React.FC<TipSelectorProps> = ({ onTipSelect }) => {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const tipAmounts = [2.5, 5.4, 10.44, 15.12];

  const handleTipSelection = (tip: number) => {
    setSelectedTip(tip);
    onTipSelect(tip); // Notify parent component
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={{ rowGap: 8 }}>
        <Text type="sub_semibold" color="black" text="Add Tip" />
        <Text
          type="small_medium"
          color="primary50"
          text="Show appreciation for great service by adding a tip"
        />
      </View>
      <View style={styles.tipContainer}>
        {tipAmounts.map((tip) => (
          <TouchableOpacity
            key={tip}
            style={[styles.tipOption, selectedTip === tip && styles.selectedTipOption]}
            onPress={() => handleTipSelection(tip)}>
            <Text type="small_medium" color="primary80" text={`£${tip}`} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    rowGap: 16,
    marginTop: 15
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipOption: {
    width: wp(78),
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#F3F3F3',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3'
  },
  selectedTipOption: {
    backgroundColor: '#FFF9ED',
    borderColor: '#F4AB19',
  },
});

export default TipSelector;
