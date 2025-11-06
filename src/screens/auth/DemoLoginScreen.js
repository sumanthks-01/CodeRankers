import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, dimensions, typography } from '../../theme/colors';
import { SimpleButton, SimpleInput } from '../../components/UI';

const DemoLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();

  const handleEmployeeLogin = async () => {
    const mockToken = 'demo-employee-token';
    const mockUser = {
      id: 1,
      username: 'employee123',
      is_admin: false,
      employee_id: 'EMP001'
    };
    await login(mockToken, mockUser);
  };

  const handleAdminLogin = async () => {
    const mockToken = 'demo-admin-token';
    const mockUser = {
      id: 2,
      username: 'admin',
      is_admin: true,
      employee_id: 'ADM001'
    };
    await login(mockToken, mockUser);
  };

  const handleFormLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }
    
    // Demo credentials
    if (username === 'admin' && password === 'admin') {
      handleAdminLogin();
    } else if (username === 'employee' && password === 'employee') {
      handleEmployeeLogin();
    } else {
      Alert.alert('Demo Login', 'Use:\nUsername: admin, Password: admin\nOR\nUsername: employee, Password: employee');
    }
  };

  return (
    <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🍽️</Text>
          </View>
          <Text style={styles.title}>Karmic Canteen</Text>
          <Text style={styles.subtitle}>Demo Environment</Text>
        </View>
        
        {!showDemo ? (
          <View style={styles.formContainer}>
            <SimpleInput
              label="Username"
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              icon={<Text style={styles.inputIcon}>👤</Text>}
            />
            
            <SimpleInput
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Text style={styles.inputIcon}>🔒</Text>}
            />
            
            <SimpleButton
              title="Sign In"
              onPress={handleFormLogin}
              style={styles.loginButton}
              size="large"
            />
            
            <SimpleButton
              title="Try Demo Mode"
              onPress={() => setShowDemo(true)}
              variant="outline"
              style={styles.demoButton}
            />
            
            <View style={styles.credentialsCard}>
              <Text style={styles.credentialsTitle}>Demo Credentials</Text>
              <Text style={styles.credentialsText}>
                Admin: admin / admin{"\n"}
                Employee: employee / employee
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.demoHeader}>
              <Text style={styles.demoIcon}>🎭</Text>
              <Text style={styles.demoTitle}>Demo Mode</Text>
              <Text style={styles.demoSubtitle}>Choose your role to explore the app</Text>
            </View>
            
            <SimpleButton
              title="Login as Employee"
              onPress={handleEmployeeLogin}
              variant="primary"
              size="large"
              style={styles.roleButton}
              icon={<Text style={styles.roleIcon}>👤</Text>}
            />
            
            <SimpleButton
              title="Login as Admin"
              onPress={handleAdminLogin}
              variant="secondary"
              size="large"
              style={styles.roleButton}
              icon={<Text style={styles.roleIcon}>👥</Text>}
            />
            
            <SimpleButton
              title="Back to Login Form"
              onPress={() => setShowDemo(false)}
              variant="ghost"
              style={styles.backButton}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  demoButton: {
    marginBottom: spacing.lg,
  },
  credentialsCard: {
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  credentialsTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  credentialsText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  demoHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  demoIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  demoTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  demoSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  roleButton: {
    marginBottom: spacing.md,
  },
  roleIcon: {
    fontSize: 16,
  },
  backButton: {
    marginTop: spacing.lg,
  },
});

export default DemoLoginScreen;