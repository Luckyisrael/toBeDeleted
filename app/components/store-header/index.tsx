import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Props, StoreDetialsProps } from './types';
import { Image, Text } from 'app/design-system';
import { Entypo, EvilIcons } from '@expo/vector-icons'; 
import SkeletonLoader from '../skeleton-loader';
import { Location } from 'iconsax-react-native';

const StoreHeader = ({ store, onViewStore, isLoading }: Props) => {
  const renderStars = (storeRating: number = 0) => {
    const maxStars = 5;
    const fullStars = Math.floor(storeRating); 
    const fractionalPart = storeRating - fullStars; 
    const hasHalfStar = fractionalPart >= 0.3 && fractionalPart < 0.8; 
    const hasFullStar = fractionalPart >= 0.8; 

    return Array.from({ length: maxStars }, (_, index) => {
      let isFilled = false;
      let isHalf = false;
      let color = '#ccc'; 

      if (index < fullStars) {
        // Full star
        isFilled = true;
        color = '#f4ab19';
      } else if (index === fullStars) {
        // Handle the fractional star
        if (hasFullStar) {
          isFilled = true;
          color = '#f4ab19';
        } else if (hasHalfStar) {
          isHalf = true;
          color = '#f4ab19';
        }
      }

      return (
        <View key={index} style={styles.starWrapper}>
          {isFilled || isHalf ? (
            <Entypo
              name="star"
              size={16}
              color={color}
              style={isHalf ? styles.halfStar : undefined}
            />
          ) : (
            <EvilIcons name="star" size={20} color={color} />
          )}
        </View>
      );
    });
  };

  const averageResponseTime = 2.4;


  const getStoreStatus = () => {
    const currentHour = new Date().getHours(); 
    const openingHour = store.openingHour || 8; 
    const closingHour = store.closingHour || 22; 
    return currentHour >= openingHour && currentHour < closingHour ? 'Open' : 'Closed';
  };

  const storeStatus = getStoreStatus();
  const statusColor = storeStatus === 'Open' ? 'green' : 'red';

  // Ensure storeRating is a number and falls within 0 to 5
  const storeRating = Math.min(Math.max(Number(store.storeRating) || 0, 0), 5);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={[styles.heading, { marginBottom: 5 }]}>
          <SkeletonLoader width={200} height={20} bR={10} />
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <SkeletonLoader width={80} height={15} bR={10} />
            <SkeletonLoader width={120} height={15} bR={10} />
          </View>
        </View>
      ) : (
        <View style={styles.heading}>
          <Text type="emphasized_bold" color="grey900" text={store.storeName || 'Fresh Mart'} />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
              <Location size="12" color="#f4ab19" variant="Outline" />
              <Text
                type="small_regular"
                color="black"
                text={store.storeAddress || '522 Kilimangoro street, glassglow Uk or nigeria'}
              />
            </View>

            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>{renderStars(storeRating)}</View>
              <Text
                type="small_regular"
                color="grey800"
                text={`${storeRating.toFixed(1)} (${averageResponseTime} min)`}
                style={styles.ratingText}
              />
              
              {/* Store Status (Open or Closed) */}
              <Text type="small_bold" style={{ color: statusColor }} text={storeStatus} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default StoreHeader;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 2,
  },
  starWrapper: {
    marginRight: 1,
    position: 'relative',
    width: 20, 
    height: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  halfStar: {
    width: '50%',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
  },
  heading: {
    rowGap: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    marginTop: 4,
  },
  ratingText: {
    marginRight: 8,
  },
  linkText: {
    textDecorationLine: 'underline',
    marginRight: 8,
  },
});