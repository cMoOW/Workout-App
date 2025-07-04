// Test script to verify workout completion logic
const { calculateLevelProgress, isLevelUnlocked } = require('./app/utils/workoutCalculations');
const { WORKOUT_LEVELS, DEFAULT_USER_PROGRESS } = require('./app/constants/workouts');

console.log('Testing workout completion logic...');

// Simulate initial state
let userProgress = { ...DEFAULT_USER_PROGRESS };
console.log('Initial progress:', userProgress);

// Simulate completing workouts in Level 1
const level1 = WORKOUT_LEVELS.find(l => l.id === 1);
console.log('Level 1 requires', level1.requiredDaysToComplete, 'workouts to complete');

// Complete workouts one by one
for (let i = 0; i < level1.requiredDaysToComplete; i++) {
  userProgress.completedWorkouts.push({
    levelId: 1,
    dayId: `day${i + 1}`,
    completedAt: new Date().toISOString(),
    exercises: []
  });
  userProgress.totalWorkoutsCompleted++;
  
  const progress = calculateLevelProgress(userProgress, level1);
  const level2Unlocked = isLevelUnlocked(2, userProgress, WORKOUT_LEVELS);
  
  console.log(`After workout ${i + 1}:`);
  console.log(`  Level 1 progress: ${progress.toFixed(1)}%`);
  console.log(`  Level 2 unlocked: ${level2Unlocked}`);
  
  if (level2Unlocked) {
    console.log('🎉 Level 2 has been unlocked!');
    break;
  }
}
