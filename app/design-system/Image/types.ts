import { ColorDefinitions, ColorKeys } from 'app/resources/colors';
import { ImageProps, ImageStyle } from 'react-native';

export type CustomImageProps = {
  uri: string;
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  bR?: number;
  bG?: ColorDefinitions['warning2'] | ColorKeys;
  ui?: ImageStyle;
  fill?: boolean;
} & ImageProps;
