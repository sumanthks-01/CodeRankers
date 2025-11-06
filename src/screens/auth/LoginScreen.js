import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { SimpleButton, SimpleInput, LoadingSpinner } from '../../components/UI';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing Information', 'Please enter both username and password to continue.');
      return;
    }
    
    if (username.trim().length < 2) {
      Alert.alert('Invalid Username', 'Username must be at least 2 characters long.');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { username, password });
      const response = await api.post('/auth/login/', {
        username,
        password,
      });
      console.log('Login response:', response.data);

      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
        await login(token, user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.error || 'Invalid login details. Please check your input.';
        } else {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      Alert.alert('Login Failed', errorMessage, [
        { text: 'OK', onPress: () => {
          // Clear form and allow retry
          setUsername('');
          setPassword('');
        }}
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={styles.loadingText}>Signing you in...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
      style={styles.container}
    >
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Login to Karmic Canteen</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username:</Text>
            <SimpleInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password:</Text>
            <SimpleInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>
          
          <SimpleButton
            title="LOGIN"
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
            style={styles.loginButton}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text 
              style={styles.linkText}
              onPress={() => navigation.navigate('Signup')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: width > 400 ? 380 : width - 40,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: width > 400 ? 28 : 22,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 48,
  },
  loginButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 16,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  footer: {
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
  },
  linkText: {
    color: '#ffd700',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
});

export default LoginScreen;