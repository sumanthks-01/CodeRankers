import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';
import { registerForPushNotifications, scheduleDailyReminder } from './src/services/notificationService';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Initialize push notifications (skip in development)
        try {
          const token = await registerForPushNotifications();
          if (token) {
            console.log('Push token registered successfully');
            await scheduleDailyReminder();
          }
        } catch (error) {
          console.warn('Push notifications not available in development');
        }
        
        // Simulate app initialization time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAppReady(true);
      } catch (error) {
        console.warn('App initialization failed:', error);
        setAppReady(true); // Continue even if notifications fail
      }
    };

    initializeApp();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading || !appReady) {
    return (
      <>
        <SplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="light" backgroundColor="transparent" translucent />
      </>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="dark" backgroundColor="#FAFBFC" />
    </AuthProvider>
  );
}