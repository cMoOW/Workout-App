import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProgress } from '../types';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { DEFAULT_USER_PROGRESS, WORKOUT_LEVELS } from '../constants/workouts';
import { calculateLevelProgress } from '../utils/workoutCalculations';
import { logger } from '../utils/logger';
import { UI_CONSTANTS, WORKOUT_CONSTANTS } from '../constants/app';

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
    logger.progress('Starting workout completion', { levelId, dayId, exerciseCount: completedExercises.length });
    
    const completedAt = new Date().toISOString();
    
    try {
      setUserProgress(prev => {
        // Check if this workout already exists
        const existingWorkoutIndex = prev.completedWorkouts.findIndex(
          workout => workout.levelId === levelId && workout.dayId === dayId
        );
        
        if (existingWorkoutIndex >= 0) {
          logger.warn('Attempted to complete already completed workout');
          return prev; // Return unchanged state
        }
        
        // Add new workout
        const newCompletedWorkouts = [...prev.completedWorkouts, {
          levelId,
          dayId,
          completedAt,
          exercises: completedExercises.map(exerciseId => ({
            exerciseId,
            completed: true,
            actualSets: WORKOUT_CONSTANTS.DEFAULT_SETS,
            actualReps: WORKOUT_CONSTANTS.DEFAULT_REPS
          }))
        }];

        // Calculate new streak
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - WORKOUT_CONSTANTS.MS_PER_DAY).toDateString();
        const lastWorkoutDate = prev.completedWorkouts.length > 0 
          ? new Date(prev.completedWorkouts[prev.completedWorkouts.length - 1].completedAt).toDateString()
          : null;

        let newStreak = prev.currentStreak;
        if (lastWorkoutDate === yesterday || lastWorkoutDate === today) {
          newStreak = prev.currentStreak + 1;
        } else if (lastWorkoutDate !== today) {
          newStreak = 1;
        }

        // Calculate current level based on completed workouts
        let newCurrentLevel = prev.currentLevel;
        const tempProgress = {
          ...prev,
          completedWorkouts: newCompletedWorkouts,
          totalWorkoutsCompleted: prev.totalWorkoutsCompleted + 1
        };
        
        for (let i = 0; i < WORKOUT_LEVELS.length; i++) {
          const level = WORKOUT_LEVELS[i];
          const levelProgress = calculateLevelProgress(tempProgress, level);
          
                     if (levelProgress >= UI_CONSTANTS.LEVEL_UNLOCK_THRESHOLD && i + 1 < WORKOUT_LEVELS.length) {
            newCurrentLevel = Math.max(newCurrentLevel, level.id + 1);
            logger.progress(`Level ${level.id + 1} unlocked!`, { progress: levelProgress });
          }
        }

        const updatedProgress = {
          ...prev,
          completedWorkouts: newCompletedWorkouts,
          totalWorkoutsCompleted: prev.totalWorkoutsCompleted + 1,
          currentStreak: newStreak,
          longestStreak: Math.max(prev.longestStreak, newStreak),
          currentLevel: newCurrentLevel
        };

        logger.progress('Workout completion successful', {
          newStreakCount: newStreak,
          totalWorkouts: updatedProgress.totalWorkoutsCompleted,
          currentLevel: newCurrentLevel
        });
        
        return updatedProgress;
      });
      
    } catch (error) {
      logger.error('Failed to complete workout in context', error);
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
