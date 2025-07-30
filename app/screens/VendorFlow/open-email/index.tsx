import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button, Screen, Text } from 'app/design-system';
import { SuccessSvg } from 'app/assets/svg';
import { useNavigation } from '@react-navigation/native';

const OpenEmail = () => {

      const { navigate } = useNavigation()
  return (
    <Screen>
      <View style={styles.container}>
        <View style={{ rowGap: 5 }}>
          <Text type="headline_3_semibold" text="Check your inbox" />
          <Text
            type="small_regular"
            color="primary40"
            text="We've sent a password reset link to your@email.com. Click the link to create a new password"
          />
        </View>
        <View style={{ alignItems: 'center'}}>
            <SuccessSvg />
        </View>
        <View>
            <Button title='Open email app' onPress={()=>{ navigate('VENDOR_LOGIN_SCREEN')}} />
        </View>
      </View>
    </Screen>
  );
};

export default OpenEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 30
  },
});
