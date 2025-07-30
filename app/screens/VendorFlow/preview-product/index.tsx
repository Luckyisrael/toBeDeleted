import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, ScrollView, Image, Text, Button } from 'app/design-system';
import { hp, wp } from 'app/resources/config';
import { useVendorApi } from 'app/hooks/api/vendor-api/use-vendor-api';
import axios from 'axios';
import useAlert from 'app/hooks/useAlert';
import { LoaderModal } from 'app/modals';

const VendorProductPreview = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;

  const { addProduct, isAddingProduct } = useVendorApi();
  const { successAlert, errorAlert, attentionAlert } = useAlert();

  const {
    discount,
    price,
    productCategory,
    productDescription,
    productName,
    quantity,
    weight,
    images,
    category,
    subCategory,
    specialCare
  } = product;
  const { _id } = category;
  const { _id: subCatId } = subCategory;
  const { title } = specialCare;

  const discountedPrice = price - (price * discount) / 100;

  const uploadImages = async (imageUris: string[]) => {
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
    }
  };

  const handleSaveProduct = async () => {
    if (!images || images.length === 0) {
      attentionAlert('Please add at least one image');
      return;
    }

    try {
      // First validate all required fields
      if (!productName || !category || !price) {
        attentionAlert('Please fill all required fields');
        return;
      }

      setUploading(true);


      // Upload images (only if they're local URIs)
      const imageUrls = await uploadImages(
        images.filter((uri) => uri.startsWith('file://') || uri.startsWith('content://'))
      );

      // Combine with any existing URLs (if some images were already uploaded)
      const allImageUrls = [...images.filter((uri) => uri.startsWith('http')), ...imageUrls];

      // Then call addProduct with the uploaded URLs
      await addProduct({
        title: productName,
        image: allImageUrls,
        category: _id,
        subCategory: subCatId,
        quantity: quantity || 1, 
        description: productDescription,
        tags: [],
        price: price,
        discount: discount || 0, 
        weight: weight,
        specialCare: title,
        successCallback: () => {
          successAlert('Produc upload successfull');
          navigation.navigate('VENDORTABS', {screen: 'VENDOR_PRODUCTS_SCREEN'});
        },
      });
    } catch (error) {
      console.error('Full product save error:', error);
      errorAlert('Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Screen>
      <>
        <LoaderModal isLoading={uploading} />
        <ScrollView>
          <View style={styles.container}>
            <Text
              text="Preview"
              type="body_semibold"
              color="primary80"
              style={{ paddingVertical: 10 }}
            />

            {/* Main Product Image - use first image if available */}
            {images.length > 0 && (
              <Image
                uri={images[0]}
                width={wp(338)}
                height={hp(175)}
                bR={wp(12)}
                style={styles.mainImage}
              />
            )}

            {/* Image Variants - show remaining images */}
            {images.length > 1 && (
              <View style={styles.imageVariantsContainer}>
                {images.slice(1).map((image: string, index: number) => (
                  <View key={index}>
                    <Image uri={image} width={wp(79)} height={hp(60)} bR={8} />
                  </View>
                ))}
              </View>
            )}

            {/* Product Info */}
            <View>
              <View style={styles.headerRow}>
                <Text type="body_semibold" color="primary90" text={productName} />
                <View
                  style={[
                    styles.stockBadge,
                    quantity > 0 ? styles.inStockBadge : styles.outOfStockBadge,
                  ]}>
                  <Text
                    type="small_semibold"
                    color={quantity > 0 ? 'success' : 'error'}
                    text={quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  />
                </View>
              </View>

              <Text
                type="body_regular"
                color="primary60"
                text={productDescription}
                style={styles.description}
              />

              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Category" />
                <Text type="small_semibold" color="primary80" text={title} />
              </View>

              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Weight" />
                <Text type="small_semibold" color="primary80" text={weight} />
              </View>

              {discount > 0 && (
                <View style={styles.detailRow}>
                  <Text type="small_regular" color="primary40" text="Discount" />
                  <Text type="small_semibold" color="primary80" text={`${discount}% OFF`} />
                </View>
              )}

              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Price" />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {discount > 0 && (
                    <Text
                      type="small_regular"
                      color="primary40"
                      text={`£${price}`}
                      style={styles.originalPrice}
                    />
                  )}
                  <Text type="small_semibold" color="primary80" text={` £${discountedPrice}`} />
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Available Stock" />
                <Text type="small_semibold" color="primary80" text={`${quantity} items`} />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{ paddingBottom: hp(10), rowGap: 10 }}>
          <Button
            title="Save Product"
            onPress={handleSaveProduct}
            style={{ marginBottom: hp(12) }}
            isLoading={isAddingProduct}
          />
          <Button
            title="Edit Product"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
        </View>
      </>
    </Screen>
  );
};

export default VendorProductPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImage: {
    alignSelf: 'center',
    marginTop: hp(16),
    marginBottom: hp(16),
  },
  imageVariantsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(24),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  stockBadge: {
    borderRadius: wp(12),
    paddingVertical: hp(4),
    paddingHorizontal: wp(8),
  },
  inStockBadge: {
    backgroundColor: '#E7F6EC',
  },
  outOfStockBadge: {
    backgroundColor: '#FBEAE9',
  },
  description: {
    marginBottom: hp(16),
    lineHeight: hp(20),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(12),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
    gap: wp(8),
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#F4AB19',
    borderRadius: wp(4),
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
  },
});
