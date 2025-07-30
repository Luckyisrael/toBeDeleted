import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, Image } from 'app/design-system';
import { hp, wp } from 'app/resources/config';

interface Props {
  image: any;
  storeName: string;
  orderId: string;
  dateTime: any;
  onPress: () => void;
}
const CompletedOrderComponents = ({ image, storeName, orderId, dateTime, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', columnGap: 10}}>
        <Image uri="" height={36} width={36} bR={18} />
        <View style={{ flex: 1}}>
          <Text text={storeName} color='primary80' type='body_medium'/>
          <Text text={dateTime} color='primary40' type='small_regular' />
        </View>
        <Text text={orderId} color='primary40' type='small_regular'/>
      </View>
      <Pressable onPress={onPress} style={{ alignSelf: 'flex-end'}}>
        <Text text="view order" color='secondary' type='small_regular' />
      </Pressable>
    </View>
  );
};

export default CompletedOrderComponents;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: hp(15),
    paddingHorizontal: wp(16)
  },
});
