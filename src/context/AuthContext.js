import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotifications, setupNotificationListeners, scheduleDailyReminder } from '../services/notificationService';
import { startNotificationScheduler, stopNotificationScheduler } from '../services/notificationScheduler';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        isAdmin: action.payload.user.is_admin || action.payload.user.is_staff || action.payload.user.is_superuser || false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null,
        isAdmin: false,
      };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isLoggedIn: !!action.payload.token,
        isAdmin: action.payload.user?.is_admin || action.payload.user?.is_staff || action.payload.user?.is_superuser || false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    user: null,
    token: null,
    isAdmin: false,
  });

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const user = await AsyncStorage.getItem('user');
        if (token && user) {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { token, user: JSON.parse(user) },
          });
        }
      } catch (error) {
        console.error('Error restoring token:', error);
      }
    };
    restoreToken();
  }, []);

  const login = async (token, user) => {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { token, user } });
    
    // Register for push notifications and set up listeners after login
    await registerForPushNotifications();
    setupNotificationListeners();
    await scheduleDailyReminder();
    
    // Start notification scheduler for employees
    if (!user.is_staff && !user.is_superuser) {
      startNotificationScheduler();
    }
  };

  const logout = async () => {
    try {
      stopNotificationScheduler();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still dispatch logout even if storage cleanup fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};