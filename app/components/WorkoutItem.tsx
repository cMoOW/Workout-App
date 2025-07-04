import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { WorkoutExercise } from '../types';

interface WorkoutItemProps {
  exercise: WorkoutExercise;
  isCompleted: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const WorkoutItem: React.FC<WorkoutItemProps> = ({
  exercise,
  isCompleted,
  onToggle,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        isCompleted && styles.completedContainer,
        disabled && styles.disabledContainer
      ]}
      onPress={disabled ? undefined : onToggle}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.exerciseName, isCompleted && styles.completedText]}>
            {exercise.name}
          </Text>
          <View style={[styles.checkbox, isCompleted && styles.completedCheckbox]}>
            {isCompleted && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>
        
        <Text style={[styles.description, isCompleted && styles.completedText]}>
          {exercise.description}
        </Text>
        
        <View style={styles.details}>
          <Text style={[styles.detailText, isCompleted && styles.completedText]}>
            {exercise.sets} sets × {exercise.reps}
          </Text>
          <View style={styles.muscleGroups}>
            {exercise.muscleGroups.slice(0, 2).map((muscle, index) => (
              <Text key={index} style={[styles.muscleTag, isCompleted && styles.completedTag]}>
                {muscle}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.gray200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  completedContainer: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '30',
  },
  disabledContainer: {
    backgroundColor: colors.gray100,
    borderColor: colors.gray200,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  completedText: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCheckbox: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  muscleGroups: {
    flexDirection: 'row',
    gap: 6,
  },
  muscleTag: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  completedTag: {
    backgroundColor: colors.success + '20',
    color: colors.success,
  },
});