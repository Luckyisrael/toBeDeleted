import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Text, Image, Screen } from 'app/design-system';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import useSWR from 'swr';
import { axios } from 'app/config/axios';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import { LoaderModal } from 'app/modals';

const CustomerAddress = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    address: { data, error, isLoading, refresh },
    deleteAddress,
  } = useUserProfileApi();

  const filteredAddresses =
    data?.Addresses?.filter(
      (address) =>
        address.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.postCode.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleDeleteAddress = async () => {
    try {
      await deleteAddress({
        deleteId: selectedAddress.id,
        successCallback: () => {
          console.log('Address deleted successfully');
        },
      });
      refresh();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressInfo}>
        <Text type="small_semibold" text={item.address} />
        <Text type="small_regular" color="grey600" text={item.postCode} />
        <Text type="small_regular" color="grey600" text={item.phone} />
      </View>
      <TouchableOpacity
        onPress={() => {
          setSelectedAddress(item);
          setShowDeleteModal(true);
        }}
        style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Screen>
      <View style={styles.container}>
        <LoaderModal isLoading={isLoading} />
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="location-sharp" size={20} color="#F4AB19" style={styles.locationIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your addresses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Address List */}
        <FlatList
          data={filteredAddresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text type="small_regular" text="No addresses found" />
            </View>
          }
        />

        {/* Delete Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text type="sub_semibold" text="Delete Address" style={styles.modalTitle} />
              <Text
                type="small_regular"
                text={`Are you sure you want to delete this address?`}
                style={styles.modalText}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDeleteModal(false)}>
                  <Text type="small_semibold" text="Cancel" color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDeleteAddress}>
                  <Text type="small_semibold" text="Delete" color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  locationIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addressInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FF3B30',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalText: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
});

export default CustomerAddress;
