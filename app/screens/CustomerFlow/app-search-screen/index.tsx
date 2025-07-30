import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { KeyboardWrapper, Screen, Text } from 'app/design-system';
import { SearchNormal1 } from 'iconsax-react-native';
import { wp, fs, hp } from 'app/resources/config';
import { CustomerHomeScreenSearchProps } from 'app/navigation/types';
import { SearchResultCard } from 'app/components';

const POPULAR_SEARCHES = ['Indomie', 'Apple', 'Rice', 'Nestle', 'Vegetable', 'Golden Golden Mart'];

// Types
interface LocationProps {
  vendorId: string;
  vendor?: string;
  image?: string;
  distance?: number;
  address?: string;
  coordinates?: number[];
}

interface Store {
  id: string;
  name: string;
  tag: string;
  price: string;
  distance: string;
  deliveryTime: string;
  image: string;
}

interface CustomerHomeScreenSearchProps {
  navigation: any; // Replace with proper navigation type (e.g., from @react-navigation)
  route: {
    params: {
      response: LocationProps[] | { locations?: LocationProps[]; results?: LocationProps[] };
    };
  };
}

// Utility to map location data to Store type
const mapToStore = (location: LocationProps): Store => {
  const distanceInKm = location.distance ? (location.distance / 1000).toFixed(2) : '0.00';
  return {
    id: location.vendorId,
    name: location.vendor || 'Unknown Store',
    tag: 'Food', // Could be dynamic if data provides tags
    price: 'Free', // Could be dynamic if data provides pricing
    distance: `${distanceInKm} km`,
    deliveryTime: '30-45 mins', // Could be dynamic if data provides estimates
    image: location.image || 'https://via.placeholder.com/150', // Fallback image
  };
};

// Main Component
const AppSearchScreen = ({ navigation, route }: CustomerHomeScreenSearchProps) => {
  const { response: data } = route.params;
  console.log('the search data:', data);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  // Normalize store data
  const storeData = useMemo<Store[]>(() => {
    let locations: LocationProps[] = [];
    if (Array.isArray(data)) {
      locations = data;
    } else if (data?.locations && Array.isArray(data.locations)) {
      locations = data.locations;
    } else if (data?.results && Array.isArray(data.results)) {
      locations = data.results;
    }
    return locations.map(mapToStore);
  }, [data]);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      const results = storeData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(results);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, storeData]);

  // Render empty state
  const renderEmptyList = () => {
    if (searchQuery.trim() === '') {
      return (
        <View style={styles.emptyStateContainer}>
          <Text text="Type something to search" style={styles.emptyStateText} />
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
       <Text text={`No results found for "${searchQuery}"`} style={styles.emptyStateText} />
      </View>
    );
  };

  // Handle navigation to store
  const handleViewStore = useCallback(
    (storeId: string) => {
      navigation.navigate('AVAILABLE_PRODUCTS_SCREEN', { storeId, data });
    },
    [navigation, data]
  );

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Screen bgColor='white'>
      <KeyboardWrapper>
        <View style={styles.container}>
          {/* Search Bar */}
          <View style={styles.searchBox}>
            <SearchNormal1 size={16} color="#D9D9D9" />
            <TextInput
              style={styles.input}
              placeholder="Search by food item, shop name"
              value={searchQuery}
              onChangeText={setSearchQuery}
              keyboardType="default"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} >
                <Text text='x' />
              </TouchableOpacity>
            )}
          </View>

          {/* Popular Searches */}
          <View>
          <Text
              text="Popular Searches"
              type="body_semibold"
              color="black"
              style={styles.popularText}
            />
            <View style={styles.popularTagsContainer}>
              {POPULAR_SEARCHES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.popularTag}
                  onPress={() => setSearchQuery(item)}
                >
                  <Text text={item} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Results */}
          <View style={styles.resultsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : (
              <FlatList
                data={searchQuery.trim() !== '' ? filteredData : []}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.resultsContentContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <SearchResultCard store={item} onViewStore={() => handleViewStore(item.id)} />
                )}
                ListEmptyComponent={renderEmptyList}
                columnWrapperStyle={styles.columnWrapper}
              />
            )}
          </View>
        </View>
      </KeyboardWrapper>
    </Screen>
  );
};

export default AppSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp(16),
    paddingVertical: hp(10),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: wp(12),
    height: hp(40),
  },
  input: {
    flex: 1,
    marginLeft: wp(8),
    marginRight: wp(8),
    fontSize: fs(12),
  },
  popularText: {
    marginVertical: hp(10),
  },
  popularTag: {
    padding: wp(10),
    backgroundColor: '#F3F3F3',
    borderRadius: wp(50),
    marginRight: wp(8),
  },
  popularTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
    marginVertical: hp(10),
  },
  resultsContainer: {
    flex: 1,
    marginTop: hp(16),
  },
  resultsContentContainer: {
    paddingBottom: hp(20),
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(40),
  },
  emptyStateText: {
    fontSize: fs(16),
    color: '#757575',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(40),
  },
});
