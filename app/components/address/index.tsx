import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { debounce } from 'lodash';

const UKAddressFinder = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [postcodeAddresses, setPostcodeAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [error, setError] = useState('');
  const googlePlacesRef = useRef(null);

  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}|GIR\s?0AA$/i;
  const IDEAL_POSTCODES_API_KEY = 'AIzaSyDN6s9y6WezcKzlz6cPp1hu8SlJ1AcYScs'; // Replace with your key

  const fetchAddressesByPostcode = async (postcode) => {
    if (!postcodeRegex.test(postcode)) {
      setError('Please enter a valid UK postcode (e.g., SW1A 1AA)');
      return;
    }
    setError('');
    const formattedPostcode = postcode.toUpperCase().replace(/\s+/g, '');
    setLoading(true);
    setPostcode(formattedPostcode);

    try {
      const response = await fetch(
        `https://api.ideal-postcodes.co.uk/v1/postcodes/${formattedPostcode}?api_key=${IDEAL_POSTCODES_API_KEY}`
      );
      const data = await response.json();

      if (data.code === 200 && data.result.length > 0) {
        const addresses = data.result.map((addr, index) => ({
          id: `ideal-${index}`,
          formattedAddress: `${addr.line_1}${addr.line_2 ? ', ' + addr.line_2 : ''}, ${addr.post_town}, ${addr.postcode}`,
          streetNumber: addr.building_number || '',
          street: addr.thoroughfare || '',
          premise: addr.building_name || '',
          subpremise: addr.sub_building_name || '',
          neighborhood: addr.district || '',
          city: addr.post_town || '',
          postcode: addr.postcode,
          lat: addr.latitude,
          lng: addr.longitude,
        }));

        setPostcodeAddresses(addresses);
        setShowManualInput(false);
      } else {
        setError('No addresses found for this postcode.');
        setPostcodeAddresses([]);
        setShowManualInput(true);
      }
    } catch (error) {
      setError('Failed to fetch addresses. Please check your network and try again.');
      console.error('Error fetching addresses:', error);
      setPostcodeAddresses([]);
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchAddresses = debounce(fetchAddressesByPostcode, 500);

  const handleAddressSelect = (address) => {
    const parts = [];
    if (address.subpremise) parts.push(address.subpremise);
    if (address.premise) parts.push(address.premise);
    if (address.streetNumber && address.street) {
      parts.push(`${address.streetNumber} ${address.street}`);
    } else if (address.street) {
      parts.push(address.street);
    }

    const preciseAddress = parts.filter(Boolean).join(', ');

    const fullAddress = {
      ...address,
      preciseAddress: preciseAddress || address.formattedAddress.split(',')[0],
      fullAddress: address.formattedAddress,
    };

    setSelectedAddress(fullAddress);
    setShowManualInput(false);
  };

  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) {
      setError('Please enter a valid address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(`${manualAddress}, ${postcode}`)}&key=${process.env.REACT_NATIVE_GOOGLE_PLACES_API_KEY}&components=country:UK`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const components = result.address_components || [];

        const fullAddress = {
          id: 'manual',
          formattedAddress: result.formatted_address,
          preciseAddress: manualAddress,
          streetNumber: components.find(comp => comp.types.includes('street_number'))?.long_name || manualAddress.match(/^\d+/)?.[0] || '',
          street: components.find(comp => comp.types.includes('route'))?.long_name || manualAddress.replace(/^\d+\s+/, ''),
          premise: components.find(comp => comp.types.includes('premise'))?.long_name || '',
          subpremise: components.find(comp => comp.types.includes('subpremise'))?.long_name || '',
          neighborhood: components.find(comp => comp.types.includes('neighborhood'))?.long_name || '',
          city: components.find(comp => comp.types.includes('locality'))?.long_name || '',
          postcode: components.find(comp => comp.types.includes('postal_code'))?.long_name || postcode,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        };

        setSelectedAddress(fullAddress);
        setShowManualInput(false);
        setError('');
      } else {
        const fullAddress = {
          id: 'manual',
          formattedAddress: `${manualAddress}, ${postcode}`,
          preciseAddress: manualAddress,
          streetNumber: manualAddress.match(/^\d+/)?.[0] || '',
          street: manualAddress.replace(/^\d+\s+/, ''),
          premise: '',
          subpremise: '',
          neighborhood: '',
          city: '',
          postcode: postcode,
        };
        setSelectedAddress(fullAddress);
        setShowManualInput(false);
        setError('');
      }
    } catch (error) {
      console.error('Error validating manual address:', error);
      const fullAddress = {
        id: 'manual',
        formattedAddress: `${manualAddress}, ${postcode}`,
        preciseAddress: manualAddress,
        streetNumber: manualAddress.match(/^\d+/)?.[0] || '',
        street: manualAddress.replace(/^\d+\s+/, ''),
        premise: '',
        subpremise: '',
        neighborhood: '',
        city: '',
        postcode: postcode,
      };
      setSelectedAddress(fullAddress);
      setShowManualInput(false);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UK Address Finder</Text>

      <Text style={styles.label}>Enter Postcode:</Text>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Enter postcode e.g. SW1A 1AA"
        fetchDetails={true}
        onPress={(data, details = null) => {
          const postcode = data.structured_formatting.main_text || data.description;
          if (postcodeRegex.test(postcode)) {
            fetchAddressesByPostcode(postcode);
          }
        }}
        textInputProps={{
          onChangeText: (text) => {
            setPostcode(text);
            setError('');
            if (postcodeRegex.test(text.trim())) {
              debouncedFetchAddresses(text.trim());
            }
          },
          returnKeyType: 'search',
          onSubmitEditing: (event) => {
            const text = event.nativeEvent.text;
            if (postcodeRegex.test(text.trim())) {
              fetchAddressesByPostcode(text.trim());
            }
          },
        }}
        query={{
          key: 'AIzaSyDN6s9y6WezcKzlz6cPp1hu8SlJ1AcYScs',
          language: 'en',
          components: 'country:uk',
          types: 'postal_code',
        }}
        styles={{
          container: { flex: 0 },
          textInputContainer: { width: '100%' },
          textInput: styles.input,
          listView: styles.listView,
        }}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Finding addresses...</Text>
        </View>
      )}

      {postcode && !loading && (
        <View style={styles.postcodeContainer}>
          <Text style={styles.postcodeHeader}>Addresses for postcode: {postcode}</Text>

          {postcodeAddresses.length > 0 ? (
            <FlatList
              data={postcodeAddresses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.addressItem}
                  onPress={() => handleAddressSelect(item)}
                >
                  <Text style={styles.addressText}>{item.formattedAddress}</Text>
                  {item.premise || item.subpremise ? (
                    <Text style={styles.buildingText}>
                      {[item.subpremise, item.premise].filter(Boolean).join(', ')}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              )}
              style={styles.addressList}
            />
          ) : (
            <Text style={styles.noAddressText}>No exact addresses found for this postcode.</Text>
          )}

          {!showManualInput && (
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => setShowManualInput(true)}
            >
              <Text style={styles.manualButtonText}>My address isn't listed</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showManualInput && postcode && (
        <View style={styles.manualInputContainer}>
          <Text style={styles.manualLabel}>Enter your address manually:</Text>
          <TextInput
            style={styles.input}
            value={manualAddress}
            onChangeText={setManualAddress}
            placeholder="e.g. 10 Downing Street"
          />
          <TouchableOpacity
            style={[styles.submitButton, !manualAddress.trim() && styles.submitButtonDisabled]}
            onPress={handleManualAddressSubmit}
            disabled={!manualAddress.trim()}
          >
            <Text style={styles.submitButtonText}>Use This Address</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedAddress && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Selected Address for Shipping:</Text>
          <Text style={styles.selectedPrecise}>{selectedAddress.preciseAddress}</Text>
          {selectedAddress.city && (
            <Text style={styles.selectedCity}>{selectedAddress.city}</Text>
          )}
          <Text style={styles.selectedPostcode}>{selectedAddress.postcode}</Text>
          <Text style={styles.selectedFull}>{selectedAddress.fullAddress}</Text>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => {
              setSelectedAddress(null);
              setPostcodeAddresses([]);
              setPostcode('');
              setManualAddress('');
              setShowManualInput(false);
              setError('');
              googlePlacesRef.current?.setAddressText('');
            }}
          >
            <Text style={styles.changeButtonText}>Change Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  listView: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    elevation: 5,
    maxHeight: 200,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  postcodeContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postcodeHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  addressList: {
    maxHeight: 300,
  },
  addressItem: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addressText: {
    fontSize: 15,
    color: '#333',
  },
  buildingText: {
    fontSize: 13,
    color: '#0066cc',
    marginTop: 3,
  },
  noAddressText: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  manualButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  manualButtonText: {
    fontSize: 14,
    color: '#555',
  },
  manualInputContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  manualLabel: {
    fontSize: 15,
    marginBottom: 10,
    color: '#555',
  },
  submitButton: {
    marginTop: 15,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  selectedContainer: {
    marginTop: 20,
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003366',
  },
  selectedPrecise: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedCity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 3,
  },
  selectedPostcode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0066cc',
    marginTop: 3,
  },
  selectedFull: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  changeButton: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UKAddressFinder;