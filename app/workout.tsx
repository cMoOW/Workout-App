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
import { useWorkoutProgress } from './hooks/useWorkoutProgress';
import { getNextWorkoutForLevel, formatDuration } from './utils/workoutCalculations';

export default function WorkoutScreen() {
  const router = useRouter();
  const { levelId } = useLocalSearchParams();
  const { userProgress, completeWorkout } = useWorkoutProgress();
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

  const handleExerciseToggle = (exerciseId: string) => {
    if (!isWorkoutStarted) {
      setIsWorkoutStarted(true);
      setWorkoutStartTime(new Date());
    }

    setCompletedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const handleCompleteWorkout = async () => {
    if (completedExercises.length === 0) {
      Alert.alert('No exercises completed', 'Please complete at least one exercise before finishing.');
      return;
    }

    const completionPercentage = (completedExercises.length / nextWorkout.exercises.length) * 100;
    
    Alert.alert(
      'Complete Workout?',
      `You've completed ${completedExercises.length} out of ${nextWorkout.exercises.length} exercises (${Math.round(completionPercentage)}%).\n\nAre you sure you want to finish this workout?`,
      [
        { text: 'Continue Workout', style: 'cancel' },
        { 
          text: 'Complete Workout', 
          onPress: async () => {
            await completeWorkout(currentLevelId, nextWorkout.id, completedExercises);
            Alert.alert(
              'Great job! 🎉',
              `Workout completed! You finished ${completedExercises.length} exercises.`,
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  };

  const getLevelColor = (levelId: number) => {
    switch (levelId) {
      case 1: return colors.gradients.level1;
      case 2: return colors.gradients.level2;
      case 3: return colors.gradients.level3;
      default: return colors.gradients.primary;
    }
  };

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
        colors={getLevelColor(currentLevelId)}
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
          <Text style={styles.sectionTitle}>Exercises</Text>
          <Text style={styles.sectionSubtitle}>
            Tap each exercise when you complete it
          </Text>
          
          {nextWorkout.exercises.map((exercise) => (
            <WorkoutItem
              key={exercise.id}
              exercise={exercise}
              isCompleted={completedExercises.includes(exercise.id)}
              onToggle={() => handleExerciseToggle(exercise.id)}
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
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
});