import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Vector } from 'app/assets/images';

const PayoutBanner = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#43A047']}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <View style={styles.headerRow}>
              <Text style={styles.hurryText}>Hurry! </Text>
              <View style={styles.warningIcon}>
                <Text style={styles.warningIconText}>!</Text>
              </View>
            </View>
            <Text style={styles.titleText}>Set Up Your Payout Details 💳</Text>
            <Text style={styles.descriptionText}>
              Go to your profile and add your bank info in Settings to start 
              receiving payments!
            </Text>
          </View>
          
          <View style={styles.rightContent}>
            <View style={styles.cardImage} />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Go to Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Background wave shape */}
        <Image
          source={Vector} // Your vector image
          style={styles.backgroundShape}
          resizeMode="cover"
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 2,
    paddingRight: 10,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hurryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  warningIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  warningIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 6,
  },
  descriptionText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  cardImage: {
    width: 70,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    marginBottom: 15,
    transform: [{ rotate: '15deg' }],
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
});

export default PayoutBanner;