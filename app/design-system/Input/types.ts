import { ViewStyle, TextStyle, TextInputProps } from 'react-native';

/**
 * Input types supported by the custom input component
 */
export type InputType = 'text' | 'password' | 'flexible';

/**
 * Custom input component props
 */
export interface CustomInputProps extends TextInputProps {
  /**
   * Type of input (text or password)
   * @default 'text'
   */
  type?: InputType;

  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;

  /**
   * Custom input style
   */
  inputStyle?: TextStyle;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  control: any;
  name: string;
  rules?: any;
  leftIcon?: any;
}

/**
 * Input color configuration
 */
export interface InputColorConfig {
  /**
   * Background color of the input
   */
  background: string;

  /**
   * Border color of the input
   */
  border: string;

  /**
   * Icon color for password input
   */
  iconColor: string;
}
