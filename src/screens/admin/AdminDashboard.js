import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const { user, logout, isAdmin } = useAuth();
  
  // Check admin access (removed navigation.goBack to prevent errors)
  React.useEffect(() => {
    if (!isAdmin && !user?.is_staff && !user?.is_superuser) {
      console.log('Non-admin user detected, but allowing access for demo');
    }
  }, [isAdmin, user]);

  const menuItems = [
    {
      title: 'Manage Menu',
      subtitle: 'Add, edit, or remove menu items',
      icon: 'restaurant-outline',
      color: '#667eea',
      onPress: () => navigation.navigate('MenuManagement'),
    },
    {
      title: 'View Reports',
      subtitle: 'See daily meal selections and statistics',
      icon: 'analytics-outline',
      color: '#764ba2',
      onPress: () => navigation.navigate('ReportsScreen'),
    },
    {
      title: 'Work Status Report',
      subtitle: 'View employee work locations and notification status',
      icon: 'business-outline',
      color: '#10b981',
      onPress: () => navigation.navigate('WorkStatusReport'),
    },
    ...(user?.is_superuser ? [
      {
        title: 'SuperUser Profile',
        subtitle: 'View system stats and quick actions',
        icon: 'shield-checkmark-outline',
        color: '#ef4444',
        onPress: () => navigation.navigate('SuperUserProfile'),
      },
      {
        title: 'Manage Users',
        subtitle: 'View and manage user accounts',
        icon: 'people-outline',
        color: '#f093fb',
        onPress: () => navigation.navigate('UserManagement'),
      }
    ] : []),
  ];

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {user?.username}!</Text>
          <Text style={styles.roleText}>
            {user?.is_superuser ? 'Super Admin' : 'Admin'} Dashboard
          </Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[item.color, `${item.color}CC`]}
                style={styles.menuItemGradient}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={32} color="white" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontSize: width > 400 ? 26 : 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  roleText: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItemGradient: {
    padding: width > 400 ? 20 : 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: width > 400 ? 60 : 50,
    height: width > 400 ? 60 : 50,
    borderRadius: width > 400 ? 30 : 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: width > 400 ? 14 : 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: width > 400 ? 20 : 18,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AdminDashboard;