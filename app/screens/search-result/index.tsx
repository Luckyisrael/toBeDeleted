import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { StoreCardResult } from 'app/components';
import { SearchResultScreenProps } from 'app/navigation/types';
import { Text, Screen } from 'app/design-system';
import { fs, hp, wp } from 'app/resources/config';
import { Location, Profile, SearchNormal1, Notification, ArrowDown2 } from 'iconsax-react-native';
import { MenuIcon, SendIcon, SepeartionIcon, SettingsIcon } from 'app/assets/svg';
import { stores } from 'app/mock/storeData';
import { Logger } from 'app/utils';

// Define the API response type
type Location = {
  vendorId: string;
  vendor: string;
  image: string;
  address: string;
  distance: number;
};
type Result = {
  name: string;
  vendor: string;
  image: string;
  address: string;
  distance: number;
};

// Map API response to StoreCardResult format
const mapToStore = (location: Location) => ({
  id: location.vendorId,
  name: location.vendor,
  tag: 'Food', // Add a tag if needed
  price: 'Free', // You may update this based on API data
  distance: `${location.distance.toFixed(2)} km`,
  deliveryTime: '30-45 mins', // Placeholder, modify if available in API
  image: location.image,
});

const SearchResultScreen = ({ navigation, route }: SearchResultScreenProps) => {

  const { postalCode, data, location } = route.params;

  Logger.log('Data content:', data);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const handleViewStore = (storeId: string) => {
    //@ts-ignore
    navigation.navigate('CUSTOMER_INDEX', {
      screen: 'CUSTOMER_HOME_SCREEN',
      params: {
        screen: 'CUSTOMER_HOME',
        params: { storeId, location, data },
      },
    });
  };

  // Convert API data into store format
  const storeData = [
    ...(Array.isArray(data.locations) ? data.locations.map(mapToStore) : []),
    ...(Array.isArray(data.results) ? data.results.map(mapToStore) : []),
  ];
  const numberOfResult = data?.suggestionsCount;

  return (
    <Screen withBackBtn={false}>
      <View style={styles.container}>
        {/** Homes screen header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}>
            <Location size="20" color="#f4ab19" variant="Outline" />
            <Text type="small_medium" text={location} truncateWords={3} />
            <ArrowDown2 size="12" color="#000000" variant="Outline" />
          </View>
          <Notification size="20" color="#000000" variant="Outline" />
        </View>

        {/** Search and menu filter */}
        <View style={styles.menuContainer}>
          <View style={styles.searchBox}>
            <SearchNormal1 size={fs(16)} color="#D9D9D9" />
            <TextInput
              style={styles.input}
              placeholder="Search by food item, shop name"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="default"
            />
          </View>
          <View style={styles.menu}>
            <MenuIcon />
          </View>
        </View>

        {/* <FilterBar selectedFilter={filter} onSelectFilter={setFilter} /> */}

        {/*  <View style={styles.searchResultTag}>
          <Text type="small_semibold" text={`${numberOfResult} results for "${postalCode}"`} />
          <Text
            text="view maps"
            type="sub_semibold"
            color="grey500"
            onPress={() => console.log('Viewing images...')}
            style={{ textDecorationLine: 'underline' }}
          />
        </View> */}
        <View style={styles.searchResultTag}>
          <Text type="small_semibold" text="Nearby Shops" />
          <Text
            text="View all shops"
            type="small_regular"
          
            onPress={() => console.log('Viewing images...')}
          />
        </View>

        <FlatList
          data={storeData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: hp(20), rowGap: hp(16) }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <StoreCardResult store={item} onViewStore={() => handleViewStore(item.id)} />
          )}
        />
      </View>
    </Screen>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    paddingHorizontal: wp(16),
    paddingVertical: hp(10),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: wp(12),

    height: hp(40),
  },
  menu: {
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingVertical: hp(10),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: wp(12),

    height: hp(40),
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    marginLeft: wp(8),
    marginRight: wp(8),
    fontSize: fs(12),
  },
  searchResultTag: {
    flexDirection: 'row',
    marginVertical: hp(15),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
