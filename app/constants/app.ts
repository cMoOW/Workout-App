/**
 * Application-wide constants
 * Centralizes configuration to avoid magic numbers and improve maintainability
 */

// UI Constants
export const UI_CONSTANTS = {
  // Progress thresholds
  LEVEL_UNLOCK_THRESHOLD: 80, // Percentage needed to unlock next level
  
  // Animation durations (ms)
  ANIMATION_DURATION_SHORT: 200,
  ANIMATION_DURATION_MEDIUM: 300,
  ANIMATION_DURATION_LONG: 500,
  
  // Component sizes
  PROGRESS_CIRCLE_SIZE_SMALL: 50,
  PROGRESS_CIRCLE_SIZE_MEDIUM: 80,
  PROGRESS_CIRCLE_SIZE_LARGE: 120,
  
  // Workout timer
  WORKOUT_TIMER_INTERVAL: 1000, // 1 second
  
  // Input limits
  MAX_EXERCISE_NAME_LENGTH: 100,
  MAX_WORKOUT_NAME_LENGTH: 50,
} as const;

// Workout Constants
export const WORKOUT_CONSTANTS = {
  // Default exercise values
  DEFAULT_SETS: 3,
  DEFAULT_REPS: 10,
  
  // Time calculations
  MINUTES_PER_HOUR: 60,
  MS_PER_MINUTE: 60000,
  MS_PER_DAY: 86400000,
  
  // Progress calculations
  MAX_PROGRESS_PERCENTAGE: 100,
  MIN_PROGRESS_PERCENTAGE: 0,
} as const;

// App Metadata
export const APP_INFO = {
  NAME: 'LevelUpFitness',
  VERSION: '1.0.0',
  DESCRIPTION: 'Progressive fitness training app',
} as const;

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  USER_PROGRESS: 'userProgress',
  USER_PROFILE: 'userProfile',
  APP_SETTINGS: 'appSettings',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;