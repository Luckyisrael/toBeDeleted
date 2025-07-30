import { TouchableOpacity } from 'react-native';
import React from 'react';
import type { TouchableProps } from './types';

const Touchable = ({ children, onPress, ui, disabled = false }: TouchableProps) => {
  return (
    <TouchableOpacity disabled={disabled} style={ui} activeOpacity={0.8} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Touchable;
