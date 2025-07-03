export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // Can be "10-15" or "30 seconds"
  description: string;
  muscleGroups: string[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // in minutes
}

export interface Level {
  id: number;
  name: string;
  description: string;
  workoutDays: WorkoutDay[];
  requiredDaysToComplete: number;
}

export interface UserProgress {
  currentLevel: number;
  completedWorkouts: {
    levelId: number;
    dayId: string;
    completedAt: string;
    exercises: {
      exerciseId: string;
      completed: boolean;
      actualSets: number;
      actualReps: number;
    }[];
  }[];
  totalWorkoutsCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  profileImage?: string;
  joinedDate: string;
  preferences: {
    reminderTime?: string;
    preferredWorkoutDuration: number;
  };
}

export interface WorkoutSession {
  id: string;
  levelId: number;
  dayId: string;
  startTime: string;
  endTime?: string;
  completedExercises: string[];
  isCompleted: boolean;
}