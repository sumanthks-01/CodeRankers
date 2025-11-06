import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SuperUserProfile = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalEmployees: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    if (!user?.is_superuser) {
      Alert.alert('Access Denied', 'Only superusers can access this screen');
      navigation.goBack();
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/users/stats/');
      setStats(response.data);
    } catch (error) {
      console.log('Failed to fetch stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.statCard}>
      <LinearGradient colors={[color, `${color}CC`]} style={styles.statGradient}>
        <View style={styles.statContent}>
          <Ionicons name={icon} size={32} color="white" />
          <View style={styles.statText}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>SuperUser Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="white" />
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SUPERUSER</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>System Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon="people"
              color="#667eea"
            />
            <StatCard
              title="Admins"
              value={stats.totalAdmins}
              icon="shield-checkmark"
              color="#764ba2"
            />
            <StatCard
              title="Employees"
              value={stats.totalEmployees}
              icon="person"
              color="#f093fb"
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon="checkmark-circle"
              color="#4facfe"
            />
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.actionGradient}>
              <Ionicons name="people" size={24} color="white" />
              <Text style={styles.actionText}>Manage Users</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MenuManagement')}
          >
            <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.actionGradient}>
              <Ionicons name="restaurant" size={24} color="white" />
              <Text style={styles.actionText}>Menu Management</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ReportsScreen')}
          >
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionGradient}>
              <Ionicons name="analytics" size={24} color="white" />
              <Text style={styles.actionText}>View Reports</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 12,
  },
});

export default SuperUserProfile;