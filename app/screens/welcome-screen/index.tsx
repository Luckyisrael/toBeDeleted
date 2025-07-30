import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { AnimatedWrapper, Button, Screen, Text } from 'app/design-system';
import { WelcomeScreenProps } from 'app/navigation/types';
import { WelcomeSvg } from 'app/assets/svg';
import { hp, wp } from 'app/resources/config';
import useUserStore from 'app/store/use-user-store';
import { ChangeAddressModal } from 'app/modals';
import PlacedOrderModal from 'app/modals/PlacedOrderModal';
import ErrorPlacingOrderModal from 'app/modals/ErrorPlacingOrderModal';
import HampperModal from 'app/modals/HampperModal';

const WelcomeScreen = ({ navigation: { navigate } }: WelcomeScreenProps) => {


  return (
    <Screen withBackBtn={false} bgColor='#fff'>
      <View style={styles.container}>
        {/* Image Section */}
        <View style={{ flex: 1 }}>
          <View style={styles.imageContainer}>
            <WelcomeSvg />
          </View>
        </View>

        {/* Text and Button Section */}
        <View style={styles.textContainer}>
          <View style={styles.headlineContainer}>
            <Text type="headline_3_semibold" color="grey900" text="Craving something" />
            <Text
              type="headline_3_semibold"
              color="grey900"
              text=" fresh?"
              style={styles.highlightedText}
            />
          </View>
          <Text
            type="headline_3_semibold"
            color="grey900"
            text="Let's get it to you"
            align="center"
          />
          <Text
            type="body_regular"
            color="grey900"
            align="center"
            text="Order fresh food items from trusted vendors and get them delivered to your doorstep."
          />
          {/* Button */}
         
            <Button
              title="Get Started"
              onPress={() => navigate('PERSONALIZE_NOTIFICATION_SCREEN')}
              containerStyle={{ marginVertical: hp(12) }}
            />
            
        </View>
      
      </View>
    </Screen>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9ED',
    flex: 3,
    borderRadius: 12,
    marginVertical: hp(20),
  },
  textContainer: {
    marginVertical: hp(20),
    rowGap: hp(5),
  },
  headlineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedText: {
    borderBottomWidth: 1.5,
    borderColor: '#F4AB19',
  },
});
