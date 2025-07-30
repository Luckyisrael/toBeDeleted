import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from 'app/resources/config';
import useColors from 'app/hooks/useColors';
import type { ScreenProps } from './types';
import { ColorDefinitions } from 'app/resources/colors';
//@ts-ignore
import { HeaderBackButton } from 'app/components';

const Screen = ({
  children,
  pH = 20,
  withBackBtn = true,
  headerTitle,
  headerRight,
  onBackHandlerPress,
  bgColor,
}: ScreenProps) => {
  const { colors } = useColors();
  const styles = ScreenStyles({ colors, pH });
  return (
    <SafeAreaView style={[styles.safeAreaWrap, { backgroundColor: bgColor}]}>
      <StatusBar translucent barStyle={'dark-content'} animated backgroundColor={colors.white} />
      {withBackBtn && (
        <HeaderBackButton
          RightComponent={headerRight}
          pageTitle={headerTitle}
          onPress={onBackHandlerPress}
        />
      )}
      <View style={{ paddingHorizontal: wp(pH), flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
};

export default Screen;

const ScreenStyles = ({ colors }: { colors: ColorDefinitions; pH: number }) =>
  StyleSheet.create({
    safeAreaWrap: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
