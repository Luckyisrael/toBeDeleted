import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'app/design-system';
import SkeletonLoader from '../skeleton-loader';
import { Heart } from 'iconsax-react-native';
import { SepeartionIcon } from 'app/assets/svg';

interface Props {
  openingHours: string;
  deliveryTimeFrame: string;
  loading?: boolean;
}

const OpeningHoursDeliveryTime: React.FC<Props> = ({ openingHours, deliveryTimeFrame, loading }) => {
  return (
    <View style={styles.container}>
      <InfoItem label="Opening Hours" value={openingHours} loading={loading} />
      <SepeartionIcon />
      <InfoItem label="Delivery Time" value={deliveryTimeFrame} loading={loading} />
     {/** <SepeartionIcon />
      <InfoItem label="Delivery Fee" value="£ 1.50" loading={loading} />
       <SepeartionIcon />
      <InfoItem label="Favorite" icon={<Heart size={16} color="#f4ab19" variant="Bold" />} loading={loading} />*/}
      
    </View>
  );
};

export default OpeningHoursDeliveryTime;

/**
 * Reusable component for displaying label-value pairs with a loader fallback.
 */
const InfoItem = ({ label, value, icon, loading }: { label: string; value?: string; icon?: React.ReactNode; loading?: boolean }) => {
  return (
    <View style={styles.infoItem}>
      <Text type="sub_medium" text={label} numberOfLines={1} ellipsizeMode="tail" color="primary30" />
      {loading ? (
        <SkeletonLoader width={100} height={15} bR={15} style={styles.loader} />
      ) : icon ? (
        icon
      ) : (
        <Text type="sub_semibold" text={value ?? ''} numberOfLines={1} ellipsizeMode="tail" color="primary80"  />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows wrapping if content overflows
    paddingVertical: 10,
    columnGap: 10,
    alignItems: 'center',
  },
  infoItem: {
    minWidth: 80, // Ensures each section has a minimum width
    flexShrink: 1, // Prevents text from overflowing
   rowGap: 3
  },
  loader: {
    marginVertical: 5,
  },
});
