import React from 'react';
import { Text as CustomText, StyleSheet, TextStyle } from 'react-native';
import { typography } from 'app/resources/fonts';
import type { AppTextProps } from './types';
import useColors from 'app/hooks/useColors';
import { textAlignStyles } from './style';

// Add truncation types to your existing AppTextProps
type EnhancedAppTextProps = AppTextProps & {
  truncateWords?: number;
  truncateLines?: number;
  ellipsis?: string;
};

// Truncation helper function  
const truncateByWords = ({
  text,
  wordCount,
  ellipsis = '...'
}: {
  text: string;
  wordCount: number;
  ellipsis?: string;
}): string => {
  if (!text) return '';
  
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;
  
  return words.slice(0, wordCount).join(' ') + ellipsis;
};

const Text = (props: EnhancedAppTextProps) => {
  const {
    text = "",
    color = 'grey900',
    type = 'body_regular',
    align = 'auto',
    textTransform = 'none',
    style,
    onPress,
    textDecorationLine,
    truncateWords,
    truncateLines,
    ellipsis = '...',
    ...otherTextProps
  } = props;

  const { colors } = useColors();
  
  // Process text for truncation
  const processedText = truncateWords 
    ? truncateByWords({ 
        text, 
        wordCount: truncateWords, 
        ellipsis 
      })
    : text;

  const textAlign = textAlignStyles[align];
  const textType = typography[type];
  const textColor = { color: colors[color] };

  const baseTextStyle = {
    ...textType,
    ...textColor,
    ...textAlign,
  };

  return (
    <CustomText
      onPress={onPress}
      numberOfLines={truncateLines}
      ellipsizeMode={truncateLines ? "tail" : undefined}
      style={[
        baseTextStyle,
        {
          textTransform,
          textDecorationLine,
        },
        style,
      ]}
      {...otherTextProps}>
      {processedText}
    </CustomText>
  );
};

export default Text;