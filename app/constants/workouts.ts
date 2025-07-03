import { Level, WorkoutExercise } from '../types';

// Exercise database
const exercises: Record<string, WorkoutExercise> = {
  // Upper Body
  pushups: {
    id: 'pushups',
    name: 'Push-ups',
    sets: 3,
    reps: '8-12',
    description: 'Start in plank position, lower chest to ground, push back up',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core']
  },
  inclinePushups: {
    id: 'inclinePushups',
    name: 'Incline Push-ups',
    sets: 3,
    reps: '10-15',
    description: 'Hands on elevated surface, perform push-up motion',
    muscleGroups: ['chest', 'shoulders', 'triceps']
  },
  pike_pushups: {
    id: 'pike_pushups',
    name: 'Pike Push-ups',
    sets: 3,
    reps: '6-10',
    description: 'Feet elevated, hands on ground, push-up in pike position',
    muscleGroups: ['shoulders', 'triceps', 'upper chest']
  },
  tricep_dips: {
    id: 'tricep_dips',
    name: 'Tricep Dips',
    sets: 3,
    reps: '8-12',
    description: 'Using chair/bench, lower body by bending arms, push back up',
    muscleGroups: ['triceps', 'shoulders', 'chest']
  },
  
  // Lower Body
  squats: {
    id: 'squats',
    name: 'Bodyweight Squats',
    sets: 3,
    reps: '12-20',
    description: 'Feet shoulder-width apart, lower hips back and down, return to standing',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'calves']
  },
  lunges: {
    id: 'lunges',
    name: 'Forward Lunges',
    sets: 3,
    reps: '10 each leg',
    description: 'Step forward, lower hips until both knees at 90°, return to start',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'calves']
  },
  jump_squats: {
    id: 'jump_squats',
    name: 'Jump Squats',
    sets: 3,
    reps: '8-15',
    description: 'Perform squat, explode up into jump, land softly',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'calves', 'core']
  },
  single_leg_glute_bridge: {
    id: 'single_leg_glute_bridge',
    name: 'Single-leg Glute Bridge',
    sets: 3,
    reps: '8-12 each leg',
    description: 'Lying on back, one foot on ground, lift hips with one leg',
    muscleGroups: ['glutes', 'hamstrings', 'core']
  },
  
  // Core
  plank: {
    id: 'plank',
    name: 'Plank',
    sets: 3,
    reps: '30-60 seconds',
    description: 'Hold straight line from head to heels, forearms on ground',
    muscleGroups: ['core', 'shoulders', 'glutes']
  },
  mountain_climbers: {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    sets: 3,
    reps: '20 total',
    description: 'Plank position, alternate bringing knees to chest rapidly',
    muscleGroups: ['core', 'shoulders', 'legs', 'cardio']
  },
  bicycle_crunches: {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    sets: 3,
    reps: '15 each side',
    description: 'Lying on back, alternate elbow to opposite knee motion',
    muscleGroups: ['core', 'obliques']
  },
  dead_bug: {
    id: 'dead_bug',
    name: 'Dead Bug',
    sets: 3,
    reps: '8-10 each side',
    description: 'On back, opposite arm and leg extensions while keeping core stable',
    muscleGroups: ['core', 'hip flexors']
  },
  
  // Full Body/Cardio
  burpees: {
    id: 'burpees',
    name: 'Burpees',
    sets: 3,
    reps: '5-10',
    description: 'Squat, jump back to plank, push-up, jump forward, jump up',
    muscleGroups: ['full body', 'cardio']
  },
  jumping_jacks: {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    sets: 3,
    reps: '20-30',
    description: 'Jump feet apart while raising arms overhead, return to start',
    muscleGroups: ['legs', 'shoulders', 'cardio']
  },
  high_knees: {
    id: 'high_knees',
    name: 'High Knees',
    sets: 3,
    reps: '30 seconds',
    description: 'Run in place bringing knees up to hip level',
    muscleGroups: ['legs', 'core', 'cardio']
  }
};

// Workout levels
export const WORKOUT_LEVELS: Level[] = [
  {
    id: 1,
    name: 'Level 1: Foundation',
    description: 'Build basic strength and establish workout habits',
    requiredDaysToComplete: 12,
    workoutDays: [
      {
        id: 'level1_day1',
        name: 'Upper Body Basics',
        estimatedDuration: 20,
        exercises: [
          exercises.inclinePushups,
          exercises.tricep_dips,
          exercises.plank,
          exercises.mountain_climbers
        ]
      },
      {
        id: 'level1_day2',
        name: 'Lower Body Foundation',
        estimatedDuration: 25,
        exercises: [
          exercises.squats,
          exercises.lunges,
          exercises.single_leg_glute_bridge,
          exercises.jumping_jacks
        ]
      },
      {
        id: 'level1_day3',
        name: 'Core & Cardio',
        estimatedDuration: 20,
        exercises: [
          exercises.plank,
          exercises.dead_bug,
          exercises.bicycle_crunches,
          exercises.high_knees
        ]
      },
      {
        id: 'level1_day4',
        name: 'Full Body Intro',
        estimatedDuration: 25,
        exercises: [
          exercises.inclinePushups,
          exercises.squats,
          exercises.plank,
          exercises.jumping_jacks
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Level 2: Strength Builder',
    description: 'Increase intensity and add more challenging exercises',
    requiredDaysToComplete: 16,
    workoutDays: [
      {
        id: 'level2_day1',
        name: 'Upper Body Power',
        estimatedDuration: 30,
        exercises: [
          exercises.pushups,
          exercises.pike_pushups,
          exercises.tricep_dips,
          exercises.mountain_climbers
        ]
      },
      {
        id: 'level2_day2',
        name: 'Lower Body Strength',
        estimatedDuration: 30,
        exercises: [
          exercises.squats,
          exercises.jump_squats,
          exercises.lunges,
          exercises.single_leg_glute_bridge
        ]
      },
      {
        id: 'level2_day3',
        name: 'Core Intensive',
        estimatedDuration: 25,
        exercises: [
          exercises.plank,
          exercises.bicycle_crunches,
          exercises.mountain_climbers,
          exercises.dead_bug
        ]
      },
      {
        id: 'level2_day4',
        name: 'HIIT Cardio',
        estimatedDuration: 25,
        exercises: [
          exercises.burpees,
          exercises.jump_squats,
          exercises.high_knees,
          exercises.jumping_jacks
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Level 3: Elite Performance',
    description: 'Advanced movements and high-intensity training',
    requiredDaysToComplete: 20,
    workoutDays: [
      {
        id: 'level3_day1',
        name: 'Advanced Upper Body',
        estimatedDuration: 35,
        exercises: [
          exercises.pushups,
          exercises.pike_pushups,
          exercises.tricep_dips,
          exercises.burpees
        ]
      },
      {
        id: 'level3_day2',
        name: 'Explosive Lower Body',
        estimatedDuration: 35,
        exercises: [
          exercises.jump_squats,
          exercises.lunges,
          exercises.single_leg_glute_bridge,
          exercises.high_knees
        ]
      },
      {
        id: 'level3_day3',
        name: 'Core Mastery',
        estimatedDuration: 30,
        exercises: [
          exercises.plank,
          exercises.mountain_climbers,
          exercises.bicycle_crunches,
          exercises.dead_bug
        ]
      },
      {
        id: 'level3_day4',
        name: 'Ultimate HIIT',
        estimatedDuration: 35,
        exercises: [
          exercises.burpees,
          exercises.jump_squats,
          exercises.pushups,
          exercises.mountain_climbers
        ]
      },
      {
        id: 'level3_day5',
        name: 'Full Body Challenge',
        estimatedDuration: 40,
        exercises: [
          exercises.burpees,
          exercises.pushups,
          exercises.jump_squats,
          exercises.plank,
          exercises.mountain_climbers
        ]
      }
    ]
  }
];

// Default user progress
export const DEFAULT_USER_PROGRESS = {
  currentLevel: 1,
  completedWorkouts: [],
  totalWorkoutsCompleted: 0,
  currentStreak: 0,
  longestStreak: 0
};

// Default user profile
export const DEFAULT_USER_PROFILE = {
  id: 'user_1',
  name: 'NEWB',
  joinedDate: new Date().toISOString(),
  preferences: {
    preferredWorkoutDuration: 30
  }
};