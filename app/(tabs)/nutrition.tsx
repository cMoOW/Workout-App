import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';

export default function NutritionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.gradients.success}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Nutrition</Text>
        <Text style={styles.headerSubtitle}>Fuel your fitness journey</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.workInProgressCard}>
          <Text style={styles.workInProgressIcon}>🚧</Text>
          <Text style={styles.workInProgressTitle}>Work in Progress</Text>
          <Text style={styles.workInProgressSubtitle}>
            We're cooking up something amazing!
          </Text>
          <Text style={styles.workInProgressDescription}>
            Our nutrition tracking feature is currently in development. 
            Soon you'll be able to:
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>Track your daily calories and macros</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🥗</Text>
              <Text style={styles.featureText}>Log meals and snacks</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💧</Text>
              <Text style={styles.featureText}>Monitor water intake</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Set personalized nutrition goals</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Scan barcodes for easy logging</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notifyButton}>
            <Text style={styles.notifyButtonText}>Notify Me When Ready</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipTitle}>Nutrition Tip</Text>
          <Text style={styles.tipText}>
            "Proper nutrition is 80% of your fitness results. Stay hydrated and eat a balanced 
            diet with plenty of protein to support your workout recovery!"
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  content: {
    flex: 1,
    padding: 20,
  },
  workInProgressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workInProgressIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  workInProgressTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  workInProgressSubtitle: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  workInProgressDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  featuresList: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  notifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  notifyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: colors.warning + '10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  tipIcon: {
    fontSize: 24,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});