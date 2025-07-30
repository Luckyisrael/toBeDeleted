import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { hp, wp } from 'app/resources/config';
import { RightArrow } from 'app/assets/svg';
import { Text } from 'app/design-system';
import useColors from 'app/hooks/useColors';

interface Props {
  onPress: () => void;
  text: string;
}

const OnboardingButton = ({ onPress, text }: Props) => {
    const colors = useColors();
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text type='body_bold' color="white" text={text} />
      <RightArrow />
    </Pressable>
  );
};

export default OnboardingButton;

const styles = StyleSheet.create({
  container: {
    height: hp(48),
    borderRadius: wp(30),
    backgroundColor: '#324950',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10
  },
});
