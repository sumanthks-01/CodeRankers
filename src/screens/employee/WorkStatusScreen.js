import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const WorkStatusScreen = () => {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState('office');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: 'office', label: 'Working from Office', icon: '🏢', color: '#10b981' },
    { value: 'wfh', label: 'Work from Home', icon: '🏠', color: '#3b82f6' },
    { value: 'sick', label: 'Sick Leave', icon: '🤒', color: '#ef4444' },
    { value: 'leave', label: 'On Leave', icon: '🏖️', color: '#f59e0b' },
  ];

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  const fetchCurrentStatus = async () => {
    try {
      const response = await api.get('/employee/work-status/');
      setCurrentStatus(response.data.status.status);
      setReason(response.data.status.reason || '');
    } catch (error) {
      console.error('Error fetching work status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await api.post('/employee/work-status/', {
        status: newStatus,
        reason: reason
      });
      
      setCurrentStatus(newStatus);
      Alert.alert('Success', 'Work status updated successfully');
      
      if (newStatus !== 'office') {
        Alert.alert(
          'Notification Settings', 
          'You will not receive meal notifications while not working from office.'
        );
      }
    } catch (error) {
      console.error('Error updating work status:', error);
      Alert.alert('Error', 'Failed to update work status');
    }
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status);
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Work Status</Text>
          <Text style={styles.subtitle}>Set your work location for today</Text>
        </View>

        <View style={styles.currentStatusCard}>
          <Text style={styles.currentStatusLabel}>Current Status</Text>
          <View style={styles.currentStatusRow}>
            <Text style={styles.currentStatusIcon}>{getStatusInfo(currentStatus)?.icon}</Text>
            <Text style={styles.currentStatusText}>{getStatusInfo(currentStatus)?.label}</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                currentStatus === option.value && styles.selectedOption
              ]}
              onPress={() => updateStatus(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {option.value !== 'office' && (
                    <Text style={styles.optionSubtext}>No meal notifications</Text>
                  )}
                </View>
              </View>
              {currentStatus === option.value && (
                <View style={[styles.selectedIndicator, { backgroundColor: option.color }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Reason (Optional)</Text>
          <TextInput
            style={styles.reasonInput}
            value={reason}
            onChangeText={setReason}
            placeholder="Add a reason for your status..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => updateStatus(currentStatus)}
          >
            <Text style={styles.updateButtonText}>Update Reason</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📱 Notification Info</Text>
          <Text style={styles.infoText}>
            • Office workers receive meal notifications{'\n'}
            • WFH/Sick/Leave status disables notifications{'\n'}
            • Status resets daily - update as needed
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  currentStatusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  currentStatusLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  currentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentStatusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  currentStatusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  statusOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  optionSubtext: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  reasonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2d3748',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
});

export default WorkStatusScreen;