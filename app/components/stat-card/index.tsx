import { hp, wp } from 'app/resources/config';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'app/design-system';

const StatCard = ({ title, icon, figure }: { title: string; icon: any; figure: string }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text type='small_medium' text={title} />
        <View>{icon}</View>
      </View>
      <Text color='primary80' type='emphasized_medium' text={figure}  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: wp(10),
    paddingHorizontal: wp(12),
    paddingVertical: hp(15),
    gap: 24,
    borderWidth: 0.5,
    borderColor: '#CED3D5',
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  figure: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StatCard;
