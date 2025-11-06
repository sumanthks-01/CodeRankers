import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const WorkStatusReport = ({ navigation }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const statusConfig = {
    office: { icon: '🏢', color: '#10b981', label: 'Office' },
    wfh: { icon: '🏠', color: '#3b82f6', label: 'Work from Home' },
    sick: { icon: '🤒', color: '#ef4444', label: 'Sick Leave' },
    leave: { icon: '🏖️', color: '#f59e0b', label: 'On Leave' }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await api.get('/admin/work-status-report/');
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching work status report:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReport();
    setRefreshing(false);
  };

  const renderStatusSection = (status, users) => {
    const config = statusConfig[status];
    if (!config || users.length === 0) return null;

    return (
      <View key={status} style={styles.statusSection}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusIcon}>{config.icon}</Text>
          <Text style={styles.statusTitle}>{config.label}</Text>
          <View style={[styles.countBadge, { backgroundColor: config.color }]}>
            <Text style={styles.countText}>{users.length}</Text>
          </View>
        </View>
        
        {users.map((user, index) => (
          <View key={index} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.username}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            {user.reason && (
              <Text style={styles.userReason}>{user.reason}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Work Status Report</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {reportData && (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Today's Summary</Text>
              <Text style={styles.summaryDate}>{new Date(reportData.date).toLocaleDateString()}</Text>
              
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{reportData.total_onsite}</Text>
                  <Text style={styles.statLabel}>On-site Workers</Text>
                  <Text style={styles.statSubtext}>Will receive notifications</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {Object.values(reportData.status_report).reduce((sum, users) => sum + users.length, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total with Status</Text>
                  <Text style={styles.statSubtext}>Explicitly set status</Text>
                </View>
              </View>

              {reportData.users_with_no_status > 0 && (
                <View style={styles.noStatusInfo}>
                  <Text style={styles.noStatusText}>
                    {reportData.users_with_no_status} users with no status (default: Office)
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.statusContainer}>
              {Object.entries(reportData.status_report).map(([status, users]) => 
                renderStatusSection(status, users)
              )}
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  summaryDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
  noStatusInfo: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  noStatusText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  userInfo: {
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  userReason: {
    fontSize: 14,
    color: '#4b5563',
    fontStyle: 'italic',
    marginTop: 4,
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

export default WorkStatusReport;