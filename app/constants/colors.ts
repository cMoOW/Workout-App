export const colors = {
  // Primary colors
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5F3DC4',
  
  // Secondary colors
  secondary: '#00B894',
  secondaryLight: '#00CEC9',
  secondaryDark: '#00A085',
  
  // Level colors
  level1: '#74B9FF',
  level2: '#E17055',
  level3: '#6C5CE7',
  
  // Status colors
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#E17055',
  info: '#74B9FF',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#2D3436',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
  
  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  textOnPrimary: '#FFFFFF',
  
  // Gradient colors
  gradients: {
    primary: ['#6C5CE7', '#A29BFE'],
    level1: ['#74B9FF', '#0984E3'],
    level2: ['#E17055', '#D63031'],
    level3: ['#6C5CE7', '#A29BFE'],
    success: ['#00B894', '#00CEC9'],
  }
} as const;

export type ColorName = keyof typeof colors;