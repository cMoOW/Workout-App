import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LevelCard } from '../components/LevelCard';
import { ProgressCircle } from '../components/ProgressCircle';
import { colors } from '../constants/colors';
import { WORKOUT_LEVELS } from '../constants/workouts';
import { useWorkoutProgressContext } from '../context/WorkoutProgressContext';
import { 
  calculateLevelProgress, 
  calculateOverallProgress, 
  isLevelUnlocked,
  getStreakMessage 
} from '../utils/workoutCalculations';

export default function HomeScreen() {
  const router = useRouter();
  const { userProgress, loading } = useWorkoutProgressContext();

  // Progress tracking effects - console logs removed for production

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

  const handleLevelPress = (levelId: number) => {
    if (isLevelUnlocked(levelId, userProgress, WORKOUT_LEVELS)) {
      router.push(`/workout?levelId=${levelId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.appTitle}>LevelUpFitness</Text>
            <Text style={styles.streakText}>
              {getStreakMessage(userProgress.currentStreak)}
            </Text>
          </View>
          
          <View style={styles.progressSection}>
            <ProgressCircle
              progress={overallProgress}
              size={80}
              color={colors.white}
              backgroundColor={colors.white + '30'}
            />
            <Text style={styles.progressLabel}>Overall Progress</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.levelsSection}>
          <Text style={styles.sectionTitle}>Training Levels</Text>
          <Text style={styles.sectionSubtitle}>
            Progress through each level to unlock new challenges
          </Text>
          
          {WORKOUT_LEVELS.map((level) => {
            const levelProgress = calculateLevelProgress(userProgress, level);
            const unlocked = isLevelUnlocked(level.id, userProgress, WORKOUT_LEVELS);
            
            return (
              <LevelCard
                key={level.id}
                level={level}
                progress={levelProgress}
                isLocked={!unlocked}
                onPress={() => handleLevelPress(level.id)}
              />
            );
          })}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.totalWorkoutsCompleted}</Text>
              <Text style={styles.statLabel}>Workouts Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.longestStreak}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.currentLevel}</Text>
              <Text style={styles.statLabel}>Current Level</Text>
            </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.white + 'DD',
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  streakText: {
    fontSize: 14,
    color: colors.white + 'CC',
  },
  progressSection: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: colors.white,
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  levelsSection: {
    marginBottom: 32,
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
    lineHeight: 18,
  },
  statsSection: {
    marginBottom: 32,
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
});