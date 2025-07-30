import { StyleSheet, View, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, KeyboardWrapper, Screen, ScrollView, Text } from 'app/design-system';
import { useForm } from 'react-hook-form';
import { EMPTY_STRING } from 'app/utils/constants';
import * as ImagePicker from 'expo-image-picker';
import { hp, wp } from 'app/resources/config';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CategoryDropdown } from 'app/components';
import axios from 'axios';
import useAlert from 'app/hooks/useAlert';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import { LoaderModal } from 'app/modals';


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

export type VendorCategory = {
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

const VendorEditProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<VendorCategory | null>(null);
  const [selectedSpecialCare, setSelectedSpecialCare] = useState<SpecialCareItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { successAlert, errorAlert, attentionAlert } = useAlert();
    const { updateProduct } = useVendorApi();
  const { product } = route.params;
  
  const {
    discount,
    price,
    category,
    description,
    title,
    quantity,
    weight,
    image,
    subCategory,
    specialCare,
    _id: productId,
  } = product;

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      productName: title || '',
      productCategory: category?.title || '',
      productDescription: description || '',
      weight: weight?.toString() || '',
      price: price?.toString() || '',
      quantity: quantity?.toString() || '',
      discount: discount?.toString() || '',
    },
  });

  // Initialize states with existing product data
  useEffect(() => {
    if (product) {
      // Set form values
      reset({
        productName: title || '',
        productCategory: category?.title || '',
        productDescription: description || '',
        weight: weight?.toString() || '',
        price: price?.toString() || '',
        quantity: quantity?.toString() || '',
        discount: discount?.toString() || '',
      });

      // Set category and subcategory objects
      if (category) {
        setSelectedCategory(category);
      }

      if (subCategory) {
        setSelectedSubcategory(subCategory);
      }

      // Set special care if it exists
      if (specialCare) {
        const foundSpecialCare = SPECIAL_CARE_ITEMS.find(
          (item) => item._id === specialCare._id || item.title === specialCare.title
        );
        if (foundSpecialCare) {
          setSelectedSpecialCare(foundSpecialCare);
        }
      }

      // Set images if they exist
      if (image && image.length > 0) {
        setSelectedImages(image);
      }
    }
  }, [product]);

  const selectImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'Sorry, we need camera roll permissions to select an image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...newImages].slice(0, 5));
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'Failed to select images. Please try again.');
    }
  };

  const uploadImages = async (imageUris: string[]) => {
    if (imageUris.length === 0) return [];
    
    const uploadedUrls: string[] = [];

    try {
      setUploading(true);

      for (const uri of imageUris) {
        // Extract filename from URI (handle different URI formats)
        let filename = uri.split('/').pop() || `image_${Date.now()}`;

        // Ensure the filename has an extension
        if (!filename.includes('.')) {
          filename += '.jpg'; // default to jpg if no extension
        }

        // Determine MIME type based on extension
        const ext = filename.split('.').pop()?.toLowerCase();
        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          type: mimeType,
          name: filename,
        } as any);

        formData.append('upload_preset', 'wkel6g2m');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dwxehgnfx/image/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            transformRequest: () => formData, // Important for React Native
          }
        );

        uploadedUrls.push(response.data.secure_url);
        setUploadProgress(Math.round((uploadedUrls.length / imageUris.length) * 100));
      }

      return uploadedUrls;
    } catch (error: any) {
      console.error('Detailed upload error:', {
        error,
        response: error.response?.data,
      });
      throw new Error('Image upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (uri: string) => {
    setSelectedImages((prev) => prev.filter((imageUri) => imageUri !== uri));
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (selectedImages.length === 0) {
        attentionAlert('Please add at least one image');
        return;
      }

      if (!selectedSubcategory || !selectedSpecialCare || !selectedCategory ) {
        attentionAlert('Please select a product category');
        return;
      }

      setIsLoading(true);

      // Upload images (only if they're local URIs)
      const localImages = selectedImages.filter(uri => 
        uri.startsWith('file://') || uri.startsWith('content://')
      );
      const cloudImages = selectedImages.filter(uri => 
        uri.startsWith('http')
      );
      
      const uploadedImageUrls = await uploadImages(localImages);
      const allImageUrls = [...cloudImages, ...uploadedImageUrls];

      // Call the updateProduct function with the correct parameters
      const result = await updateProduct({
        title: data.productName,
        image: allImageUrls,
        category: selectedCategory._id,
        subCategory: selectedSubcategory?._id || "",
        quantity: parseInt(data.quantity),
        tags: [], // Assuming tags is required but not used in this UI
        price: parseFloat(data.price),
        discount: parseFloat(data.discount),
        weight: parseFloat(data.weight),
        specialCare: selectedSpecialCare?._id || "",
        description: data.productDescription,
        productId: productId,
        successCallback: () => {
          successAlert('Product updated successfully');
          navigation.goBack();
        },
      });

      if (!result.success) {
        errorAlert(result.message || 'Failed to update product');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      errorAlert(error.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardWrapper>
        <ScrollView>
        <LoaderModal isLoading={isLoading} />
          <View style={styles.header}>
            <Text text="Edit Product" type="body_semibold" color="primary80" />
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
              {errors.productName && (
                <Text type="small_regular" color="error" text={errors.productName.message} />
              )}
            </View>

            {/* Product Category */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Product Category" />
              <CategoryDropdown
                selectedItem={selectedCategory?.title}
                onSelectItem={setSelectedCategory}
                placeholder="Select a category"
              />
              {!selectedCategory && (
                <Text type="small_regular" color="error" text="Category is required" />
              )}
            </View>

            {/* Product Sub Category */}
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
              </View>
            )}

            {/* Special Care Dropdown */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Special Care Requirements" />
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
              {errors.productDescription && (
                <Text type="small_regular" color="error" text={errors.productDescription.message} />
              )}
            </View>

            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Weight" />
              <Input
                placeholder="e.g 500g"
                name="weight"
                control={control}
                rules={{ required: 'Weight is required' }}
                keyboardType="numeric"
              />
              {errors.weight && <Text type="small_regular" color="error" text={errors.weight.message} />}
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text type="body_regular" color="primary80" text="Price" />
              <Input
                placeholder="e.g £5.99"
                name="price"
                control={control}
                rules={{ required: 'Price is required' }}
                keyboardType="decimal-pad"
              />
              {errors.price && <Text type="small_regular" color="error" text={errors.price.message} />}
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
              {errors.quantity && (
                <Text type="small_regular" color="error" text={errors.quantity.message} />
              )}
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

              {/* Upload Progress */}
              {uploading && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                  <Text type="small_regular" text={`Uploading... ${uploadProgress}%`} />
                </View>
              )}

              {/* Selected Images Grid */}
              {selectedImages.length > 0 && (
                <FlatList
                  data={selectedImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item}-${index}`}
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
              {errors.discount && (
                <Text type="small_regular" color="error" text={errors.discount.message} />
              )}
            </View>

            {/* Save Button */}
            <Button
              title={isLoading ? "Saving..." : "Save Changes"}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
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

export default VendorEditProduct;
