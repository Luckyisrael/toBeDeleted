import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button, Screen, Text } from 'app/design-system';
import { SuccessSvg } from 'app/assets/svg';
import { useNavigation } from '@react-navigation/native';

const VerificationSuccessScreen = () => {

      const { navigate } = useNavigation()
  return (
    <Screen>
      <View style={styles.container}>
        <View style={{ rowGap: 5 }}>
          <Text type="headline_3_semibold" text="Email verified successfully🎉" />
          <Text
            type="small_regular"
            color="primary40"
            text="You are all set. Start expolring the best food items near you!"
          />
        </View>
        <View style={{ alignItems: 'center'}}>
            <SuccessSvg />
        </View>
        <View>
            <Button title='Login' onPress={()=>{ navigate('VENDOR_LOGIN_SCREEN')}} />
        </View>
      </View>
    </Screen>
  );
};

export default VerificationSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 30
  },
});
