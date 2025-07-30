import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Text } from 'app/design-system';
import { hp, wp } from 'app/resources/config';

type NotificationItemProps = {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
};

const NotificationItem = ({
  title,
  description,
  isEnabled,
  onToggle,
}: NotificationItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text color='primary80' type='body_medium' text={title} />
        <Text color='primary40' type='sub_regular' text={description} />
      </View>
      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#F4AB19' }}
        thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 14,
    rowGap: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
    rowGap: 8
  },
  switch: {
    transform: [{ scaleX: wp(0.6) }, { scaleY: hp(0.6) }],
  },
});

export default NotificationItem;