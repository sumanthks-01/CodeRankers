import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import MenuScreen from '../screens/employee/MenuScreen';
import MySelectionsScreen from '../screens/employee/MySelectionsScreen';
import NotificationSettings from '../components/NotificationSettings';
import AdminDashboard from '../screens/admin/AdminDashboard';
import MenuManagement from '../screens/admin/MenuManagement';
import ReportsScreen from '../screens/admin/ReportsScreen';
import UserManagement from '../screens/admin/UserManagement';
import SuperUserProfile from '../screens/admin/SuperUserProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const EmployeeTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Menu') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'My Selections') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Notifications') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Menu" component={MenuScreen} />
    <Tab.Screen name="My Selections" component={MySelectionsScreen} />
    <Tab.Screen name="Notifications" component={NotificationSettings} />
  </Tab.Navigator>
);

const AdminStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="MenuManagement" component={MenuManagement} />
    <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
    <Stack.Screen name="UserManagement" component={UserManagement} />
    <Stack.Screen name="SuperUserProfile" component={SuperUserProfile} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  const theme = {
    dark: false,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.error,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : isAdmin ? (
          <Stack.Screen name="Admin" component={AdminStackNavigator} />
        ) : (
          <Stack.Screen name="Employee" component={EmployeeTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;