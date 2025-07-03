import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressCircle } from './ProgressCircle';
import { colors } from '../constants/colors';
import { Level } from '../types';

interface LevelCardProps {
  level: Level;
  progress: number;
  isLocked: boolean;
  onPress: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  progress,
  isLocked,
  onPress
}) => {
  const getLevelColor = (levelId: number) => {
    switch (levelId) {
      case 1: return colors.gradients.level1;
      case 2: return colors.gradients.level2;
      case 3: return colors.gradients.level3;
      default: return colors.gradients.primary;
    }
  };

  const getProgressColor = (levelId: number) => {
    switch (levelId) {
      case 1: return colors.level1;
      case 2: return colors.level2;
      case 3: return colors.level3;
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isLocked && styles.lockedContainer]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isLocked ? [colors.gray300, colors.gray400] : getLevelColor(level.id)}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.levelTitle, isLocked && styles.lockedText]}>
                {level.name}
              </Text>
              <Text style={[styles.levelDescription, isLocked && styles.lockedText]}>
                {level.description}
              </Text>
            </View>
            <ProgressCircle
              progress={isLocked ? 0 : progress}
              size={50}
              color={isLocked ? colors.gray500 : getProgressColor(level.id)}
              backgroundColor={colors.white + '30'}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.workoutCount, isLocked && styles.lockedText]}>
              {level.workoutDays.length} Workout Days
            </Text>
            <Text style={[styles.duration, isLocked && styles.lockedText]}>
              {level.requiredDaysToComplete} days to complete
            </Text>
          </View>
          
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockText}>Complete previous level to unlock</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lockedContainer: {
    opacity: 0.7,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
  },
  content: {
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: colors.white + 'DD',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutCount: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
    color: colors.white + 'CC',
  },
  lockedText: {
    color: colors.gray600,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white + '90',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});