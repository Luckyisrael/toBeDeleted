import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import axios from 'axios';
import { BASE_URL } from 'app/utils/constants';
import useVendorStore from 'app/store/use-vendor-store';
import { SpecialCareItem } from 'app/screens/VendorFlow/add-new-product';

export type VendorCategory = {
  _id: string;
  title: string;
  image: string;
};

type CategoryDropdownProps = {
  selectedItem: string | null;
  onSelectItem: (item: VendorCategory | SpecialCareItem) => void;
  placeholder?: string;
  isSubcategory?: boolean;
  parentCategoryId?: string;
  isSpecialCare?: boolean;  // New prop
  items?: Array<VendorCategory | SpecialCareItem>;  
};

const CategoryDropdown = ({
  selectedItem,
  onSelectItem,
  placeholder = 'Choose category',
  isSubcategory = false,
  parentCategoryId,
  isSpecialCare = false,  // Default false
  items: propItems,  // Renamed for clarity
}: CategoryDropdownProps) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [items, setItems] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { vendorAccessToken } = useVendorStore(); 

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Don't fetch if we have static items
      if (propItems) {
        setItems(propItems);
        return;
      }

      
      let url = `${BASE_URL}vendor/getCategories`;
      if (isSubcategory && parentCategoryId) {
        url = `${BASE_URL}vendor/getSubcategories/${parentCategoryId}`;
        console.log('the URL:', url)
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${vendorAccessToken}`,
        },
      });

      setItems(response.data.categories || response.data.SubCategories || []);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = async () => {
    if (!isModalVisible) {
      await fetchItems();
    }
    setIsModalVisible(!isModalVisible);
  };

  const handleSelectItem = (item: VendorCategory) => {
    onSelectItem(item);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inputContainer} onPress={toggleModal}>
        <Text style={[styles.inputText, !selectedItem && styles.placeholder]}>
          {selectedItem || placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color="gray" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onSwipeComplete={toggleModal}
        swipeDirection={['down']}
        style={styles.modal}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        useNativeDriverForBackdrop={true}
        statusBarTranslucent={true}
        deviceHeight={10000}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isSubcategory ? 'Select Subcategory' : 'Select Category'}
            </Text>
            <TouchableOpacity onPress={toggleModal}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#000" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchItems} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isSubcategory ? 'No subcategories available' : 'No categories available'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedItem === item.title && styles.selectedCategoryItem,
                  ]}
                  onPress={() => handleSelectItem(item)}
                >
                  <Text style={styles.categoryText}>{item.title}</Text>
                  {selectedItem === item.title && (
                    <Feather name="check" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 48,
    backgroundColor: 'white',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
  },
  placeholder: {
    color: '#999',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  selectedCategoryItem: {
    backgroundColor: '#f5f5f5',
  },
  categoryText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: '#333',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
});

export default CategoryDropdown;
