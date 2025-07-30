import { Pressable, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Image, Text } from 'app/design-system';
import { Food1, LogoColored } from 'app/assets/images';
import { ArrowDown2, ArrowUp2, Copy, TickCircle } from 'iconsax-react-native';
import { OrderSummaryDivider } from 'app/assets/svg';
import { hp, wp } from 'app/resources/config';
import dayjs from 'dayjs';

type OngoingOrderProps = {
  shopIcon?: any;
  shopName?: string;
  confirmationCode?: string;
  numberOfOrderedItems?: number;
  deliveryTime?: string;
  onViewReceipt?: () => void;
  onTrackOrder?: () => void;
};

const OngoingOrders = ({
  shopIcon,
  shopName,
  confirmationCode,
  numberOfOrderedItems,
  deliveryTime,
  onViewReceipt,
  onTrackOrder,
}: OngoingOrderProps) => {
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    height.value = withTiming(expanded ? 0 : 1, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value ? 'auto' : 0,
    opacity: height.value,
    overflow: 'hidden',
  }));

  const DateTime = dayjs(deliveryTime).format('DD/MM/YYYY HH:mm');

  return (
    <View style={styles.container}>
      <Pressable style={styles.expansionButton} onPress={toggleExpand}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
          <Image uri={Food1} width={31} height={31} />
          <Text text={shopName} type='small_medium' color='primary80' />
        </View>
        {expanded ? (<ArrowUp2 size="18" color="#000000" />) : (<ArrowDown2 size="18" color="#000000" />)}
        
      </Pressable>
      <Animated.View style={[animatedStyle]}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
          <Text text={confirmationCode} type='emphasized_bold' color='primary80' />
          <Text
            align="center"
            type='small_regular'
            color='primary40'
            text={'You will be required to show this receipt with the confirmation code above to our riders.'}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text text="Items Ordered" type='small_medium' color='primary40' />
          <Text text={`${numberOfOrderedItems} Items`} type='small_medium' color='primary40' />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text text="Delivery Time" type='small_medium' color='primary40' />
          <Text text={`${DateTime} mins`} type='small_medium' color='primary40' />
        </View>
        <View style={{marginTop: 10}}>
          
          <View style={styles.divider} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  }}>
          {/**<Pressable onPress={onTrackOrder} style={{ paddingVertical: hp(10) }}>
            <Text text="Track order" color='cyan1' type='small_medium' align='right' style={{ textDecorationLine: 'underline'}} />
          </Pressable> */}
          <Pressable onPress={onViewReceipt} style={{ paddingVertical: hp(10) }}>
            <Text text="View order" color='cyan1' type='small_medium' align='right' style={{ textDecorationLine: 'underline'}}/>
          </Pressable>
          </View>
         {/** <View style={styles.riderDetailsContainer}>
            <Text text="Rider's details" />
            <View>
              {[{ label: "Rider's name", value: "Samuel Ekom" }, { label: "Vehicle", value: "gWAGON BENZ" }, { label: "Contact", value: "QWERTU09742" }].map((item, index) => (
                <View key={index} style={[styles.row, { paddingVertical: hp(5) }]}> 
                  <Text text={item.label} type='small_medium' color='primary40' />
                  {item.label === "Contact" ? (
                    <View style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}>
                      <Text text={item.value} type='small_medium' color='primary40' />
                      <Copy size="14" color="#F4AB19" variant="Outline" />
                    </View>
                  ) : (
                    <Text text={item.value} type='small_medium' color='primary40' />
                  )}
                </View>
              ))}
            </View>
          </View> */}
        </View>
      </Animated.View>
    </View>
  );
};

export default OngoingOrders;


const styles = StyleSheet.create({
  container: {
    rowGap: 10,
    backgroundColor: '#ffffff',
    paddingVertical: hp(10),
    paddingHorizontal: wp(10),
    borderRadius: wp(12)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(8)
  },
  divider: {
    borderBottomWidth: 0.5,
    borderColor: '#ced3d5'
  },
  expansionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  orderSumaryDivider: {
    marginLeft: 8,
  },
  riderDetailsContainer: { 
    backgroundColor: '#FAFAFA', 
    borderRadius: wp(8), 
    paddingHorizontal: wp(16), 
    paddingVertical: hp(12),
    rowGap: 8
    }
});
