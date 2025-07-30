import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Screen, Text } from 'app/design-system';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { hp, wp } from 'app/resources/config';
import ProductItem from 'app/components/vendor-product-item';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DeleteConfirmationModal, LoaderModal } from 'app/modals';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';


interface Category {
  _id: string;
  title: string;
}

interface Product {
  _id: string;
  vendor: string;
  title: string;
  image: string[];
  category: Category;
  quantity: number;
  tags: string[];
  price: number;
  discount: number;
  availability: boolean;
  isApproved: boolean;
  addedOn: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProductsResponse {
  count: number;
  products: Product[];
}

const VendorProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation();

  const {
    getProducts: { data, isLoading, error, refresh }, deleteProduct
  } = useVendorApi();

  

  useFocusEffect(
    useCallback(() => {
      refresh(); 
    }, [refresh])
  );

  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products);
    }
  }, [data]);

  const handleToggleStock = (productId: string, newValue: boolean) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId ? { ...product, availability: newValue } : product
      )
    );
    // Update the api call too
  };

  const handleViewProduct = (product: Product) => {
    //@ts-ignore
    navigation.navigate('VENDOR_PRODUCT_DETAILS_SCREEN', {
      product: {
        product,
        mainImage: product.image[0],
        imageVariants: product.image,
      },
    });
  };

  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find((p) => p._id === productId);
    if (productToEdit) {
      navigation.navigate('VENDOR_EDIT_PRODUCT_SCREEN', { product: productToEdit });
    }
  };

  const handleDeletePress = (productId: string) => {
    setProductToDelete(productId);
    setDeleteModalVisible(true); 
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || isDeleting) return;
  
    setIsDeleting(true);
    
    try {
      await deleteProduct({
        productId: productToDelete,
        successCallback: () => {
          setProducts(prevProducts => 
            prevProducts.filter(product => product._id !== productToDelete)
          );
        }
      });
    } catch (error) {
    } finally {
      setIsDeleting(false);
      setDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setProductToDelete(null);
  };

  const handleAddProduct = () => {
    navigation.navigate('VENDOR_ADD_NEW_PRODUCT_SCREEN');
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text type="body_regular" text="Loading products..." style={{ marginTop: 10 }} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centeredContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
          <Text type="body_regular" text="Failed to load products" style={{ marginTop: 10 }} />
          <Button title='Retry' onPress={refresh} />
        </View>
      );
    }

    if (filteredProducts.length === 0) {
      if (searchQuery) {
        return (
          <View style={styles.centeredContainer}>
            <Feather name="search" size={48} color="#999" />
            <Text type="body_regular" text={`No products matching "${searchQuery}"`} style={{ marginTop: 10 }} />
          </View>
        );
      } else {
        return (
          <View style={styles.centeredContainer}>
            <MaterialIcons name="inventory" size={48} color="#999" />
            <Text type="body_regular" text="You don't have any products yet" style={{ marginTop: 10 }} />
            <Button title="Add your first product" onPress={handleAddProduct}/>
          </View>
        );
      }
    }

    return null;
  };

  return (
    <Screen withBackBtn={false} bgColor="#FBFBFB">
      <View style={styles.container}>
        <LoaderModal isLoading={isDeleting} />
        <View style={{ rowGap: 5 }}>
          <Text type="headline_3_semibold" text="Your products" />
          <Text
            type="small_regular"
            color="primary40"
            text="Track and manage your products in one place"
          />
        </View>

        <View style={styles.headerContainer}>
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={14} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Add Product Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <MaterialIcons name="add" size={14} color="#fff" />
            <Text type="small_regular" color="white" text="Add product" />
          </TouchableOpacity>
        </View>

        {/* Products List */}
        {!isLoading && !error && filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <ProductItem
                product={{
                  id: item._id,
                  name: item.title,
                  image: item.image[0],
                  price: item.price,
                  stock: item.quantity,
                  inStock: item.availability,
                  description: item.tags.join(', '),
                  category: item.category.title,
                  weight: `${item.quantity} units`,
                  discount: item.discount,
                }}
                onToggleStock={handleToggleStock}
                onView={() => handleViewProduct(item)}
                onEdit={() => handleEditProduct(item._id)}
                onDelete={() => handleDeletePress(item._id)}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}

        <DeleteConfirmationModal
          isVisible={deleteModalVisible}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </View>
    </Screen>
  );
};

export default VendorProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: wp(12),
    paddingHorizontal: 12,
    paddingVertical: hp(13),
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  addButton: {
    width: '40%',
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: wp(12),
    paddingHorizontal: 16,
    paddingVertical: hp(10),
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
