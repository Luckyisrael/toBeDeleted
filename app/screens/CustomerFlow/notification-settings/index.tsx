import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { NotificationItem } from 'app/components';
import { Screen, Text } from 'app/design-system';

// Type for our notification data
type NotificationType = {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
};

// Mock data - in a real app this would come from your backend
const mockNotifications: NotificationType[] = [
  {
    id: '1',
    title: 'New Messages',
    description: 'Get notified when you receive new messages',
    isEnabled: true,
  },
  {
    id: '2',
    title: 'Order Updates',
    description: 'Receive notifications about your order status',
    isEnabled: false,
  },
  {
    id: '3',
    title: 'Promotions',
    description: 'Be the first to know about our special offers',
    isEnabled: true,
  },
  {
    id: '4',
    title: 'Security Alerts',
    description: 'Get notified about important security updates',
    isEnabled: true,
  },
  {
    id: '5',
    title: 'Newsletter',
    description: 'Receive our weekly newsletter',
    isEnabled: false,
  },
];

const CustomerNotificationsScreen = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // Simulate loading data from backend
  useEffect(() => {
    // In a real app, you would fetch this from your API
    setTimeout(() => {
      setNotifications(mockNotifications);
    }, 500); // Simulate network delay
  }, []);

  const handleToggle = (id: string, value: boolean) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isEnabled: value } : notification
      )
    );
    // Here you would typically also make an API call to update the backend
    console.log(`Notification ${id} toggled to ${value}`);
  };

  return (
    <Screen bgColor="white">
      <View style={styles.container}>
        <View style={{ rowGap: 5, marginBottom: 20 }}>
          <Text type="emphasized_medium" text="Notification Settings" />
          <Text
            type="small_regular"
            color="primary40"
            text="Choose what notifications you want to receive."
          />
        </View>
        <ScrollView>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                description={notification.description}
                isEnabled={notification.isEnabled}
                onToggle={(value) => handleToggle(notification.id, value)}
              />
            ))
          ) : (
            <ActivityIndicator size={'large'} />
          )}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default CustomerNotificationsScreen;
