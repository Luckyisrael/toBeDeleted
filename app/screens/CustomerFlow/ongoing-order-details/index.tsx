import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { useUserProfileApi } from 'app/hooks/api/use-user-profile';
import { TickCircle } from 'iconsax-react-native';

// Constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const PROGRESS_SECTIONS = 3;
const SECTION_WIDTH = (SCREEN_WIDTH - 32) / PROGRESS_SECTIONS;

// Define TypeScript types
interface DeliveryStep {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

interface CourierDetails {
  name: string;
  status: string;
}

interface LocationDetails {
  title: string;
  subtitle: string;
  type: 'pickup' | 'dropoff';
}

const DeliveryTrackingScreen = () => {

    const route = useRoute();
    const { orderId, mongoId} = route.params;
  
    const { orderDetail, userDeliveryStatus } = useUserProfileApi();
    const { data, isLoading, error, refresh } = orderDetail(mongoId);
    console.log(' the result other details :', data.items)
    
/**
 * 
 * useEffect(() => {
  const handleSubmit = () => {
    const respose = userDeliveryStatus({
      orderId: orderId,
      successCallback() {
        console.log('success')
      },
    })
    console.log(' the result other details :', respose)
  };
  handleSubmit();
  // Cleanup function to avoid memory leaks
  return () => {
    // Any necessary cleanup can be done here
  }
}, [orderId, userDeliveryStatus]);
 */



  // Animated values
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  // Data
  const courier: CourierDetails = {
    name: 'Divine Samuel',
    status: 'Courier Assigned'
  };

  const locations: LocationDetails[] = [
    {
      title: 'The Asante\'s Store',
      subtitle: 'Asante\'s Store Address',
      type: 'pickup'
    },
    {
      title: 'My Address',
      subtitle: 'My Address, Glasgow, UK',
      type: 'dropoff'
    }
  ];

  const deliverySteps: DeliveryStep[] = [
    { id: '1', title: 'Order confirmed', time: '10:59am', completed: true },
    { id: '2', title: 'Being Packed', time: '11:25am', completed: true },
    { id: '3', title: 'Out for Delivery', time: '11:45am', completed: false },
    { id: '4', title: 'Almost There!', time: '11:50am', completed: false },
    { id: '5', title: 'Delivered', time: '12:00pm', completed: false },
  ];

  // Progress calculations
  const completedSteps = deliverySteps.filter(step => step.completed).length;
  const totalSteps = deliverySteps.length;
  const progressRatio = completedSteps / totalSteps;
  const currentSection = Math.ceil(progressRatio * PROGRESS_SECTIONS);
  
  // Animations
  useEffect(() => {
    // Shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false
      })
    ).start();

    // Pulse animation for the active step
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000, 
          easing: Easing.in(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  // Shimmer interpolation
  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH]
  });

  // Pulse interpolation for scale effect
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });

  // Render functions
  const renderProgressBar = () => {
    // Determine which sections are complete
    const sections = Array.from({ length: PROGRESS_SECTIONS }, (_, i) => {
      const sectionNumber = i + 1;
      return { 
        id: sectionNumber, 
        isComplete: sectionNumber <= currentSection,
        isActive: sectionNumber === currentSection && progressRatio < 1
      };
    });

    return (
      <View style={styles.progressBarContainer}>
        {sections.map((section, index) => (
          <View 
            key={section.id} 
            style={[
              styles.progressSection,
              { width: SECTION_WIDTH - 10 }, // Account for margin
              index < sections.length - 1 && { marginRight: 10 }
            ]}
          >
            <View 
              style={[
                styles.progressSectionBackground,
                section.isComplete && styles.completedSection
              ]}
            />
            
            {section.isActive && (
              <Animated.View 
                style={[
                  StyleSheet.absoluteFill,
                  { 
                    transform: [{ translateX: shimmerTranslate }],
                    opacity: 0.7
                  }
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Picking Up</Text>
      {renderProgressBar()}
    </View>
  );

  const renderCourierInfo = () => (
    <View style={styles.courierContainer}>
      <View style={styles.courierContent}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="bicycle" size={20} color="#333" />
        </View>
        <View style={styles.courierTextContainer}>
          <Text style={styles.courierName}>{courier.name}</Text>
          <Text style={styles.courierStatus}>{courier.status}</Text>
        </View>
      </View>
    </View>
  );

  const renderLocationCard = (location: LocationDetails, index: number) => {
    const isHighlighted = index === 0;
    return (
      <Animated.View 
        key={index} 
        style={[
          styles.locationCard, 
          isHighlighted && '',
          isHighlighted && { transform: [{ scale: pulseScale }] }
        ]}
      >
        <View style={[
          styles.locationIconContainer,
          location.type === 'pickup' ? styles.pickupIconContainer : styles.dropoffIconContainer
        ]}>
          {location.type === 'pickup' ? (
            <MaterialIcons name="store" size={24} color="#fff" />
            
          ) : (
            <Ionicons name="person" size={24} color="#fff" />
          )}
        </View>
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationType}>{location.type === 'pickup' ? 'Pick Up' : 'Drop Off'}</Text>
          <Text style={styles.locationTitle}>{location.title}</Text>
          <Text style={styles.locationSubtitle}>{location.subtitle}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderDeliveryArrow = () => (
    <View style={styles.deliveryArrowContainer}>
      <View style={styles.arrowLine} />
      
    </View>
  );

  const renderDeliveryTimeline = () => (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineHeader}>Delivery time</Text>
      {deliverySteps.map((step, index) => {
        const isActive = step.completed && !deliverySteps[index + 1]?.completed;
        
        return (
          <View key={step.id} style={styles.timelineStep}>
            <View style={styles.timelineStepIconContainer}>
              {step.completed ? (
                <Animated.View 
                  style={[
                    styles.completedStepCircle,
                    isActive && { transform: [{ scale: pulseScale }] }
                  ]}
                >
                  <TickCircle size="18" color="#0F973D" variant="Bold"/>
                  {isActive && (
                    <Animated.View style={[
                      styles.activePulse,
                      {
                        opacity: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 0]
                        }),
                        transform: [{
                          scale: pulseAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.8]
                          })
                        }]
                      }
                    ]} />
                  )}
                </Animated.View>
              ) : (
                <View style={styles.pendingStepCircle} />
              )}
              {index < deliverySteps.length - 1 && (
                <View style={[
                  styles.timelineConnector, 
                  step.completed ? styles.completedConnector : styles.pendingConnector
                ]} />
              )}
            </View>
            <View style={styles.timelineTextContainer}>
              <Text style={[
                styles.timelineStepText, 
                step.completed && styles.completedStepText,
                isActive && styles.activeStepText
              ]}>
                {step.title}
              </Text>
            </View>
            <Text style={[
              styles.timelineStepTime,
              isActive && styles.activeStepTime
            ]}>
              {step.time}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderCourierInfo()}
        <View style={styles.divider} />
        {renderLocationCard(locations[0], 0)}
        {renderDeliveryArrow()}
        {renderLocationCard(locations[1], 1)}
        {renderDeliveryTimeline()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#202020',
  },
  progressBarContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  progressSection: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  progressSectionBackground: {
    width: '100%',
    height: '100%',
  },
  completedSection: {
    backgroundColor: '#F0B057',
  },
  courierContainer: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,

  },
  courierContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courierTextContainer: {
    marginLeft: 16,
  },
  courierName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202020',
  },
  courierStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  revealButton: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  revealText: {
    color: '#3478F6',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,

  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#3478F6',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pickupIconContainer: {
    backgroundColor: '#F0B057',
  },
  dropoffIconContainer: {
    backgroundColor: '#4BB69C',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationType: {
    fontSize: 14,
    color: '#666',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202020',
    marginTop: 4,
  },
  locationSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deliveryArrowContainer: {
    alignItems: 'center',
  },
  arrowLine: {
    height: 30,
    width: 1,
    backgroundColor: '#ccc',
    borderStyle: 'dashed'
  },
  arrowTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ccc',
  },
  timelineContainer: {
    paddingTop: 20,
  },
  timelineHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  timelineStepIconContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  completedStepCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activePulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4BB69C',
    zIndex: 0,
  },
  pendingStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  timelineConnector: {
    position: 'absolute',
    top: 24,
    left: 11.5,
    width: 1,
    height: 50,
  },
  completedConnector: {
    backgroundColor: '#4BB69C',
  },
  pendingConnector: {
    backgroundColor: '#E0E0E0',
  },
  timelineTextContainer: {
    flex: 1,
  },
  timelineStepText: {
    fontSize: 16,
    color: '#666',
  },
  completedStepText: {
    color: '#202020',
    fontWeight: '500',
  },
  activeStepText: {
    color: '#4BB69C',
    fontWeight: '600',
  },
  timelineStepTime: {
    fontSize: 14,
    color: '#666',
  },
  activeStepTime: {
    color: '#4BB69C',
    fontWeight: '500',
  },
});

export default DeliveryTrackingScreen;