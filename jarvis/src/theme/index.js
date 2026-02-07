import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Colors = {
  // Apple-inspired palette
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  secondary: '#5856D6',
  accent: '#AF52DE',

  // Backgrounds
  backgroundDark: '#000000',
  backgroundPrimary: '#1C1C1E',
  backgroundSecondary: '#2C2C2E',
  backgroundTertiary: '#3A3A3C',
  backgroundElevated: '#1C1C1E',

  // Glass
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassLight: 'rgba(255, 255, 255, 0.04)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textTertiary: 'rgba(255, 255, 255, 0.35)',

  // Semantic
  success: '#30D158',
  warning: '#FFD60A',
  error: '#FF453A',

  // Voice orb gradient
  orbGradient: ['#007AFF', '#5856D6', '#AF52DE'],
  orbGlow: 'rgba(0, 122, 255, 0.4)',
  orbActiveGlow: 'rgba(88, 86, 214, 0.6)',
};

export const Typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    color: Colors.textPrimary,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
    color: Colors.textPrimary,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
    color: Colors.textPrimary,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: Colors.textPrimary,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
    color: Colors.textPrimary,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
    color: Colors.textPrimary,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    color: Colors.textSecondary,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
    color: Colors.textTertiary,
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textTertiary,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.07,
    color: Colors.textTertiary,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Layout = {
  screenWidth: width,
  screenHeight: height,
  isSmallDevice: width < 375,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color = Colors.orbGlow) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  }),
};
