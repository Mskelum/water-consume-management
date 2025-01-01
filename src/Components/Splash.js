import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../Firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Splash = () => {
  const Navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log('User Email:', user.email);
          const userDoc = await db.collection('users').doc(user.uid).get();

          if (userDoc.exists) {
            const userData = userDoc.data();

            console.log('User Mode:', userData.mode);

            if (userData.mode === 'admin') {
              Navigation.replace('Admin');
            } else {
              Navigation.replace('DashboardTabs');
            }
          } else {
            console.error('User document not found in Firestore');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [Navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Navigation.replace('Login'); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, [Navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water consumer</Text>
      <Text style={styles.subtitle}>Your personalized assistant</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default Splash;
