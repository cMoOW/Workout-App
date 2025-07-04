import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressCircle } from '../components/ProgressCircle';
import { colors } from '../constants/colors';
import { WORKOUT_LEVELS } from '../constants/workouts';
import { useWorkoutProgressContext } from '../context/WorkoutProgressContext';
import { 
  calculateLevelProgress, 
  calculateOverallProgress,
  formatDuration,
  getStreakMessage 
} from '../utils/workoutCalculations';

export default function ProgressScreen() {
  const { userProgress, loading } = useWorkoutProgressContext();

  // Debug: Log when userProgress changes
  useEffect(() => {
    console.log('Progress screen - userProgress updated:', userProgress);
  }, [userProgress]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const overallProgress = calculateOverallProgress(userProgress, WORKOUT_LEVELS);
  const recentWorkouts = userProgress.completedWorkouts
    .slice(-5)
    .reverse();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.gradients.success}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Progress</Text>
          <View style={styles.progressContainer}>
            <ProgressCircle
              progress={overallProgress}
              size={120}
              color={colors.success}
              showPercentage={true}
            />
            <View style={styles.progressDetails}>
              <Text style={styles.progressText}>
                {userProgress.totalWorkoutsCompleted} workouts completed
              </Text>
              <Text style={styles.progressSubtext}>
                Keep going! You're doing great! 💪
              </Text>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          {WORKOUT_LEVELS.map((level) => {
            const levelProgress = calculateLevelProgress(userProgress, level);
            const isCurrentLevel = level.id === userProgress.currentLevel;
            
            return (
              <View key={level.id} style={styles.levelProgressItem}>
                <View style={styles.levelProgressHeader}>
                  <Text style={[styles.levelName, isCurrentLevel && styles.currentLevelName]}>
                    {level.name}
                    {isCurrentLevel && ' (Current)'}
                  </Text>
                  <Text style={styles.levelProgressPercent}>
                    {Math.round(levelProgress)}%
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${levelProgress}%`,
                        backgroundColor: isCurrentLevel ? colors.primary : colors.success
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.levelProgressText}>
                  {userProgress.completedWorkouts.filter(w => w.levelId === level.id).length} / {level.requiredDaysToComplete} workouts
                </Text>
              </View>
            );
          })}
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statNumber}>{userProgress.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statNumber}>{userProgress.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statNumber}>{userProgress.currentLevel}</Text>
              <Text style={styles.statLabel}>Current Level</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💪</Text>
              <Text style={styles.statNumber}>{userProgress.totalWorkoutsCompleted}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🏃‍♂️</Text>
              <Text style={styles.emptyStateText}>No workouts yet</Text>
              <Text style={styles.emptyStateSubtext}>Start your first workout to see your progress here!</Text>
            </View>
          ) : (
            recentWorkouts.map((workout, index) => {
              const level = WORKOUT_LEVELS.find(l => l.id === workout.levelId);
              const workoutDay = level?.workoutDays.find(d => d.id === workout.dayId);
              
              return (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Text style={styles.activityIconText}>✅</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {workoutDay?.name || 'Workout'}
                    </Text>
                    <Text style={styles.activitySubtitle}>
                      {level?.name} • {workout.exercises.length} exercises completed
                    </Text>
                    <Text style={styles.activityDate}>
                      {new Date(workout.completedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Motivation */}
        <View style={styles.section}>
          <View style={styles.motivationCard}>
            <Text style={styles.motivationIcon}>🎯</Text>
            <Text style={styles.motivationText}>
              {getStreakMessage(userProgress.currentStreak)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white + 'DD',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  progressDetails: {
    marginLeft: 24,
    flex: 1,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  levelProgressItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  levelProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  currentLevelName: {
    color: colors.primary,
  },
  levelProgressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  motivationCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  motivationIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
});