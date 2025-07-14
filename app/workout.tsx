import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WorkoutItem } from './components/WorkoutItem';
import { colors } from './constants/colors';
import { WORKOUT_LEVELS } from './constants/workouts';
import { useWorkoutProgressContext } from './context/WorkoutProgressContext';
import { getNextWorkoutForLevel, formatDuration } from './utils/workoutCalculations';
import { getLevelGradientColors } from './utils/colorUtils';
import { logger } from './utils/logger';

export default function WorkoutScreen() {
  const router = useRouter();
  const { levelId } = useLocalSearchParams();
  const { userProgress, completeWorkout } = useWorkoutProgressContext();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  const currentLevelId = parseInt(levelId as string);
  const currentLevel = WORKOUT_LEVELS.find(level => level.id === currentLevelId);
  
  if (!currentLevel) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Level not found</Text>
      </SafeAreaView>
    );
  }

  const nextWorkout = getNextWorkoutForLevel(currentLevelId, userProgress, currentLevel);
  
  logger.workout('Loading workout screen', {
    currentLevelId,
    currentLevel: currentLevel?.name,
    nextWorkout: nextWorkout?.name,
    workoutId: nextWorkout?.id,
    exerciseCount: nextWorkout?.exercises?.length
  });
  
  // Check if this workout is already completed
  const isWorkoutAlreadyCompleted = userProgress.completedWorkouts.some(
    workout => workout.levelId === currentLevelId && workout.dayId === nextWorkout.id
  );

  // Load previously completed exercises for this specific workout (read-only if already completed)
  useEffect(() => {
    const existingWorkout = userProgress.completedWorkouts.find(
      workout => workout.levelId === currentLevelId && workout.dayId === nextWorkout.id
    );
    
    if (existingWorkout) {
      const previouslyCompletedExercises = existingWorkout.exercises
        .filter(ex => ex.completed)
        .map(ex => ex.exerciseId);
      setCompletedExercises(previouslyCompletedExercises);
      logger.workout('Loaded previously completed exercises', { count: previouslyCompletedExercises.length });
    }
  }, [currentLevelId, nextWorkout.id, userProgress.completedWorkouts]);

  const handleExerciseToggle = (exerciseId: string) => {
    logger.workout('Exercise toggle attempted', { exerciseId });
    
    // Prevent toggling if workout is already completed
    if (isWorkoutAlreadyCompleted) {
      logger.warn('Attempted to toggle completed workout');
      Alert.alert('Workout Completed', 'This workout has already been completed. You cannot modify it.');
      return;
    }
    
    if (!isWorkoutStarted) {
      logger.workout('Starting new workout session');
      setIsWorkoutStarted(true);
      setWorkoutStartTime(new Date());
    }

    setCompletedExercises(prev => {
      const wasCompleted = prev.includes(exerciseId);
      const newState = wasCompleted 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId];
      
      logger.workout(`Exercise ${wasCompleted ? 'unchecked' : 'completed'}`, { 
        exerciseId, 
        totalCompleted: newState.length 
      });
      
      return newState;
    });
  };

  const handleCompleteWorkout = async () => {
    logger.workout('Starting workout completion process', { 
      completedExercises: completedExercises.length,
      totalExercises: nextWorkout.exercises.length 
    });
    
    // Prevent completing if already completed
    if (isWorkoutAlreadyCompleted) {
      Alert.alert('Already Completed', 'This workout has already been completed.');
      return;
    }
    
    if (completedExercises.length === 0) {
      logger.warn('Attempted to complete workout with no exercises');
      Alert.alert('No exercises completed', 'Please complete at least one exercise before finishing.');
      return;
    }

    const completionPercentage = (completedExercises.length / nextWorkout.exercises.length) * 100;
    logger.workout('Workout completion statistics', { 
      completionPercentage: Math.round(completionPercentage),
      levelId: currentLevelId,
      dayId: nextWorkout.id 
    });
    
    try {
      await completeWorkout(currentLevelId, nextWorkout.id, completedExercises);
      logger.workout('Workout completed successfully, navigating to home');
      router.push('/(tabs)');
      
    } catch (error) {
      logger.error('Failed to complete workout', error);
      Alert.alert('Error', 'There was an error saving your workout. Please try again.');
    }
  };

  // Removed duplicate getLevelColor function - now using centralized utility

  const getWorkoutDuration = () => {
    if (!workoutStartTime) return '0min';
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - workoutStartTime.getTime()) / 60000);
    return formatDuration(diffInMinutes);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={getLevelGradientColors(currentLevelId)}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.levelTitle}>{currentLevel.name}</Text>
            <Text style={styles.workoutTitle}>{nextWorkout.name}</Text>
            <Text style={styles.workoutMeta}>
              {nextWorkout.exercises.length} exercises • ~{nextWorkout.estimatedDuration}min
            </Text>
          </View>
          
          {isWorkoutStarted && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Time</Text>
              <Text style={styles.timerText}>{getWorkoutDuration()}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(completedExercises.length / nextWorkout.exercises.length) * 100}%` }
            ]} 
          />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.exercisesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {isWorkoutAlreadyCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓ COMPLETED</Text>
              </View>
            )}
          </View>
          <Text style={styles.sectionSubtitle}>
            {isWorkoutAlreadyCompleted 
              ? "This workout has been completed"
              : "Tap each exercise when you complete it"
            }
          </Text>
          
          {nextWorkout.exercises.map((exercise) => (
            <WorkoutItem
              key={exercise.id}
              exercise={exercise}
              isCompleted={completedExercises.includes(exercise.id)}
              onToggle={() => handleExerciseToggle(exercise.id)}
              disabled={isWorkoutAlreadyCompleted}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <View style={styles.completionStats}>
          <Text style={styles.completionText}>
            {completedExercises.length} of {nextWorkout.exercises.length} exercises completed
          </Text>
        </View>
        
        {!isWorkoutAlreadyCompleted && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              completedExercises.length === 0 && styles.disabledButton
            ]}
            onPress={handleCompleteWorkout}
            disabled={completedExercises.length === 0}
          >
            <Text style={styles.completeButtonText}>
              Complete Workout
            </Text>
          </TouchableOpacity>
        )}
        
        {isWorkoutAlreadyCompleted && (
          <View style={styles.completedWorkoutMessage}>
            <Text style={styles.completedWorkoutText}>
              ✓ This workout has been completed!
            </Text>
            <TouchableOpacity
              style={styles.backToHomeButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.backToHomeButtonText}>
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
  },
  headerInfo: {
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    color: colors.white + 'DD',
    marginBottom: 4,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  workoutMeta: {
    fontSize: 14,
    color: colors.white + 'CC',
    textAlign: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 12,
    color: colors.white + 'DD',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.white + '30',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  exercisesSection: {
    marginBottom: 100, // Space for bottom section
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  completedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completionStats: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  completeButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray300,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  completedWorkoutMessage: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.success + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  completedWorkoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 12,
  },
  backToHomeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToHomeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});