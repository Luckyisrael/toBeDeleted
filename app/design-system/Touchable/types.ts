import { ViewStyle } from 'react-native';

export type TouchableProps = {
  children: React.ReactElement;
  onPress: () => void;
  ui?: ViewStyle;
  disabled?: boolean;
};
