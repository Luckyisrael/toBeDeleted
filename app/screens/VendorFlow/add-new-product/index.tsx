import { StyleSheet, View, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, KeyboardWrapper, Screen, ScrollView, Text } from 'app/design-system';
import { useForm, FormProvider } from 'react-hook-form';
import { EMPTY_STRING } from 'app/utils/constants';
import * as ImagePicker from 'expo-image-picker';
import { hp, wp } from 'app/resources/config';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CategoryDropdown } from 'app/components';
import { VendorCategory } from 'app/components/vendor-product-category-dropdown';

type FormData = {
  productName: string;
  productCategory: string;
  productDescription: string;
  weight: string;
  price: string;
  quantity: string;
  discount: string;
};

export type SpecialCareItem = {
  _id: string;
  title: string;
};

const SPECIAL_CARE_ITEMS: SpecialCareItem[] = [
  { _id: '1', title: 'Beef' },
  { _id: '2', title: 'Fragile' },
  { _id: '3', title: 'Glass' },
  { _id: '4', title: 'Do Not Rotate' },
  { _id: '5', title: 'Hot Food' },
  { _id: '6', title: 'Medicals' },
  { _id: '7', title: 'Liquid Items' },
];

const VendorAddNewProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<VendorCategory | null>(null);
  const [selectedSpecialCare, setSelectedSpecialCare] = useState<SpecialCareItem | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { navigate } = useNavigation();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      productName: EMPTY_STRING,
      productCategory: EMPTY_STRING,
      productDescription: EMPTY_STRING,
      weight: EMPTY_STRING,
      price: EMPTY_STRING,
      quantity: EMPTY_STRING,
      discount: EMPTY_STRING,
    },
  });

  const selectImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Sorry, we need camera roll permissions to select an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };
  const removeImage = (uri: string) => {
    setSelectedImages((prev) => prev.filter((imageUri) => imageUri !== uri));
  };

  return (
    <Screen>
      <KeyboardWrapper>
        <ScrollView>
          <View style={styles.header}>
            <Text text="Add new product" type="body_semibold" color="primary80" />
            <Text
              text="Enter product details to start selling"
              type="small_regular"
              color="primary40"
            />
          </View>

          <View style={styles.formContainer}>
            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Product Name" />
              <Input
                placeholder="e.g Organic Spinach"
                name="productName"
                control={control}
                rules={{ required: 'Product name is required' }}
              />
            </View>

            {/* Product Category */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Product Category" />
              <CategoryDropdown
                selectedItem={selectedCategory?.title}
                onSelectItem={setSelectedCategory}
                placeholder="Select a category"
              />
              {errors.productCategory && <Text>Category is required</Text>}
            </View>

            {/* Product Category */}

            {selectedCategory && (
              <View style={styles.inputGroup}>
                <Text type="body_regular" color="primary80" text="Product Sub Category" />
                <CategoryDropdown
                  selectedItem={selectedSubcategory?.title}
                  onSelectItem={setSelectedSubcategory}
                  placeholder="Select a subcategory"
                  isSubcategory={true}
                  parentCategoryId={selectedCategory._id}
                />
                {errors.productCategory && (
                  <Text >Category is required</Text>
                )}
              </View>
            )}

            {/* New Special Care Dropdown */}
          <View style={styles.inputGroup}>
            <Text type="body_regular" text="Special Care Requirements" />
            <CategoryDropdown
              selectedItem={selectedSpecialCare?.title}
              onSelectItem={setSelectedSpecialCare}
              placeholder="Select special care instructions"
              items={SPECIAL_CARE_ITEMS} 
              isSpecialCare={true} 
            />
          </View>

            {/* Product Description */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Product Description" />
              <Input
                placeholder="Type it here"
                name="productDescription"
                control={control}
                rules={{ required: 'Description is required' }}
                multiline
                numberOfLines={4}
                containerStyle={styles.descriptionInput}
              />
            </View>

            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Weight" />
              <Input
                placeholder="e.g 500"
                name="weight"
                control={control}
                rules={{ required: 'Weight is required' }}
                keyboardType="numeric"
              />
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Price" />
              <Input
                placeholder="e.g 5.99"
                name="price"
                control={control}
                rules={{ required: 'Price is required' }}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Stock Quantity */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Stock Quantity" />
              <Input
                placeholder="e.g 50"
                name="quantity"
                control={control}
                rules={{ required: 'Quantity is required' }}
                keyboardType="numeric"
              />
            </View>

            {/* Image Upload */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Product Images" />
              <Text
                type="small_regular"
                color="primary40"
                text="Upload up to 5 images (PNG, JPG)"
              />

              <TouchableOpacity style={styles.uploadContainer} onPress={selectImages}>
                <View style={styles.uploadContent}>
                  <View style={styles.uploadIcon}>
                    <Feather name="upload" size={20} color="black" />
                  </View>
                  <Text
                    type="small_regular"
                    text={selectedImages.length > 0 ? 'Add more images' : 'Upload images'}
                  />
                </View>
              </TouchableOpacity>

              {/* Selected Images Grid */}
              {selectedImages.length > 0 && (
                <FlatList
                  data={selectedImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item }} style={styles.previewImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(item)}>
                        <MaterialIcons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={styles.imagesList}
                />
              )}
            </View>

            {/* Discount */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Discount (%)" />
              <Input
                placeholder="e.g 10"
                name="discount"
                control={control}
                rules={{ required: 'Discount is required' }}
                keyboardType="numeric"
              />
            </View>

            {/* Preview Button */}
            <Button
              title="Preview Product"
              onPress={() => {
                handleSubmit((data) => {
                  console.log('your data: ', data);
                  navigate('VENDOR_PRODUCT_PREVIEW_SCREEN', {
                    product: {
                      ...data,
                      specialCare: selectedSpecialCare,
                      category: selectedCategory,
                      subCategory: selectedSubcategory,
                      images: selectedImages,
                    },
                  });
                })();
              }}
            />
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: hp(16),
  },
  formContainer: {
    rowGap: hp(16),
  },
  inputGroup: {
    rowGap: hp(4),
  },
  descriptionInput: {
    height: hp(100),
    //alignSelf: 'flex-end',
  },
  uploadContainer: {
    width: '100%',
    height: hp(150),
    borderWidth: 1,
    borderColor: '#F4AB19',
    borderStyle: 'dashed',
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginTop: hp(8),
  },
  uploadContent: {
    alignItems: 'center',
    rowGap: hp(8),
  },
  uploadIcon: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: '#EFF0F2',
    borderWidth: 1,
    borderColor: '#CFD3D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(8),
  },

  imageContainer: {
    position: 'relative',
    width: wp(80),
    height: wp(80),
  },
  imagesList: {
    gap: wp(8),
    marginVertical: hp(8),
  },
  removeImageButton: {
    position: 'absolute',
    top: wp(4),
    right: wp(4),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp(10),
    width: wp(20),
    height: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VendorAddNewProduct;
