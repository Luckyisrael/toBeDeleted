import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import { CustomerSlotDetailsScreenProps } from 'app/navigation/types';
import { Button, KeyboardWrapper, Screen, Text } from 'app/design-system';
import { useRoute } from '@react-navigation/native';
import { hp, wp } from 'app/resources/config';
import { AntDesign } from '@expo/vector-icons';

const SlotDetailScreen = ({ navigation, route }: CustomerSlotDetailsScreenProps) => {
  const { date, time, bookedDetails, address, bookingType } = route.params;

  // Destructuring each property individually
  const category = bookedDetails?.[0]?.category || {};
  const finalPrice = bookedDetails?.[0]?.finalPrice;
  const discount = bookedDetails?.[0]?.discount;
  const quantity = bookedDetails?.[0]?.quantity;
  const title = bookedDetails?.[0]?.title;

  return (
    <Screen>
      <KeyboardWrapper>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <View>
              <Text type="headline_3_bold" text="Booked Slot" />
              <Text type="small_regular" text={address} truncateWords={7} color="grey500" />
            </View>

            <View style={{ rowGap: 10 }}>
              <View style={styles.clickCollect}>
                <View style={{ rowGap: 15 }}>
                  <Text type="emphasized_bold" text={bookingType} />
                  <Text type="small_regular" text={`${quantity} items    $${finalPrice}.00`} />
                </View>
                <View style={{ rowGap: 15 }}>
                  <Text
                    type="small_regular"
                    text={address}
                    numberOfLines={2}
                    truncateLines={3}
                    truncateWords={3}
                  />
                  <Text type="emphasized_bold" text={time} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                <AntDesign name="exclamationcircleo" size={15} color="red" />
                <Text
                  type="small_regular"
                  text="Checkout by 1:30pm ensure to keep your slot"
                  color="error"
                />
              </View>
            </View>

            <View>
              <Button
                title="Change Slot"
                variant="secondary"
                onPress={() => {
                  navigation.navigate('BOOK_SLOT_DETAIL_SCREEN', { bookedDetails, bookingType });
                }}
              />
            </View>

            <View style={styles.collectionInstructions}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text type="emphasized_bold" text="Collection instructions" />
                <Text text="  (Optional)" />
              </View>
              <TextInput placeholder="Write a text here" style={styles.textArea} />
              <Pressable style={styles.sendButton}>
                <Text text="Send" align="center" />
              </Pressable>
            </View>
          </View>

          <Button
            title="Pay"
            onPress={() => {
              navigation.navigate('ORDER_DETAIL_SCREEN', { bookedDetails });
            }}
          />
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default SlotDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    rowGap: 30,
    marginBottom: wp(30),
  },
  textArea: {
    height: hp(166),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#AAAAAA',
  },
  sendButton: {
    paddingVertical: wp(15),
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'flex-end',
    width: wp(160),
    borderColor: '#AAAAAA',
  },
  collectionInstructions: {
    rowGap: 20,
  },
  clickCollect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
  },
});
