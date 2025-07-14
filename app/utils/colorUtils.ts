import { colors } from '../constants/colors';

/**
 * Get gradient colors for a specific level
 * Centralizes level color logic to avoid duplication
 */
export const getLevelGradientColors = (levelId: number): string[] => {
  switch (levelId) {
    case 1: return colors.gradients.level1;
    case 2: return colors.gradients.level2;
    case 3: return colors.gradients.level3;
    default: return colors.gradients.primary;
  }
};

/**
 * Get solid color for a specific level
 * Used for progress indicators and accents
 */
export const getLevelColor = (levelId: number): string => {
  switch (levelId) {
    case 1: return colors.level1;
    case 2: return colors.level2;
    case 3: return colors.level3;
    default: return colors.primary;
  }
};

/**
 * Get appropriate text color for a given background color
 * Ensures proper contrast for accessibility
 */
export const getContrastTextColor = (backgroundColor: string): string => {
  // Simple implementation - could be enhanced with actual contrast calculation
  const darkColors = [colors.primaryDark, colors.gray800, colors.black];
  return darkColors.includes(backgroundColor) ? colors.white : colors.textPrimary;
};