import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProgress } from '../types';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { DEFAULT_USER_PROGRESS, WORKOUT_LEVELS } from '../constants/workouts';
import { calculateLevelProgress } from '../utils/workoutCalculations';

interface WorkoutProgressContextType {
  userProgress: UserProgress;
  loading: boolean;
  completeWorkout: (levelId: number, dayId: string, completedExercises: string[]) => Promise<void>;
  resetProgress: () => Promise<void>;
  updateCurrentLevel: (newLevel: number) => Promise<void>;
  refreshProgress: () => void;
}

const WorkoutProgressContext = createContext<WorkoutProgressContextType | undefined>(undefined);

export function WorkoutProgressProvider({ children }: { children: React.ReactNode }) {
  const { 
    value: userProgress, 
    setValue: setUserProgress, 
    loading 
  } = useAsyncStorage<UserProgress>('userProgress', DEFAULT_USER_PROGRESS);

  const completeWorkout = async (
    levelId: number,
    dayId: string,
    completedExercises: string[]
  ) => {
    console.log('WorkoutProgressContext - Starting workout completion:', { levelId, dayId, completedExercises });
    console.log('WorkoutProgressContext - Current userProgress before update:', userProgress);
    
    const completedAt = new Date().toISOString();
    
    try {
      const updatedProgress = await new Promise<UserProgress>((resolve, reject) => {
        console.log('WorkoutProgressContext - Inside setUserProgress function');
        
        setUserProgress(prev => {
          console.log('WorkoutProgressContext - Previous progress state:', prev);
          
          // Check if this workout already exists
          const existingWorkoutIndex = prev.completedWorkouts.findIndex(
            workout => workout.levelId === levelId && workout.dayId === dayId
          );
          
          let newCompletedWorkouts;
          let totalWorkoutsIncrement = 0;
          
          if (existingWorkoutIndex >= 0) {
            // Don't allow re-completing the same workout day
            console.log('Workout already completed - ignoring duplicate completion');
            resolve(prev); // Return unchanged state
            return prev;
          } else {
            // Add new workout
            newCompletedWorkouts = [...prev.completedWorkouts, {
              levelId,
              dayId,
              completedAt,
              exercises: completedExercises.map(exerciseId => ({
                exerciseId,
                completed: true,
                actualSets: 3,
                actualReps: 10
              }))
            }];
            totalWorkoutsIncrement = 1;
            console.log('Added new workout');
          }

          // Calculate new streak (only for new workouts)
          let newStreak = prev.currentStreak;
          if (totalWorkoutsIncrement > 0) {
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            const lastWorkoutDate = prev.completedWorkouts.length > 0 
              ? new Date(prev.completedWorkouts[prev.completedWorkouts.length - 1].completedAt).toDateString()
              : null;

            if (lastWorkoutDate === yesterday || lastWorkoutDate === today) {
              newStreak = prev.currentStreak + 1;
            } else if (lastWorkoutDate !== today) {
              newStreak = 1;
            }
          }

          // Calculate current level based on completed workouts
          let newCurrentLevel = 1;
          for (let i = 0; i < WORKOUT_LEVELS.length; i++) {
            const level = WORKOUT_LEVELS[i];
            const levelProgress = calculateLevelProgress({
              ...prev,
              completedWorkouts: newCompletedWorkouts,
              totalWorkoutsCompleted: prev.totalWorkoutsCompleted + totalWorkoutsIncrement
            }, level);
            
            console.log(`Level ${level.id} progress: ${levelProgress}%`);
            
            if (levelProgress >= 80 && i + 1 < WORKOUT_LEVELS.length) {
              newCurrentLevel = level.id + 1;
              console.log(`Level ${level.id + 1} unlocked!`);
            }
          }

          const updatedProgress = {
            ...prev,
            completedWorkouts: newCompletedWorkouts,
            totalWorkoutsCompleted: prev.totalWorkoutsCompleted + totalWorkoutsIncrement,
            currentStreak: newStreak,
            longestStreak: Math.max(prev.longestStreak, newStreak),
            currentLevel: Math.max(prev.currentLevel, newCurrentLevel)
          };

          console.log('WorkoutProgressContext - Previous progress:', prev);
          console.log('WorkoutProgressContext - Updated progress:', updatedProgress);
          console.log('WorkoutProgressContext - New completed workouts length:', newCompletedWorkouts.length);
          
          resolve(updatedProgress);
          return updatedProgress;
        });
      });

      console.log('WorkoutProgressContext - Workout completion finished successfully');
      
    } catch (error) {
      console.error('WorkoutProgressContext - Error in workout completion:', error);
      throw error;
    }
  };

  const resetProgress = async () => {
    await setUserProgress(DEFAULT_USER_PROGRESS);
  };

  const updateCurrentLevel = async (newLevel: number) => {
    await setUserProgress(prev => ({
      ...prev,
      currentLevel: newLevel
    }));
  };

  const refreshProgress = useCallback(() => {
    // Do nothing - components will re-render automatically when userProgress changes
  }, []);

  const value: WorkoutProgressContextType = {
    userProgress,
    loading,
    completeWorkout,
    resetProgress,
    updateCurrentLevel,
    refreshProgress
  };

  return (
    <WorkoutProgressContext.Provider value={value}>
      {children}
    </WorkoutProgressContext.Provider>
  );
}

export function useWorkoutProgressContext() {
  const context = useContext(WorkoutProgressContext);
  if (context === undefined) {
    throw new Error('useWorkoutProgressContext must be used within a WorkoutProgressProvider');
  }
  return context;
}
