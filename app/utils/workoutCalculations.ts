import { UserProgress, Level } from '../types';
import { UI_CONSTANTS, WORKOUT_CONSTANTS } from '../constants/app';

export const calculateLevelProgress = (
  userProgress: UserProgress,
  level: Level
): number => {
  const completedWorkoutsForLevel = userProgress.completedWorkouts.filter(
    workout => workout.levelId === level.id
  );
  
  // Count unique workout days completed for this level
  const uniqueCompletedDays = new Set(completedWorkoutsForLevel.map(workout => workout.dayId)).size;
  
  const progress = Math.min(
    (uniqueCompletedDays / level.requiredDaysToComplete) * WORKOUT_CONSTANTS.MAX_PROGRESS_PERCENTAGE, 
    WORKOUT_CONSTANTS.MAX_PROGRESS_PERCENTAGE
  );
  
  // Progress calculation completed - logging removed for production
  
  return progress;
};

export const calculateOverallProgress = (
  userProgress: UserProgress,
  allLevels: Level[]
): number => {
  const totalRequiredWorkouts = allLevels.reduce(
    (sum, level) => sum + level.requiredDaysToComplete, 0
  );
  
  return Math.min(
    (userProgress.totalWorkoutsCompleted / totalRequiredWorkouts) * WORKOUT_CONSTANTS.MAX_PROGRESS_PERCENTAGE, 
    WORKOUT_CONSTANTS.MAX_PROGRESS_PERCENTAGE
  );
};

export const isLevelUnlocked = (levelId: number, userProgress: UserProgress, allLevels: Level[]): boolean => {
  if (levelId === 1) return true;
  
  const previousLevel = allLevels.find(level => level.id === levelId - 1);
  if (!previousLevel) return false;
  
  const previousLevelProgress = calculateLevelProgress(userProgress, previousLevel);
  // Level unlock check completed
  
  return previousLevelProgress >= UI_CONSTANTS.LEVEL_UNLOCK_THRESHOLD;
};

export const getNextWorkoutForLevel = (levelId: number, userProgress: UserProgress, level: Level) => {
  const completedWorkoutsForLevel = userProgress.completedWorkouts.filter(
    workout => workout.levelId === levelId
  );
  
  // Get unique completed workout day IDs 
  const completedDayIds = new Set(completedWorkoutsForLevel.map(workout => workout.dayId));
  
  // Find the first workout day that hasn't been completed
  const nextUncompletedWorkout = level.workoutDays.find(day => !completedDayIds.has(day.id));
  
  if (nextUncompletedWorkout) {
    return nextUncompletedWorkout;
  }
  
  // If all workouts are completed, show the first one (it will be marked as completed)
  return level.workoutDays[0];
};

export const formatDuration = (minutes: number): string => {
  if (minutes < WORKOUT_CONSTANTS.MINUTES_PER_HOUR) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / WORKOUT_CONSTANTS.MINUTES_PER_HOUR);
  const remainingMinutes = minutes % WORKOUT_CONSTANTS.MINUTES_PER_HOUR;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return "Start your fitness journey!";
  if (streak === 1) return "Great start! Keep it up!";
  if (streak < 7) return `${streak} days strong! 💪`;
  if (streak < 30) return `Amazing ${streak}-day streak! 🔥`;
  return `Incredible ${streak}-day streak! You're unstoppable! 🏆`;
};