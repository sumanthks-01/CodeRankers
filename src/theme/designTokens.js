// Design Tokens for Karmic Canteen App
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Design System Constants
export const designTokens = {
  // Breakpoints
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  },
  
  // Grid System
  grid: {
    columns: 12,
    gutter: 16,
    margin: 20,
  },
  
  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
  
  // Opacity Scale
  opacity: {
    disabled: 0.4,
    hover: 0.8,
    pressed: 0.6,
    overlay: 0.5,
  },
  
  // Transition Durations
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  
  // Component Sizes
  components: {
    button: {
      small: { height: 32, paddingX: 12, fontSize: 14 },
      medium: { height: 40, paddingX: 16, fontSize: 16 },
      large: { height: 48, paddingX: 20, fontSize: 18 },
    },
    input: {
      small: { height: 32, paddingX: 12, fontSize: 14 },
      medium: { height: 40, paddingX: 16, fontSize: 16 },
      large: { height: 48, paddingX: 20, fontSize: 18 },
    },
    avatar: {
      small: 24,
      medium: 32,
      large: 48,
      xlarge: 64,
    },
  },
  
  // Icon Sizes
  iconSizes: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Content Widths
  contentWidth: {
    mobile: width - 40,
    tablet: 600,
    desktop: 800,
    wide: 1200,
  },
};

// Utility Functions
export const getResponsiveValue = (mobile, tablet, desktop) => {
  if (width >= designTokens.breakpoints.desktop) return desktop || tablet || mobile;
  if (width >= designTokens.breakpoints.tablet) return tablet || mobile;
  return mobile;
};

export const isTablet = () => width >= designTokens.breakpoints.tablet;
export const isDesktop = () => width >= designTokens.breakpoints.desktop;
export const isMobile = () => width < designTokens.breakpoints.tablet;

// Theme Variants
export const themeVariants = {
  light: {
    name: 'light',
    isDark: false,
  },
  dark: {
    name: 'dark',
    isDark: true,
  },
};

// Component Variants
export const componentVariants = {
  button: {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    error: 'error',
    outline: 'outline',
    ghost: 'ghost',
    link: 'link',
  },
  
  card: {
    default: 'default',
    elevated: 'elevated',
    outlined: 'outlined',
    filled: 'filled',
  },
  
  badge: {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    neutral: 'neutral',
  },
};

export default designTokens;