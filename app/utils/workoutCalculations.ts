import { UserProgress, Level } from '../types';

export const calculateLevelProgress = (
  userProgress: UserProgress,
  level: Level
): number => {
  const completedWorkoutsForLevel = userProgress.completedWorkouts.filter(
    workout => workout.levelId === level.id
  ).length;
  
  return Math.min((completedWorkoutsForLevel / level.requiredDaysToComplete) * 100, 100);
};

export const calculateOverallProgress = (
  userProgress: UserProgress,
  allLevels: Level[]
): number => {
  const totalRequiredWorkouts = allLevels.reduce(
    (sum, level) => sum + level.requiredDaysToComplete, 0
  );
  
  return Math.min((userProgress.totalWorkoutsCompleted / totalRequiredWorkouts) * 100, 100);
};

export const isLevelUnlocked = (levelId: number, userProgress: UserProgress, allLevels: Level[]): boolean => {
  if (levelId === 1) return true;
  
  const previousLevel = allLevels.find(level => level.id === levelId - 1);
  if (!previousLevel) return false;
  
  const previousLevelProgress = calculateLevelProgress(userProgress, previousLevel);
  return previousLevelProgress >= 80; // Need 80% completion to unlock next level
};

export const getNextWorkoutForLevel = (levelId: number, userProgress: UserProgress, level: Level) => {
  const completedWorkoutsForLevel = userProgress.completedWorkouts.filter(
    workout => workout.levelId === levelId
  );
  
  // Simple rotation through workout days
  const nextDayIndex = completedWorkoutsForLevel.length % level.workoutDays.length;
  return level.workoutDays[nextDayIndex];
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return "Start your fitness journey!";
  if (streak === 1) return "Great start! Keep it up!";
  if (streak < 7) return `${streak} days strong! 💪`;
  if (streak < 30) return `Amazing ${streak}-day streak! 🔥`;
  return `Incredible ${streak}-day streak! You're unstoppable! 🏆`;
};