import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows, dimensions, typography, animations, layout } from '../theme/colors';

// Enhanced Button Component
export const SimpleButton = ({ 
  title, 
  onPress, 
  style, 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false
}) => {
  const getButtonColors = () => {
    switch (variant) {
      case 'secondary': return [colors.secondary, colors.secondaryDark];
      case 'success': return [colors.success, colors.success];
      case 'error': return [colors.error, colors.error];
      case 'outline': return ['transparent', 'transparent'];
      case 'ghost': return ['transparent', 'transparent'];
      default: return ['#667eea', '#764ba2'];
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small': return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'large': return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default: return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const isGradient = variant === 'primary' || variant === 'secondary';
  
  const buttonProps = isGradient ? {
    colors: getButtonColors(),
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
  } : {};

  if (isGradient) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        style={[
          styles.buttonContainer,
          getButtonSize(),
          disabled && styles.buttonDisabled,
          style
        ]}
        activeOpacity={0.8}
      >
        <LinearGradient
          {...buttonProps}
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            {icon && <View style={styles.buttonIcon}>{icon}</View>}
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[
        styles.buttonContainer,
        getButtonSize(),
        variant === 'outline' && styles.buttonOutline,
        variant === 'ghost' && { backgroundColor: 'transparent' },
        variant === 'success' && { backgroundColor: colors.success },
        variant === 'error' && { backgroundColor: colors.error },
        disabled && styles.buttonDisabled,
        style
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.buttonIcon}>{icon}</View>}
        <Text style={[
          styles.buttonText,
          variant === 'outline' && { color: colors.primary },
          variant === 'ghost' && { color: colors.textSecondary }
        ]}>
          {loading ? 'Loading...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Enhanced Card Component
export const SimpleCard = ({ 
  children, 
  style, 
  onPress, 
  selected = false, 
  elevated = false,
  category
}) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'breakfast': return colors.breakfast;
      case 'lunch': return colors.lunch;
      case 'snacks': return colors.snacks;
      case 'dinner': return colors.dinner;
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.card, 
        elevated && shadows.card,
        selected && styles.selectedCard,
        category && { borderLeftWidth: 4, borderLeftColor: getCategoryColor() },
        style
      ]}
      activeOpacity={onPress ? 0.95 : 1}
    >
      {children}
    </TouchableOpacity>
  );
};

// Enhanced Input Component
export const SimpleInput = ({
  placeholder,
  value,
  onChangeText,
  style,
  error,
  label,
  icon,
  ...props
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <TextInput
          style={[styles.input, icon && { paddingLeft: spacing.xl }]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Badge Component
export const Badge = ({ text, variant = 'primary', size = 'medium' }) => {
  const getBadgeColor = () => {
    switch (variant) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'info': return colors.info;
      default: return colors.primary;
    }
  };

  return (
    <View style={[
      styles.badge,
      { backgroundColor: getBadgeColor() },
      size === 'small' && styles.badgeSmall
    ]}>
      <Text style={[
        styles.badgeText,
        size === 'small' && styles.badgeTextSmall
      ]}>
        {text}
      </Text>
    </View>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'medium', color = colors.primary }) => {
  const spinValue = new Animated.Value(0);
  
  React.useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[
      styles.spinner,
      { transform: [{ rotate }] },
      size === 'small' && styles.spinnerSmall,
      size === 'large' && styles.spinnerLarge,
      { borderTopColor: color }
    ]} />
  );
};

// Header Component
export const Header = ({ title, subtitle, onBack, actions }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.headerBack}>
            <Text style={styles.headerBackText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
        {actions && <View style={styles.headerActions}>{actions}</View>}
      </View>
    </View>
  );
};

// Section Header Component
export const SectionHeader = ({ title, action, icon }) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        {icon && <View style={styles.sectionIcon}>{icon}</View>}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action && action}
    </View>
  );
};

const styles = StyleSheet.create({
  // Button Styles
  buttonContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textOnPrimary,
    ...typography.body,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Card Styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: layout.cardMinHeight,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.medium,
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    minHeight: layout.inputHeight,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  
  // Badge Styles
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  badgeTextSmall: {
    fontSize: 10,
  },
  
  // Spinner Styles
  spinner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderTopColor: colors.primary,
    borderRadius: 12,
  },
  spinnerSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  spinnerLarge: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  
  // Header Styles
  header: {
    backgroundColor: colors.surface,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    ...shadows.small,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.headerHeight - spacing.lg - spacing.md,
  },
  headerBack: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  headerBackText: {
    fontSize: 24,
    color: colors.primary,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
});