import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Text } from 'app/design-system';
import { hp, wp } from 'app/resources/config';
import { FontAwesome6 } from '@expo/vector-icons';
import { BikeIcon } from 'app/assets/svg';

type Store = {
  id: string;
  name: string;
  tag: string;
  price: string;
  distance: string;
  deliveryTime: string;
  image: any;
  rating?: number; // Added rating property
};

type Props = {
  store: Store;
  onViewStore: () => void;
};

const SearchResultCard = ({ store, onViewStore }: Props) => {
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesome6
        key={index}
        name={index < rating ? 'star' : 'star-half-stroke'}
        size={12.8}
        color={index < rating ? '#f4ab19' : '#ccc'}
        style={{ marginRight: 4 }}
      />
    ));
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onViewStore}>
      <Image
        uri={store.image || ''}
        height={78}
        bR={8}
        
        ui={{ width: '100%', borderBottomLeftRadius: wp(8), borderBottomRightRadius: wp(8) }}
      />
      <View style={styles.infoContainer}>
        <Text type="small_semibold" text={store.name} truncateWords={2} />
        <Text type="small_medium" color="grey600" text={`${store.tag} · ${store.price} Delivery fee`} style={{ flexWrap: 'wrap'}}/>
        <View style={{ rowGap: 2}}>
          
          <View style={styles.starsContainer}>{renderStars(store.rating)}</View>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
          <Text type="small_medium" color="grey600" text={`${store.distance} away`} />
          <BikeIcon />
          <Text type="small_medium" color="grey600" text={"£ 1.50"} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: wp(8),
    borderWidth: 1,
    borderColor: '#ddd',
    width: '48%',
    marginBottom: 20
  },
  infoContainer: {
    columnGap: hp(5),
    padding: wp(10),
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
