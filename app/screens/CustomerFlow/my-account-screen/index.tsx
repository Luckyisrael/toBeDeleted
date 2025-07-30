import { Pressable, StyleSheet, View, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';
import { CustomerSettingAccountScreenProps } from 'app/navigation/types';
import { Screen, Text, Button } from 'app/design-system';
import { Avatar } from 'app/assets/svg';
import { wp } from 'app/resources/config';
import { MaterialIcons } from '@expo/vector-icons';
import { CloseCircle } from 'iconsax-react-native';

const MyAccountScreen = ({ navigation: { navigate } }: CustomerSettingAccountScreenProps) => {
  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');

  const openModal = (type: string) => setModalVisible(type);
  const closeModal = () => setModalVisible(null);

  return (
    <Screen>
      <View>
        <View>
          <Text text="My Account" style={styles.headerText} />

          <View>
            {/* Profile Section */}
            <View style={styles.header}>
              <View style={styles.profileContainer}>
                <Avatar />
                <View>
                  <Text text="Lucky Israel" />
                  <Text text="London UK" />
                </View>
              </View>
              <Text text="Edit" color="blue1" onPress={() => openModal('editProfile')} />
            </View>

            {/* Account Details */}
            <View style={styles.bodyContainer}>
              {[
                {
                  label: 'Email Address',
                  value: 'your email is luckyisrael4real@gmail.com',
                  action: 'Change',
                  type: 'changeEmail',
                },
                {
                  label: 'Password',
                  value: 'your password is ******',
                  action: 'View',
                  type: 'viewPassword',
                },
                {
                  label: 'Location',
                  value: 'your saved location is Jerusalem',
                  action: 'Change',
                  type: 'changeLocation',
                },
                {
                  label: 'Subscription',
                  value: 'you are subscribed to notifications',
                  action: 'See All',
                  type: 'viewSubscription',
                },
                {
                  label: 'Delete Account',
                  value: 'Delete all history and transactions permanently',
                  action: 'Delete',
                  type: 'deleteAccount',
                },
              ].map(({ label, value, action, type }) => (
                <View key={type} style={styles.body}>
                  <View>
                    <Text type='body_semibold' text={label} />
                    <Text type='small_regular' text={value} />
                  </View>
                  <Text type='small_regular' text={action} color="blue1" onPress={() => openModal(type)} />
                </View>
              ))}
            </View>

            {/* Logout Button */}
            <Pressable onPress={() => console.log('Logging out...')} style={styles.deleteButton}>
              <Text text="Log Out" color="error1" align="center" />
            </Pressable>
          </View>
        </View>

        {/* Modals */}
        {modalVisible === 'changeEmail' && (
          <Modal transparent visible animationType="fade" onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text text="Change Email Address" align="center" />
                <TextInput
                  placeholder="Enter new email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Confirm new email"
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  style={styles.input}
                />
                <CloseCircle size="24" color="#FF8A65" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        )}

        {modalVisible === 'viewPassword' && (
          <Modal transparent visible animationType="fade" onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text text="Enter your current password" align="center" />
                <TextInput
                  placeholder="Enter password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
                <CloseCircle size="24" color="#FF8A65" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        )}

        {modalVisible === 'changeLocation' && (
          <Modal transparent visible animationType="fade" onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text text="Change Location" align="center" />
                <TextInput
                  placeholder="Enter new location"
                  value={location}
                  onChangeText={setLocation}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Enter city"
                  value={city}
                  onChangeText={setCity}
                  style={styles.input}
                />
                <CloseCircle size="24" color="#FF8A65" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        )}

        {modalVisible === 'deleteAccount' && (
          <Modal transparent visible animationType="fade" onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text text="Are you sure you want to delete your account?" align="center" />
                <View style={styles.buttonRow}>
                  <CloseCircle size="24" color="#FF8A65" onPress={closeModal} />

                  <Button title="Delete" onPress={() => console.log('Account Deleted')} />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Screen>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
  },
  bodyContainer: {
    rowGap: 35,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingVertical: wp(15),
    marginTop: wp(30),
    borderColor: '#98A2B3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    borderColor: '#ccc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});
