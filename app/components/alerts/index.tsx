import { Text } from 'app/design-system';
import useColors from 'app/hooks/useColors';
import React from 'react';
import { View } from 'react-native';
import { alertsStyles } from './styles';
import { AlertsDataProps, AlertsProps } from './types';
import { CloseCircle, TickCircle, Warning2 } from 'iconsax-react-native';

const Alerts = ({ message, type, title, titleColor, textColor }: AlertsProps) => {
  const { colors } = useColors();

  const alertData = (): AlertsDataProps => {
    switch (type) {
      case 'error':
        return {
          icon: <CloseCircle size="20" color="#ffffff" variant="Bold" />,
          bG: 'notificationError',
          title: title || 'Error',
          titleColor: 'error1', 
          textColor: 'white', 
        };
      case 'success':
        return {
          icon: <TickCircle size="20" color="#ffffff" variant="Bold" />,
          bG: 'success4',
          title: title || 'Success',
          titleColor: 'white',
          textColor: 'white',
        };
      case 'attention':
        return {
          icon: <Warning2 size="20" color="#dce775" variant="Bold" />,
          bG: 'warning4',
          title: title || 'Attention',
          titleColor: 'primaryText',
          textColor: 'primaryText',
        };
      default:
        return {
          icon: <TickCircle size="20" color="#ffffff" variant="Bold" />,
          bG: 'success4',
          title: title || 'Success',
          titleColor: 'white',
          textColor: 'white',
        };
    }
  };

  const data = alertData();
  const styles = alertsStyles({ colors, bG: data.bG });

  return (
    <View style={styles.alertWrap}>
      {data.icon}
      <View style={styles.alertMsgWrap}>
        <Text
          type="small_regular"
          color={data.textColor} 
          text={message}
          truncateWords={5}
        />
      </View>
    </View>
  );
};

export default Alerts;