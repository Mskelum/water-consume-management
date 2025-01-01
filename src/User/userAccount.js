import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../Firebase';

const UserAccount = ({navigation}) => {
  const [userData, setUserData] = useState({
    name: '',
    email: auth.currentUser?.email,
    mode: 'user',
    address: '',
    phoneNumber: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await db.collection('users').doc(auth.currentUser.uid).set(userData, { merge: true });
      console.log('User data updated in Firestore!');
      navigation.replace('DashboardTabs')
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <Text style={styles.title}>User Account</Text>
          <View style={styles.accountInfo}>
            <Text style={styles.infoText}>Email:</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              editable={false}
            />

            <Text style={styles.infoText}>Mode:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userData.mode}
                onValueChange={(itemValue) =>
                  setUserData({ ...userData, mode: itemValue })
                }
                style={styles.picker}
                dropdownIconColor="#FFFFFF"
              >
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>

            <Text style={styles.infoText}>Name:</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) =>
                setUserData({ ...userData, name: text })
              }
            />

            <Text style={styles.infoText}>Address:</Text>
            <TextInput
              style={styles.input}
              value={userData.address}
              onChangeText={(text) =>
                setUserData({ ...userData, address: text })
              }
            />

            <Text style={styles.infoText}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              value={userData.phoneNumber}
              onChangeText={(text) =>
                setUserData({ ...userData, phoneNumber: text })
              }
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
              disabled={isUpdating}
            >
              <Text style={styles.updateButtonText}>
                {isUpdating ? 'Updating...' : 'Update Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#F3F4F6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  accountInfo: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#E5E7EB',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    color: '#E5E7EB',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    color: '#E5E7EB',
  },
});

export default UserAccount;
