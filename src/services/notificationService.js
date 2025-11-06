import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import api from './api';

// Configure notification behavior for foreground and background
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configure notification categories for better interaction
Notifications.setNotificationCategoryAsync('food_reminder', [
  {
    identifier: 'select_food',
    buttonTitle: 'Select Food',
    options: { opensAppToForeground: true },
  },
  {
    identifier: 'remind_later',
    buttonTitle: 'Remind Later',
    options: { opensAppToForeground: false },
  },
]);

export const registerForPushNotifications = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Push notification permissions not granted');
      return null;
    }
    
    // For development, use device identifier as token
    const deviceToken = Constants.deviceId || 'local-device';
    
    // Register token with backend (disabled for now)
    console.log('Device token generated:', deviceToken);
    // Backend registration will be enabled when server is updated
    
    return deviceToken;
  } catch (error) {
    console.warn('Error registering for notifications:', error);
    return null;
  }
};

export const scheduleDailyReminder = async () => {
  try {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule daily reminder at 6 PM (18:00)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Karmic Canteen Reminder',
        body: 'Don\'t forget to select your meals for tomorrow! Deadline: 9:00 PM',
        sound: 'default',
        priority: 'high',
        categoryIdentifier: 'food_reminder',
        data: { type: 'food_reminder', action: 'select_food' },
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });
    
    // Schedule selection reminder at 8:30 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Final Reminder - Karmic Canteen',
        body: 'Last 30 minutes to select your meals! Please check your selections now.',
        sound: 'default',
        priority: 'high',
        categoryIdentifier: 'food_reminder',
        data: { type: 'final_reminder', action: 'check_selections' },
      },
      trigger: {
        hour: 20,
        minute: 30,
        repeats: true,
      },
    });
  } catch (error) {
    console.warn('Error scheduling notifications:', error);
  }
};

// Check if user has made selections and send notification if empty
export const checkAndNotifyEmptySelections = async () => {
  try {
    const response = await api.get('/employee/check-selections/');
    const { has_selections, selections } = response.data;
    
    if (!has_selections) {
      // Send urgent notification for completely empty selections
      await sendImmediateNotification(
        'Urgent: Select Your Meals!',
        'You haven\'t selected any meals for tomorrow. Please select at the earliest. Deadline: 9:00 PM'
      );
    } else {
      // Check for partially empty selections
      const hasBreakfast = selections.breakfast && selections.breakfast.length > 0;
      const hasLunch = selections.lunch && selections.lunch.length > 0;
      const hasSnacks = selections.snacks && selections.snacks.length > 0;
      
      const missingMeals = [];
      if (!hasBreakfast) missingMeals.push('Breakfast');
      if (!hasLunch) missingMeals.push('Lunch');
      if (!hasSnacks) missingMeals.push('Snacks');
      
      if (missingMeals.length > 0) {
        await sendImmediateNotification(
          'Complete Your Meal Selection',
          `Missing: ${missingMeals.join(', ')}. Complete your selection before 9:00 PM`
        );
      }
    }
  } catch (error) {
    console.warn('Error checking selections:', error);
  }
};

export const sendImmediateNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        priority: 'high',
        categoryIdentifier: 'food_reminder',
        data: { type: 'immediate_reminder', action: 'select_food' },
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.warn('Error sending notification:', error);
  }
};

// Manual trigger for testing selection check
export const triggerSelectionCheck = async () => {
  await checkAndNotifyEmptySelections();
};

export const setupNotificationListeners = () => {
  // Listen for notification responses (when user taps notification)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    const { data } = response.notification.request.content;
    if (data?.type === 'food_reminder' || data?.type === 'urgent_reminder') {
      // Navigate to menu screen when notification is tapped
      console.log('Food reminder notification tapped');
    } else if (data?.type === 'final_reminder') {
      // Check selections when final reminder is tapped
      checkAndNotifyEmptySelections();
    }
  });

  // Listen for notifications received while app is in foreground
  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    const { data } = notification.request.content;
    if (data?.type === 'final_reminder') {
      // Check selections when final reminder is received
      setTimeout(() => checkAndNotifyEmptySelections(), 1000);
    }
  });

  return () => {
    responseSubscription.remove();
    receivedSubscription.remove();
  };
};