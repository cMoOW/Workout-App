import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileImagePicker } from '../components/ProfileImagePicker';
import { colors } from '../constants/colors';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { useWorkoutProgressContext } from '../context/WorkoutProgressContext';
import { DEFAULT_USER_PROFILE } from '../constants/workouts';
import { UserProfile } from '../types';

export default function ProfileScreen() {
  const { userProgress, resetProgress } = useWorkoutProgressContext();
  const { value: userProfile, setValue: setUserProfile } = useAsyncStorage<UserProfile>(
    'userProfile', 
    DEFAULT_USER_PROFILE
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);
  const [editedEmail, setEditedEmail] = useState(userProfile.email || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Debug: Log when userProgress changes
  useEffect(() => {
    console.log('Profile screen - userProgress updated:', userProgress);
  }, [userProgress]);

  const handleSaveProfile = async () => {
    if (editedName.trim() === '') {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    await setUserProfile(prev => ({
      ...prev,
      name: editedName.trim(),
      email: editedEmail.trim() || undefined,
    }));

    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedName(userProfile.name);
    setEditedEmail(userProfile.email || '');
    setIsEditing(false);
  };

  const handleImageSelected = async (imageUri: string) => {
    console.log('Profile screen - handleImageSelected called with:', imageUri);
    try {
      await setUserProfile(prev => ({
        ...prev,
        profileImage: imageUri,
      }));
      console.log('Profile image updated successfully');
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your workout progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            Alert.alert('Progress Reset', 'Your workout progress has been reset.');
          }
        }
      ]
    );
  };

  const getMemberSince = () => {
    const joinDate = new Date(userProfile.joinedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks === 1 ? '' : 's'}`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'}`;
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
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            <ProfileImagePicker
              currentImage={userProfile.profileImage}
              onImageSelected={handleImageSelected}
              size={120}
            />
            
            <View style={styles.profileInfo}>
              {isEditing ? (
                <View style={styles.editingContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.emailInput}
                    value={editedEmail}
                    onChangeText={setEditedEmail}
                    placeholder="Enter your email (optional)"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity 
                      style={[styles.editButton, styles.cancelButton]}
                      onPress={handleCancelEdit}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.editButton, styles.saveButton]}
                      onPress={handleSaveProfile}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.displayContainer}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                  {userProfile.email && (
                    <Text style={styles.userEmail}>{userProfile.email}</Text>
                  )}
                  <Text style={styles.memberSince}>
                    Member for {getMemberSince()}
                  </Text>
                  <TouchableOpacity 
                    style={styles.editProfileButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProgress.totalWorkoutsCompleted}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProgress.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProgress.currentLevel}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProgress.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Workout Reminders</Text>
              <Text style={styles.settingSubtitle}>Get notified to stay on track</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary + '50' }}
              thumbColor={notificationsEnabled ? colors.primary : colors.gray400}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Workout Preferences</Text>
              <Text style={styles.settingSubtitle}>Set your preferred workout duration</Text>
            </View>
            <Text style={styles.settingValue}>30 min</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Units</Text>
              <Text style={styles.settingSubtitle}>Weight and measurement units</Text>
            </View>
            <Text style={styles.settingValue}>Metric</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleResetProgress}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Reset Progress</Text>
              <Text style={styles.settingSubtitle}>Clear all workout data</Text>
            </View>
            <Text style={styles.dangerIcon}>⚠️</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.appName}>LevelUpFitness</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Your personal fitness companion for progressive training and healthy habits.
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
  profileSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  profileInfo: {
    marginTop: 16,
    width: '100%',
  },
  editingContainer: {
    width: '100%',
  },
  displayContainer: {
    alignItems: 'center',
  },
  nameInput: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  emailInput: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray200,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  memberSince: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  editProfileButton: {
    backgroundColor: colors.primary + '10',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  editProfileButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
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
  settingItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  settingValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  dangerText: {
    color: colors.error,
  },
  dangerIcon: {
    fontSize: 18,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});