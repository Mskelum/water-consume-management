import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import Dashboard from "../User/Dashboard";
import Contact from "../User/Contact";
import Splash from "../Components/Splash";
import Login from "../Auth/Login";
import ForgotPs from "../Auth/Forgot";
import Register from "../Auth/Register";
import userAccount from "../User/userAccount";
import Admin from "../Admin/Admin";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: "#333",
      tabBarStyle: { backgroundColor: "#000" },
      headerShown: false,
    }}
  >
    <Tab.Screen name="Dashboard" component={Dashboard}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen name="Contact" component={Contact}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="info-circle" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppHome = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Forgot" component={ForgotPs} options={{ headerShown: false }} />
        <Stack.Screen name="userAccount" component={userAccount} options={{ headerShown: false }} />
        <Stack.Screen name="DashboardTabs" component={DashboardTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={Admin} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppHome;
