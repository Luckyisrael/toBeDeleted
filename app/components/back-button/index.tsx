import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Text, Touchable } from 'app/design-system';
import useColors from 'app/hooks/useColors';
import { useNavigation } from '@react-navigation/native';
import { ColorDefinitions } from 'app/resources/colors';
import { ArrowLeft2 } from 'iconsax-react-native';
import { LeftArrow } from 'app/assets/svg';

const HeaderBackButton = ({
  pageTitle,
  onPress,
  RightComponent,
}: {
  pageTitle?: string;
  onPress?: () => void;
  RightComponent?: any;
}) => {
  const { canGoBack, goBack } = useNavigation();
  const { colors } = useColors();
  const styles = headerBackButtonStyles({ colors });
  return (
    <View style={styles.backHeaderWrap}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Touchable onPress={onPress ? onPress : goBack}>
          <View style={styles.backBtnBg}>
            <LeftArrow />
            <Text type={'small_medium'} text={'Back'} color="primary80" />
          </View>
        </Touchable>
        {pageTitle && <Text type={'emphasized_medium'} text={pageTitle} color="grey400" />}
      </View>
      {Boolean(RightComponent) ? RightComponent : <View style={styles.dummyComponent} />}
    </View>
  );
};

export default HeaderBackButton;

export const headerBackButtonStyles = ({ colors }: { colors: ColorDefinitions }) =>
  StyleSheet.create({
    backHeaderWrap: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtnBg: {
      alignSelf: 'flex-start',
      padding: 8,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      columnGap : 5
    },
    dummyComponent: {
      width: 40,
      height: 40,
    },
  });
