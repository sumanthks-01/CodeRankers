import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { triggerSelectionCheck, checkAndNotifyEmptySelections } from '../services/notificationService';

const NotificationSettings = ({ navigation }) => {
  const [settings, setSettings] = useState({
    dailyReminder: true,
    selectionCheck: true,
    urgentNotifications: true,
  });

  useEffect(() => {
    loadSettings();
    
    // Set up daily check at 8:30 PM
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 30) {
        if (settings.selectionCheck) {
          checkAndNotifyEmptySelections();
        }
      }
    };
    
    // Check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [settings.selectionCheck]);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const testNotification = async () => {
    Alert.alert(
      'Test Notification',
      'This will check your current meal selections and send a notification if needed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Test',
          onPress: async () => {
            await triggerSelectionCheck();
            Alert.alert('Test Complete', 'Check your notifications!');
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Daily Reminder</Text>
              <Text style={styles.settingDesc}>Get reminded at 6:00 PM daily</Text>
            </View>
            <Switch
              value={settings.dailyReminder}
              onValueChange={(value) => updateSetting('dailyReminder', value)}
              trackColor={{ false: '#ddd', true: '#667eea' }}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Selection Check</Text>
              <Text style={styles.settingDesc}>Check selections at 8:30 PM</Text>
            </View>
            <Switch
              value={settings.selectionCheck}
              onValueChange={(value) => updateSetting('selectionCheck', value)}
              trackColor={{ false: '#ddd', true: '#667eea' }}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Urgent Notifications</Text>
              <Text style={styles.settingDesc}>Get notified for empty selections</Text>
            </View>
            <Switch
              value={settings.urgentNotifications}
              onValueChange={(value) => updateSetting('urgentNotifications', value)}
              trackColor={{ false: '#ddd', true: '#667eea' }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.testButton} onPress={testNotification}>
          <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.testGradient}>
            <Ionicons name="notifications" size={20} color="white" />
            <Text style={styles.testText}>Test Notification</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#667eea" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoDesc}>
              • Daily reminder at 6:00 PM{'\n'}
              • Selection check at 8:30 PM{'\n'}
              • Urgent notification if no selections made{'\n'}
              • Partial reminder for incomplete selections
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
    color: '#666',
  },
  testButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  testGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  testText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default NotificationSettings;