import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, ScrollView, Image, Text, Button } from 'app/design-system';
import { hp, wp } from 'app/resources/config';


const VendorProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  
  // Handle API response format
  const productData = product.product;
  
  const name = productData.title || '';
  const description = productData.tags ? productData.tags.join(', ') : '';
  const category = productData.category?.title || '';
  const stock = productData.quantity || 0;
  const price = productData.price || 0;
  const discount = productData.discount || 0;
  const inStock = productData.availability !== undefined ? productData.availability : true;
  
  // Use weight as quantity + 'units' if not provided
  const weight = `${stock} units`;
  
  // Calculate discounted price
  const discountedPrice = price - (price * discount) / 100;
  
  // Image handling
  const mainImage = product.mainImage || (productData.image && productData.image.length > 0 ? productData.image[0] : '');
  const imageVariants = product.imageVariants || productData.image || [];

  return (
    <Screen>
      <>
        <ScrollView>
          <View style={styles.container}>
            <Text text='Preview' type='body_semibold' color='primary80' style={{ paddingVertical: 10 }}/>
            
            {/* Main Image */}
            <Image
              uri={mainImage}
              width={wp(338)}
              height={hp(175)}
              bR={wp(12)}
              style={styles.mainImage}
            />

            {/* Image Variants */}
            <View style={styles.imageVariantsContainer}>
              {imageVariants.map((image, index) => (
                <View key={index} style={{}}>
                  <Image uri={image} width={wp(79)} height={hp(60)} bR={8} />
                </View>
              ))}
            </View>
            
            {/* Product Info */}
            <View>
              <View style={styles.headerRow}>
                <Text type='body_semibold' color="primary90" text={name} />
                <View
                  style={[
                    styles.stockBadge,
                    inStock ? styles.inStockBadge : styles.outOfStockBadge,
                  ]}>
                  <Text
                    type="small_semibold"
                    color={inStock ? 'success' : 'error'}
                    text={inStock ? 'In Stock' : 'Out of Stock'}
                  />
                </View>
              </View>

              <Text
                type="body_regular"
                color="primary60"
                text={description}
                style={styles.description}
              />

              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Category" />
                <Text type="small_semibold" color="primary80" text={category} />
              </View>

              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Weight" />
                <Text type="small_semibold" color="primary80" text={weight} />
              </View>
              
              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Discount" />
                <Text type="small_semibold" color="primary80" text={`${discount}% OFF`} />
              </View>
              
              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Price" />
                <View style={styles.priceContainer}>
                  {discount > 0 && (
                    <Text 
                      type="small_regular" 
                      color="error" 
                      text={`£${price.toFixed(2)}`} 
                      style={styles.originalPrice} 
                    />
                  )}
                  <Text 
                    type="small_semibold" 
                    color="primary80" 
                    text={`£${discountedPrice.toFixed(2)}`} 
                  />
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text type="small_regular" color="primary40" text="Available Stock:" />
                <Text type="small_semibold" color="primary80" text={`${stock} items`} />
              </View>
              
              {productData.isApproved !== undefined && (
                <View style={styles.detailRow}>
                  <Text type="small_regular" color="primary40" text="Approval Status:" />
                  <View
                    style={[
                      styles.approvalBadge,
                      productData.isApproved ? styles.approvedBadge : styles.pendingBadge,
                    ]}>
                    <Text
                      type="small_semibold"
                      color={productData.isApproved ? 'success' : 'warning'}
                      text={productData.isApproved ? 'Approved' : 'Pending Approval'}
                    />
                  </View>
                </View>
              )}
              
              {productData.addedOn && (
                <View style={styles.detailRow}>
                  <Text type="small_regular" color="primary40" text="Added On:" />
                  <Text 
                    type="small_semibold" 
                    color="primary80" 
                    text={new Date(productData.addedOn).toLocaleDateString()} 
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <Button
          title="Edit Product"
          onPress={() => navigation.navigate('VENDOR_EDIT_PRODUCT_SCREEN', { product: productData })}
        />
      </>
    </Screen>
  );
};

export default VendorProductDetailScreen;

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
