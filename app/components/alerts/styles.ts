import { ColorDefinitions, ColorKeys } from "app/resources/colors";
import { hp, wp } from "app/resources/config";
import { StyleSheet } from "react-native";

export const alertsStyles = ({
  colors,
  bG,
}: {
  colors: ColorDefinitions;
  bG: ColorKeys;
}) =>
  StyleSheet.create({
    alertWrap: {
      padding: wp(12),
      paddingVertical: hp(10),
      backgroundColor: colors[bG],
      width: wp(212),
      columnGap: wp(10),
      height: hp(38),
      flexDirection: 'row',
      borderRadius: wp(50),
      zIndex: 1000
    },
    alertMsgWrap: {
      flex: 1,
      rowGap: 4,
    },
  });
