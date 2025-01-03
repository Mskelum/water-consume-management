import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { db, auth } from '../Firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';

const Dashboard = ({ navigation }) => {
  const [waterData, setWaterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const userEmail = auth.currentUser.email; // Get logged-in user's email
        const waterConsumptionRef = collection(db, 'waterUsage');
        const q = query(waterConsumptionRef, where('userEmail', '==', userEmail));

        const querySnapshot = await getDocs(q);
        const data = [];
        
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({
            date: docData.date,
            liters: docData.litersUsed,
            email: docData.userEmail, // Include email here
          });
        });

        // If there's no data, generate some random data for demonstration
        if (data.length === 0) {
          const randomData = [];
          for (let i = 0; i < 7; i++) { // Generate 7 days of random data
            randomData.push({
              date: new Date(new Date().setDate(new Date().getDate() - i)),
              liters: Math.floor(Math.random() * 101), // Random liters between 0 and 100
            });
          }
          setWaterData(randomData);
        } else {
          setWaterData(data);
        }
      } catch (error) {
        console.error("Error fetching water data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Prepare data for chart
  const chartData = {
    labels: waterData.map(item => new Date(item.date).toLocaleDateString()), // Extract dates
    datasets: [
      {
        data: waterData.map(item => item.liters), // Extract liters
        strokeWidth: 2, // Set the stroke width of the line
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Line color
      }
    ]
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('Logged out');
      navigation.replace('Login')
    }).catch((error) => {
    });
  }

  // Y-axis labels (specifically for your use case)
  const yAxisLabels = [1, 5, 10, 15, 20, 25, 50, 75, 100, 120];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Consumer</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <MaterialIcons name="logout" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Water Consumption Chart */}
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40} // Adjust width
        height={220}
        chartConfig={{
          backgroundColor: '#1F2937',
          backgroundGradientFrom: '#1F2937',
          backgroundGradientTo: '#1F2937',
          decimalPlaces: 0, // No decimal places
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#1F2937'
          },
          yAxisLabel: '', // Hide label in front of the Y-axis values
          yAxisSuffix: ' Liters',
          yAxisInterval: 10, // Set intervals on the Y axis
          formatYLabel: (value) => {
            // Manually round the values to match your custom labels
            const yVal = Math.round(value);
            return yAxisLabels.includes(yVal) ? `${yVal} Liters` : '';
          }
        }}
        bezier
      />

      {/* Water Consumption History */}
      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Daily Consumption History</Text>
        {waterData.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.historyLiters}>{item.liters} Liters</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 5,
    backgroundColor: '#1F2937',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    marginBottom:30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginBottom: 20,
  },
  historyContainer: {
    marginTop: 20,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    padding: 15,
  },
  historyTitle: {
    fontSize: 20,
    color: '#E5E7EB',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
  },
  historyEmail: {
    fontSize: 16,
    color: '#F3F4F6',
  },
  historyDate: {
    fontSize: 16,
    color: '#F3F4F6',
  },
  historyLiters: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  logLink: {
    color: '#10B981',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Dashboard;
