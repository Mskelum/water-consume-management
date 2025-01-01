import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';

const Dashboard = ({ navigation }) => {
  const waterData = [
    { day: 'Mon', liters: 2 },
    { day: 'Tue', liters: 2.5 },       
    { day: 'Wed', liters: 3 },
    { day: 'Thu', liters: 1.8 },
    { day: 'Fri', liters: 2.2 },
    { day: 'Sat', liters: 2.7 },
    { day: 'Sun', liters: 3.5 },
  ];

  const chartData = {
    labels: waterData.map((item) => item.day),
    datasets: [
      {
        data: waterData.map((item) => item.liters),
      },
    ],
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('Logged out');
      navigation.replace('Login')
    }).catch((error) => {
    });
  }

  const handleAddWater = () => {
    navigation.navigate('userAccount')
  };

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

      {/* Line Chart */}
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40} 
        height={220}
        chartConfig={{
          backgroundColor: '#1E293B',
          backgroundGradientFrom: '#1F2937',
          backgroundGradientTo: '#1E293B',
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(243, 244, 246, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#10B981',
          },
        }}
        style={styles.chart}
      />

      {/* Table */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Weekly Water Details</Text>
        <FlatList
          data={waterData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.day}</Text>
              <Text style={styles.tableCell}>{item.liters} liters</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F3F4F6',
    letterSpacing: 1.2,
    flex: 1, 
    textAlign: 'left', 
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 50, 
    marginLeft: 15, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, 
  },
  icon: {
    alignSelf: 'center',
  },
  chart: {
    marginVertical: 20,
    borderRadius: 8,
  },
  tableContainer: {
    marginTop: 10,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    padding: 15,
  },
  tableTitle: {
    fontSize: 20,
    color: '#E5E7EB',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tableCell: {
    fontSize: 16,
    color: '#D1D5DB',
  },
});

export default Dashboard;

