import { Screen, Text } from 'app/design-system';
import { RootStackParamList } from 'app/navigation/types';
import { Location as LocationIcon } from 'iconsax-react-native';
import { hp, wp } from 'app/resources/config';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserAddressBottomsheet } from 'app/modals';
import { LocationAddress } from './types';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import useAddressStore from 'app/store/use-address-store';
import useAlert from 'app/hooks/useAlert';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type SearchScreenProps = StackNavigationProp<RootStackParamList, 'CUSTOMERTABS'>;

const SearchScreen = () => {
  const { setAddress } = useAddressStore();
  const navigation = useNavigation<SearchScreenProps>();
  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<GooglePlacesAutocompleteRef>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState<LocationAddress | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationAddress | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAddressBottomsheetVisible, setIsAddressBottomsheetVisible] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { errorAlert } = useAlert();

  const searchBarOpacity = useSharedValue(0);
  const insets = useSafeAreaInsets();

  // Force the bottom sheet to always be visible when this screen is loaded
  useEffect(() => {
    setIsAddressBottomsheetVisible(true);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        const address = addresses[0];
        const formattedAddress = address
          ? `${address.street || ''} ${address.name || ''}, ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`
          : 'Address not found';

        setCurrentLocation({
          latitude,
          longitude,
          address: formattedAddress,
          //@ts-ignoreß
          city: address?.city,
        });

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
      } catch (error) {
        setErrorMsg('Failed to get current location');
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | undefined;

    const watchPosition = async () => {
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          async (location) => {
            const { latitude, longitude } = location.coords;
            const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
            const address = addresses[0];
            const formattedAddress = address
              ? `${address.street || ''} ${address.name || ''}, ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`
              : 'Address not found';

            setCurrentLocation({
              latitude,
              longitude,
              address: formattedAddress,
              //@ts-ignore
              city: address?.city,
            });
          }
        );
      } catch (error) {
        console.error('Error watching position:', error);
      }
    };
    watchPosition();

    return () => {
      locationSubscription?.remove();
    };
  }, []);

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
    if (!isSearchActive) {
      // When activating search, fade in and focus the input
      searchBarOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      setTimeout(() => inputRef.current?.focus(), 100); // Focus after animation starts
    } else {
      // When deactivating, fade out
      searchBarOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
  };

  const selectLocation = (data: any, details: any) => {
    if (details) {
      const postcodeComponent = details.address_components.find((component: any) =>
        component.types.includes('postal_code')
      );
      const cityComponent = details.address_components.find((component: any) =>
        component.types.includes('locality')
      );

      const newLocation = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: details.formatted_address || data.description,
        city: cityComponent?.long_name,
        postcode: postcodeComponent?.long_name,
      };
      setSelectedLocation(newLocation);
      mapRef.current?.animateToRegion(
        {
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
      toggleSearch(); // Close search after selection
    }
  };

  const handleSearch = () => {
    const locationData = selectedLocation || currentLocation;
    if (locationData && locationData.latitude && locationData.longitude) {
      const savePostcode = locationData.postcode || locationData.address.split(' ').pop() || '';
      const saveAddress = locationData.address.replace(savePostcode, '').trim();
      const saveCity = locationData.city || '';
      setAddress(null, null, null, null, null); 
      setAddress(saveAddress, savePostcode, saveCity, locationData.latitude, locationData.longitude);

      navigation.replace('CUSTOMERTAB', { 
        screen: 'CUSTOMER_HOME_SCREEN' 
      });
        
    } else {
      errorAlert('Please select or wait for a location before proceeding');
    }
  };

  return (
    <Screen withBackBtn={false} pH={0}>
      <>
        <View style={styles.container}>
          {/* Map View */}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton={false}>
            {currentLocation && (
              <Circle
                center={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                radius={100}
                fillColor="rgba(211, 87, 30, 0.2)"
                strokeColor="rgba(30, 211, 66, 0.2)"
                strokeWidth={1}>
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title="Current Location"
                  description={currentLocation.address}>
                  <View style={styles.markerContainer}>
                    <LocationIcon size="20" color="#DE421B" variant="Bold" />
                  </View>
                </Marker>
              </Circle>
            )}
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
                title="Selected Location"
                description={selectedLocation.address}>
                <View style={styles.markerContainer}>
                  <LocationIcon size="20" color="#DE421B" variant="Bold" />
                </View>
              </Marker>
            )}
          </MapView>

          {/* Search Bar/Input */}
          <Animated.View style={[styles.searchButtonContainer,  { top: insets.top + 2, zIndex: 10 } ]}>
            {!isSearchActive ? (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={toggleSearch}
                activeOpacity={0.9}>
                <Ionicons name="search" size={16} color="#333" />
                <Text
                  type="small_regular"
                  text={selectedLocation ? 'Change location' : 'Search for a place'}
                />
              </TouchableOpacity>
            ) : (
              <GooglePlacesAutocomplete
                ref={inputRef}
                placeholder="Type your address"
                fetchDetails={true}
                onPress={selectLocation}
                query={{
                  key: 'AIzaSyDN6s9y6WezcKzlz6cPp1hu8SlJ1AcYScs',
                  language: 'en',
                  components: 'country:gb',
                }}
                styles={{
                  container: {
                    flex: 0,
                    
                  },
                  textInputContainer: {
                    width: '100%',
                  },
                  textInput: {
                    height: 50,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    fontSize: 12,
                    backgroundColor: '#f9f9f9',
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                  listView: {
                    backgroundColor: 'white',
                    borderRadius: 12
                  },
                  separator: {
                    height: 0.5,
                    backgroundColor: '#c8c7cc',
                  },
                }}
              />
            )}
          </Animated.View>

          {/* Main Bottom Sheet with Location Info */}
          <UserAddressBottomsheet
            isVisible={isAddressBottomsheetVisible}
            userLocation={
              selectedLocation
                ? selectedLocation.address
                : currentLocation?.address || 'Getting your location...'
            }
            onPress={handleSearch}
          />
        </View>
      </>
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '90%',
    zIndex: 10,
  },
  searchButton: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: hp(12),
    paddingHorizontal: wp(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bottomSheetIndicator: {
    width: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomSheetContent: {
    flex: 1,
    //padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },

  searchBottomSheetContent: {
    flex: 1,
    //padding: 20,
    zIndex: 2,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F4AB19',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});