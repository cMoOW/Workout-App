import { useCallback } from 'react';
import { UserProgress, WorkoutSession } from '../types';
import { useAsyncStorage } from './useAsyncStorage';
import { DEFAULT_USER_PROGRESS } from '../constants/workouts';

export function useWorkoutProgress() {
  const { 
    value: userProgress, 
    setValue: setUserProgress, 
    loading 
  } = useAsyncStorage<UserProgress>('userProgress', DEFAULT_USER_PROGRESS);

  const completeWorkout = useCallback(async (
    levelId: number,
    dayId: string,
    completedExercises: string[]
  ) => {
    const completedAt = new Date().toISOString();
    
    await setUserProgress(prev => {
      const newCompletedWorkouts = [...prev.completedWorkouts, {
        levelId,
        dayId,
        completedAt,
        exercises: completedExercises.map(exerciseId => ({
          exerciseId,
          completed: true,
          actualSets: 3, // Default values - can be made dynamic
          actualReps: 10
        }))
      }];

      // Calculate new streak
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const lastWorkoutDate = prev.completedWorkouts.length > 0 
        ? new Date(prev.completedWorkouts[prev.completedWorkouts.length - 1].completedAt).toDateString()
        : null;

      let newStreak = prev.currentStreak;
      if (lastWorkoutDate === yesterday || lastWorkoutDate === today) {
        newStreak = prev.currentStreak + 1;
      } else if (lastWorkoutDate !== today) {
        newStreak = 1;
      }

      return {
        ...prev,
        completedWorkouts: newCompletedWorkouts,
        totalWorkoutsCompleted: prev.totalWorkoutsCompleted + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak)
      };
    });
  }, [setUserProgress]);

  const resetProgress = useCallback(async () => {
    await setUserProgress(DEFAULT_USER_PROGRESS);
  }, [setUserProgress]);

  const updateCurrentLevel = useCallback(async (newLevel: number) => {
    await setUserProgress(prev => ({
      ...prev,
      currentLevel: newLevel
    }));
  }, [setUserProgress]);

  return {
    userProgress,
    loading,
    completeWorkout,
    resetProgress,
    updateCurrentLevel
  };
}