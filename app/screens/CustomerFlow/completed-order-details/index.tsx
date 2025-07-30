import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Screen, Text, Image, Button, ScrollView } from 'app/design-system';
import { Entypo, EvilIcons } from '@expo/vector-icons';
import { hp, wp } from 'app/resources/config';
import axios from 'axios'; // Assuming you have axios configured
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import { LoaderModal } from 'app/modals';

// Dummy order data
const dummyOrderData = {
  id: '#1023AS3H',
  pickupAddress: "522 Kilmarnock Rd, Glasgow G43 2BL, United Kingdom",
  deliveryAddress: "522 Kilmarnock Rd, Glasgow G43 2BL, United Kingdom",
  orderDate: "2nd February, 2025",
  pickupTime: "10:25am",
  deliveryTime: "10:25am",
  status: "Completed",
  vendor: {
    name: "Fresh Mart",
    logo: "https://via.placeholder.com/31"
  },
  items: [
    { name: "Broccoli (1kg)", price: 1.5, quantity: 1 },
    { name: "Carrots (1kg)", price: 1.2, quantity: 1 },
    { name: "Potatoes (2kg)", price: 2.3, quantity: 1 }
  ],
  payment: {
    subtotal: 5.0,
    deliveryFee: 2.5,
    serviceCharge: 1.0,
    total: 8.5
  }
};

const CompletedOrderDetails = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const route = useRoute();
  const { goBack } = useNavigation();
  const { orderId } = route.params;

  const { userRateApp, isProcessingLoading } = useUserProfileApi();
  
  // Dummy data from the API response
  const orderData = dummyOrderData;

  // Handle rating selection
  const handleRating = (selectedRating: any) => {
    setRating(selectedRating);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
        alert("Please select a rating");
        return;
      }
    try {
      await userRateApp({
        rating: rating,
        successCallback: () => {
        goBack();
          console.log('Delivery rating success');
        },
      });
    } catch (error) {
      console.error('Failed to rate:', error);
    }}

  // Render star rating component
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => handleRating(i)} style={styles.starButton}>
          {i <= rating ? (
            <Entypo name="star" size={36} color="#F4AB19" />  // Filled star (Entypo)
          ) : (
            <EvilIcons name="star" size={36} color="black" />  // Empty star (EvilIcons)
          )}
        </Pressable>
      );
    }
    return stars;
  };

  // Render payment summary item
  const renderPaymentItem = (label, amount, isTotal = false) => (
    <View style={styles.paymentRow}>
      <Text 
        text={label} 
        type={isTotal ? "sub_semibold" : "small_medium"} 
        color={isTotal ? "primary80" : "primary50"} 
      />
      <Text 
        text={`£${amount.toFixed(2)}`} 
        type="small_medium" 
        color={isTotal ? "primary80" : "primary50"} 
      />
    </View>
  );

  return (
    <Screen bgColor="#fffefa">
      <ScrollView>
        <View style={styles.container}>
            <LoaderModal isLoading={isProcessingLoading} />
          {/* Order Header */}
          <View style={[styles.sectionGap, { rowGap: 15}]}>
            <Text text={`order #${orderId}`} color="primary80" type="body_semibold" />
            
            {/* Pickup Address */}
            <View style={styles.addressContainer}>
              <View style={styles.addressLeftContainer}>
                <View style={styles.dot} />
                <View style={styles.addressTextContainer}>
                  <Text
                    text={orderData.pickupAddress}
                    color="primary80"
                    type="sub_regular"
                  />
                </View>
              </View>
              <View style={styles.addressTimeContainer}>
                <Text
                  text={`${orderData.orderDate} \n${orderData.pickupTime}`}
                  color="primary40"
                  type="sub_regular"
                  align="right"
                />
              </View>
            </View>
            
            {/* Delivery Address */}
            <View style={styles.addressContainer}>
              <View style={styles.addressLeftContainer}>
                <EvilIcons name="location" size={18} color="#F4AB19" />
                <View style={styles.addressTextContainer}>
                  <Text
                    text={orderData.deliveryAddress}
                    color="primary80"
                    type="sub_regular"
                  />
                </View>
              </View>
              <View style={styles.addressTimeContainer}>
                <Text text={orderData.status} color="success" type="sub_regular" align="right" />
                <Text text={orderData.deliveryTime} color="primary40" type="sub_regular" align="right" />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttons}>
              <Pressable style={styles.viewTimelineButton}>
                <View style={styles.dot} />
                <Text type="small_regular" color="secondary" text="view order timeline" />
              </Pressable>
              <Pressable style={styles.contactSupportButton}>
                <Text type="small_regular" color="primary40" text="Contact support" />
              </Pressable>
            </View>
          </View>

          {/* Vendor and Items */}
          <View style={styles.sectionGap}>
            <View style={styles.vendorContainer}>
              <Image uri={orderData.vendor.logo} width={31} height={31} bR={16} />
              <Text text={orderData.vendor.name} type="body_semibold" color="primary80" />
            </View>
            
            {/* Order Items */}
            {orderData.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <Text text={item.name} type="small_medium" color="primary80" />
                <Text text={`£${(item.price).toFixed(2)}`} type="small_medium" color="primary40" />
              </View>
            ))}
          </View>

          {/* Payment Summary */}
          <View style={styles.paymentSummaryContainer}>
            <Text text="Payment summary" color="primary80" type="sub_semibold" />
            {renderPaymentItem("Sub-total", orderData.payment.subtotal)}
            {renderPaymentItem("Delivery fee", orderData.payment.deliveryFee)}
            {renderPaymentItem("Service charge", orderData.payment.serviceCharge)}
            {renderPaymentItem("Total", orderData.payment.total, true)}
          </View>

          {/* Feedback Section */}
          <View style={styles.feedbackContainer}>
            <Text text="How was your delivery" type='small_bold' color='primary80'/>
            <Text 
              text="Rate your rider to help us improve your experience"
              type='small_regular' 
              color='primary80'
            />

            <View style={styles.starsContainer}>
              {renderStars()}
            </View>
            
            <View style={styles.feedbackInputContainer}>
              <Text text="Feedback Prompt (Optional)" type="small_regular" color="primary50" />
              <TextInput
                style={styles.feedbackInput}
                multiline
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Tell us about your experience..."
                placeholderTextColor="#CED3D5"
              />
            </View>
            
            <Button 
              title={isSubmitting ? 'Submitting...' : submitted ? 'Feedback Submitted' : 'Submit feedback'} 
              onPress={handleSubmitRating}
              disabled={isSubmitting || submitted}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default CompletedOrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionGap: {
    marginBottom: 24,
  },
  dot: {
    height: 13,
    width: 13,
    borderRadius: 12,
    backgroundColor: '#F4AB19',
  },
  addressContainer: {
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
  },
  addressLeftContainer: {
    flex: 1, 
    flexDirection: 'row', 
    columnGap: 10,
  },
  addressTextContainer: {
    width: '60%',
  },
  addressTimeContainer: {
    alignSelf: 'flex-end',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewTimelineButton: {
    flexDirection: 'row', 
    columnGap: 10, 
    alignItems: 'center',
  },
  contactSupportButton: {
    backgroundColor: '#FAFAFA', 
    padding: 10, 
    borderRadius: 50,
  },
  vendorContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    columnGap: 10,
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#CED3D5',
    paddingVertical: 15,
  },
  paymentSummaryContainer: {
    rowGap: 10, 
    marginBottom: 24,
  },
  paymentRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  feedbackContainer: {
    backgroundColor: 'white', 
    paddingVertical: 16, 
    paddingHorizontal: 14,
    rowGap: 12,
  },
  starsContainer: {
    flexDirection: 'row', 
    columnGap: 1,
    marginVertical: 10,
  },
  starButton: {
    padding: 2,
  },
  feedbackInputContainer: {
    marginVertical: 10,
    rowGap: 8,
  },
  feedbackInput: {
    height: hp(166),
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#CED3D5',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
  }
});