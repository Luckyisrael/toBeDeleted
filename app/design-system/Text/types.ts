import { ReactNode } from 'react';
import { TextProps } from 'react-native';
import { TextStyle } from 'react-native/types';
import { ColorKeys } from 'app/resources/colors';
import { TypographyKeys } from 'app/resources/fonts';

export type AlignTypes = 'left' | 'center' | 'right' | 'auto';
export type TextTranformTypes = 'none' | 'capitalize' | 'uppercase' | 'lowercase' | undefined;

type TextDecorationLine =
  | 'none'
  | 'underline'
  | 'line-through'
  | 'underline line-through'
  | undefined;

export type AppTextProps = {
  text?: string;
  style?: TextStyle;
  color?: ColorKeys;
  align?: AlignTypes;
  type?: TypographyKeys;
  children?: React.ReactNode;
  onPress?: () => void;
  textTransform?: TextTranformTypes;
  textDecorationLine?: TextDecorationLine;
 
} & TextProps;
