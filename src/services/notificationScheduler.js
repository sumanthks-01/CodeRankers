import { checkAndNotifyEmptySelections } from './notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

let schedulerInterval = null;

// Start the notification scheduler
export const startNotificationScheduler = () => {
  if (schedulerInterval) return; // Already running
  
  schedulerInterval = setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Check at 8:30 PM daily
    if (hour === 20 && minute === 30) {
      try {
        const settings = await AsyncStorage.getItem('notificationSettings');
        const notificationSettings = settings ? JSON.parse(settings) : { selectionCheck: true };
        
        if (notificationSettings.selectionCheck) {
          await checkAndNotifyEmptySelections();
        }
      } catch (error) {
        console.warn('Error in notification scheduler:', error);
      }
    }
  }, 60000); // Check every minute
  
  console.log('Notification scheduler started');
};

// Stop the notification scheduler
export const stopNotificationScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('Notification scheduler stopped');
  }
};