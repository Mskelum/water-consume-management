import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import { collection, getDocs, doc, getDoc, addDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase'; // Ensure this is your Firestore initialization file
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';

const Admin = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [waterLiters, setWaterLiters] = useState('');
  const [isWaterModalVisible, setIsWaterModalVisible] = useState(false);

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch detailed data for a selected user
  const handleUserPress = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
        setSelectedUser(userId);
        setIsModalVisible(true);
      } else {
        console.error('No such user found!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Add water usage for a user
  const handleAddWaterUsage = async () => {
    if (!waterLiters || !selectedUser) {
      console.error("Please provide water liters and select a user.");
      return;
    }

    try {
      // Get the user's email
      const userDocRef = doc(db, 'users', selectedUser);
      const userDoc = await getDoc(userDocRef);
      const userEmail = userDoc.data().email;

      // Add the water usage data
      await addDoc(collection(db, 'waterUsage'), {
        userEmail,
        litersUsed: parseFloat(waterLiters),
        date: new Date().toISOString(),
      });

      console.log('Water usage added for', userEmail);
      setIsWaterModalVisible(false);
      setWaterLiters('');
    } catch (error) {
      console.error('Error adding water usage:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('Logged out');
      navigation.replace('Login')
    }).catch((error) => {
    });
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between' }}>
        <Text style={styles.title}>Admin Panel</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <MaterialIcons name="logout" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleUserPress(item.id)}
          >
            <Text style={styles.userText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
            {userData ? (
              <>
                <Text style={styles.label}>Name: {userData.name}</Text>
                <Text style={styles.label}>Email: {userData.email}</Text>
                <Text style={styles.label}>Address: {userData.address}</Text>
                <Text style={styles.label}>Phone number: {userData.phoneNumber}</Text>
                <Button
                  title="Add Water Usage"
                  onPress={() => setIsWaterModalVisible(true)}
                  color="#3B82F6"
                />
              </>
            ) : (
              <Text style={styles.label}>Loading...</Text>
            )}
            <Button
              title="Close"
              onPress={() => {
                setIsModalVisible(false);
                setUserData(null);
              }}
              color="#EF4444"
            />
          </View>
        </View>
      </Modal>

      {/* Modal for adding water usage */}
      <Modal
        visible={isWaterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsWaterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Water Usage</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter liters of water"
              keyboardType="numeric"
              value={waterLiters}
              onChangeText={setWaterLiters}
            />
            <Button
              title="Submit"
              onPress={handleAddWaterUsage}
              color="#3B82F6"
            />
            <Button
              title="Close"
              onPress={() => setIsWaterModalVisible(false)}
              color="#EF4444"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#F3F4F6',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#1F2937',
    borderRadius: 8,
  },
  userText: {
    color: '#E5E7EB',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#1F2937',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: '#F3F4F6',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#D1D5DB',
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
    color: '#E5E7EB',
    fontSize: 16,
  },
});

export default Admin;
