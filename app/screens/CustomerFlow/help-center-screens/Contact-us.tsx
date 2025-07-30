import { Screen } from 'app/design-system';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Text} from 'app/design-system';
import { ContactUsSvg } from 'app/assets/svg';

const CustomerContactUsScreen = () => {
  return (
    <Screen bgColor='#fff'>
      <View style={styles.container}>
       <View style={{ rowGap: 4}}>
       <Text text='Contact us' type='emphasized_medium'/>
        <Text text='Need urgent assistance?'/>
        <Text text='Email our team at support@sweeftly.co.uk'/>
        
       </View>
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <ContactUsSvg />
       
        </View>
        <Text align='center' text='Have a detailed request? Send an email at [support@sweeftly.co.uk] and we will respond within 24 hours.'/>
      
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    rowGap: 30
  },

});

export default CustomerContactUsScreen;
