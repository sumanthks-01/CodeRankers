// Django-inspired Modern UI Theme
export const colors = {
  // Primary Colors - Django-matching palette
  primary: '#667eea',      // Django primary
  primaryDark: '#764ba2',  // Django secondary
  primaryLight: '#f093fb', // Django accent
  primaryGradient: ['#667eea', '#764ba2', '#f093fb', '#4facfe'], // Django gradient
  
  // Secondary Colors
  secondary: '#06B6D4',    // Cyan
  secondaryDark: '#0891B2', // Deep cyan
  secondaryLight: '#ECFEFF', // Soft cyan background
  
  // Accent Colors
  accent1: '#8B5CF6',      // Purple
  accent2: '#F59E0B',      // Amber
  accent3: '#EC4899',      // Pink
  accent4: '#10B981',      // Emerald
  
  // Status Colors
  success: '#10B981',      // Emerald
  successLight: '#D1FAE5', // Soft emerald
  warning: '#F59E0B',      // Amber
  warningLight: '#FEF3C7', // Soft amber
  error: '#EF4444',        // Red
  errorLight: '#FEE2E2',   // Soft red
  info: '#3B82F6',         // Blue
  infoLight: '#DBEAFE',    // Soft blue
  
  // Background Colors - Modern layered approach
  background: '#FAFBFC',   // Off-white background
  surface: '#FFFFFF',      // Pure white surface
  surfaceElevated: '#FFFFFF', // Elevated surface
  surfaceAlt: '#F8FAFC',   // Alternative surface
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  
  // Text Colors - Better contrast
  textPrimary: '#0F172A',  // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#94A3B8', // Slate 400
  textLight: '#CBD5E1',    // Slate 300
  textOnPrimary: '#FFFFFF', // White text
  textOnDark: '#F8FAFC',   // Light text on dark
  
  // Border Colors
  border: '#E2E8F0',       // Slate 200
  borderLight: '#F1F5F9',  // Slate 100
  borderFocus: '#6366F1',  // Primary focus border
  
  // Food category colors
  breakfast: '#F59E0B',    // Amber
  lunch: '#10B981',        // Emerald
  snacks: '#8B5CF6',       // Purple
  dinner: '#EF4444',       // Red
};

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive dimensions
export const dimensions = {
  width,
  height,
  isSmallScreen: width < 375,
  isMediumScreen: width >= 375 && width < 768,
  isLargeScreen: width >= 768,
};

// Responsive spacing
export const spacing = {
  xs: dimensions.isSmallScreen ? 3 : 4,
  sm: dimensions.isSmallScreen ? 6 : 8,
  md: dimensions.isSmallScreen ? 12 : 16,
  lg: dimensions.isSmallScreen ? 18 : 24,
  xl: dimensions.isSmallScreen ? 24 : 32,
};

// Responsive border radius
export const borderRadius = {
  sm: 4,
  md: dimensions.isSmallScreen ? 6 : 8,
  lg: dimensions.isSmallScreen ? 8 : 12,
  xl: dimensions.isSmallScreen ? 12 : 16,
};

// Responsive typography
export const typography = {
  h1: {
    fontSize: dimensions.isSmallScreen ? 24 : dimensions.isMediumScreen ? 28 : 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: dimensions.isSmallScreen ? 20 : dimensions.isMediumScreen ? 24 : 28,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: dimensions.isSmallScreen ? 18 : dimensions.isMediumScreen ? 20 : 24,
    fontWeight: '600',
  },
  body: {
    fontSize: dimensions.isSmallScreen ? 14 : 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: dimensions.isSmallScreen ? 12 : 14,
    fontWeight: '400',
  },
};

// Enhanced shadows with depth
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Layout constants
export const layout = {
  headerHeight: 60,
  tabBarHeight: 80,
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 80,
};