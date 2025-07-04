import { UserProgress, Level } from '../types';

export const calculateLevelProgress = (
  userProgress: UserProgress,
  level: Level
): number => {
  const completedWorkoutsForLevel = userProgress.completedWorkouts.filter(
    workout => workout.levelId === level.id
  );
  
  // Count unique workout days completed for this level
  const uniqueCompletedDays = new Set(completedWorkoutsForLevel.map(workout => workout.dayId)).size;
  
  const progress = Math.min((uniqueCompletedDays / level.requiredDaysToComplete) * 100, 100);
  
  console.log(`Level ${level.id} progress:`, {
    completedWorkouts: completedWorkoutsForLevel.length,
    uniqueCompletedDays,
    requiredDays: level.requiredDaysToComplete,
    progress
  });
  
  return progress;
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
  console.log(`Level ${levelId} unlock check:`, {
    previousLevelId: previousLevel.id,
    previousLevelProgress,
    required: 80,
    unlocked: previousLevelProgress >= 80
  });
  
  return previousLevelProgress >= 80; // Need 80% completion to unlock next level
};

export const getNextWorkoutForLevel = (levelId: number, userProgress: UserProgress, level: Level) => {
  const completedWorkoutsForLevel = userProgress.completedWorkouts.filter(
    workout => workout.levelId === levelId
  );
  
  // Get unique completed workout day IDs 
  const completedDayIds = new Set(completedWorkoutsForLevel.map(workout => workout.dayId));
  
  console.log(`Level ${levelId} completed day IDs:`, Array.from(completedDayIds));
  console.log(`Total available workout days:`, level.workoutDays.length);
  
  // Find the first workout day that hasn't been completed
  const nextUncompletedWorkout = level.workoutDays.find(day => !completedDayIds.has(day.id));
  
  if (nextUncompletedWorkout) {
    console.log(`Next uncompleted workout: ${nextUncompletedWorkout.name}`);
    return nextUncompletedWorkout;
  }
  
  // If all workouts are completed, show the first one (it will be marked as completed)
  console.log(`All workouts completed for level ${levelId}, showing first workout as completed`);
  return level.workoutDays[0];
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