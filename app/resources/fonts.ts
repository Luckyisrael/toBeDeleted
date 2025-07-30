import { StyleSheet, TextStyle } from 'react-native';
import { fs } from './config';

export type FONT_FAMILY_TYPES = 'Inter';

export type FONT_WEIGHT = 'Regular' | 'Medium' | 'Semibold' | 'Bold' | 'Black' | 'Heavy' | 'Thin';

export const generateFontFamily = (fontFamily: FONT_FAMILY_TYPES, weight: FONT_WEIGHT) =>
  `${fontFamily}${weight}`;

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

type TypographyProps = {
  size: number;
  family: FONT_FAMILY_TYPES;
  weight: FONT_WEIGHT;
  lineHeight?: number;
  letterSpacePercent?: IntRange<0, 101>; // min 0 & max 100
};

export const generateTypography = ({
  size,
  family,
  weight,
  lineHeight,
  letterSpacePercent = 0,
}: TypographyProps) => {
  return {
    fontFamily: generateFontFamily(family, weight),
    fontSize: fs(size),
    lineHeight: lineHeight ? fs(lineHeight) : undefined,
    letterSpacing: fs(size) * (letterSpacePercent / 100),
  };
};

export type TypographyKeys =
  | 'display_1_regular'
  | 'display_2_regular'
  | 'display_3_regular'
  | 'display_4_regular'
  | 'headline_1_regular'
  | 'headline_2_regular'
  | 'headline_3_regular'
  | 'emphasized_regular'
  | 'body_regular'
  | 'small_regular'
  | 'sub_regular'
  | 'display_1_medium'
  | 'display_2_medium'
  | 'display_3_medium'
  | 'display_4_medium'
  | 'headline_1_medium'
  | 'headline_2_medium'
  | 'headline_3_medium'
  | 'emphasized_medium'
  | 'body_medium'
  | 'small_medium'
  | 'sub_medium'
  | 'display_1_semibold'
  | 'display_2_semibold'
  | 'display_3_semibold'
  | 'display_4_semibold'
  | 'headline_1_semibold'
  | 'headline_2_semibold'
  | 'headline_3_semibold'
  | 'emphasized_semibold'
  | 'body_semibold'
  | 'small_semibold'
  | 'sub_semibold'
  | 'display_1_bold'
  | 'display_2_bold'
  | 'display_3_bold'
  | 'display_4_bold'
  | 'headline_1_bold'
  | 'headline_2_bold'
  | 'headline_3_bold'
  | 'emphasized_bold'
  | 'body_bold'
  | 'small_bold'
  | 'sub_bold';

export type TypographyDefinitions = { [key in TypographyKeys]: TextStyle };

export const typography: TypographyDefinitions = StyleSheet.create({
  //Regular Fonts

  display_1_regular: generateTypography({
    size: 72,
    lineHeight: 72,
    family: 'Inter',
    weight: 'Regular',
  }),

  display_2_regular: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Regular',
  }),

  display_3_regular: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Regular',
  }),

  display_4_regular: generateTypography({
    size: 40,
    lineHeight: 40,
    family: 'Inter',
    weight: 'Regular',
  }),

  headline_1_regular: generateTypography({
    size: 22,
    lineHeight: 28,
    family: 'Inter',
    weight: 'Bold',
  }),

  headline_2_regular: generateTypography({
    size: 16,
    lineHeight: 20,
    family: 'Inter',
    weight: 'Medium',
  }),

  headline_3_regular: generateTypography({
    size: 20,
    lineHeight: 28,
    family: 'Inter',
    weight: 'Regular',
  }),

  emphasized_regular: generateTypography({
    size: 16,
    lineHeight: 24,
    family: 'Inter',
    weight: 'Regular',
  }),

  body_regular: generateTypography({
    size: 14,
    lineHeight: 16.8,
    family: 'Inter',
    weight: 'Regular',
  }),

  small_regular: generateTypography({
    size: 12,
    lineHeight: 18,
    family: 'Inter',
    weight: 'Regular',
  }),

  sub_regular: generateTypography({
    size: 10,
    lineHeight: 16,
    family: 'Inter',
    weight: 'Regular',
  }),

  // Mediums Fonts

  display_1_medium: generateTypography({
    size: 12,
    lineHeight: 18,
    family: 'Inter',
    weight: 'Medium',
  }),

  display_2_medium: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Medium',
  }),

  display_3_medium: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Medium',
  }),

  display_4_medium: generateTypography({
    size: 40,
    lineHeight: 40,
    family: 'Inter',
    weight: 'Medium',
  }),

  headline_1_medium: generateTypography({
    size: 32,
    lineHeight: 40,
    family: 'Inter',
    weight: 'Medium',
  }),

  headline_2_medium: generateTypography({
    size: 24,
    lineHeight: 32,
    family: 'Inter',
    weight: 'Medium',
  }),

  headline_3_medium: generateTypography({
    size: 20,
    lineHeight: 28,
    family: 'Inter',
    weight: 'Medium',
  }),

  emphasized_medium: generateTypography({
    size: 16,
    lineHeight: 24,
    family: 'Inter',
    weight: 'Medium',
  }),

  body_medium: generateTypography({
    size: 14,
    lineHeight: 20,
    family: 'Inter',
    weight: 'Medium',
  }),

  small_medium: generateTypography({
    size: 12,
    lineHeight: 18,
    family: 'Inter',
    weight: 'Medium',
  }),

  sub_medium: generateTypography({
    size: 10,
    lineHeight: 16,
    family: 'Inter',
    weight: 'Medium',
  }),

  // Semibold Fonts

  display_1_semibold: generateTypography({
    size: 72,
    lineHeight: 72,
    family: 'Inter',
    weight: 'Semibold',
  }),

  display_2_semibold: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Semibold',
  }),

  display_3_semibold: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Semibold',
  }),

  display_4_semibold: generateTypography({
    size: 40,
    lineHeight: 40,
    family: 'Inter',
    weight: 'Semibold',
  }),

  headline_1_semibold: generateTypography({
    size: 32,
    lineHeight: 40,
    family: 'Inter',
    weight: 'Semibold',
  }),

  headline_2_semibold: generateTypography({
    size: 24,
    lineHeight: 32,
    family: 'Inter',
    weight: 'Semibold',
  }),

  headline_3_semibold: generateTypography({
    size: 20,
    lineHeight: 24,
    family: 'Inter',
    weight: 'Semibold',
  }),

  emphasized_semibold: generateTypography({
    size: 18,
    lineHeight: 24,
    family: 'Inter',
    weight: 'Semibold',
  }),

  body_semibold: generateTypography({ //updated
    size: 16, 
    lineHeight: 20,
    family: 'Inter',
    weight: 'Semibold',
  }),

  small_semibold: generateTypography({
    size: 14,
    lineHeight: 18,
    family: 'Inter',
    weight: 'Semibold',
  }),

  sub_semibold: generateTypography({
    size: 12,
    lineHeight: 16,
    family: 'Inter',
    weight: 'Semibold',
  }),

  // Bolds
  display_1_bold: generateTypography({
    size: 72,
    lineHeight: 72,
    family: 'Inter',
    weight: 'Bold',
  }),

  display_2_bold: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Bold',
  }),

  display_3_bold: generateTypography({
    size: 44,
    lineHeight: 44,
    family: 'Inter',
    weight: 'Bold',
  }),

  display_4_bold: generateTypography({
    size: 40,
    lineHeight: 40,
    family: 'Inter',
    weight: 'Bold',
  }),

  headline_1_bold: generateTypography({
    size: 28,
    lineHeight: 40,
    family: 'Inter',
    weight: 'Bold',
  }),

  headline_2_bold: generateTypography({
    size: 24,
    lineHeight: 32,
    family: 'Inter',
    weight: 'Bold',
  }),

  headline_3_bold: generateTypography({
    size: 20,
    lineHeight: 28,
    family: 'Inter',
    weight: 'Bold',
  }),

  emphasized_bold: generateTypography({
    size: 16,
    lineHeight: 24,
    family: 'Inter',
    weight: 'Bold',
  }),

  body_bold: generateTypography({ // updated
    size: 14,
    lineHeight: 16,
    family: 'Inter',
    weight: 'Bold',
  }),

  small_bold: generateTypography({
    size: 12,
    lineHeight: 18,
    family: 'Inter',
    weight: 'Bold',
  }),

  sub_bold: generateTypography({
    size: 10,
    lineHeight: 16,
    family: 'Inter',
    weight: 'Bold',
  }),
});
