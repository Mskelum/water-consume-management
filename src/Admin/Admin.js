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
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';

const Admin = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);

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

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('Logged out');
      navigation.replace('Login')
    }).catch((error) => {
    });
  }

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', paddingHorizontal: 20,justifyContent: 'space-between' }}>
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
});

export default Admin;
