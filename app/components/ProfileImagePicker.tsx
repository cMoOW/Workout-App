import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { colors } from '../constants/colors';

interface ProfileImagePickerProps {
  currentImage?: string;
  onImageSelected: (imageUri: string) => void;
  size?: number;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  currentImage,
  onImageSelected,
  size = 120
}) => {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'We need camera and photo library permissions to update your profile picture.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to set your profile picture',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
      console.error('Image picker error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }]}
      onPress={showImageOptions}
      disabled={loading}
    >
      {loading ? (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : currentImage ? (
        <Image
          source={{ uri: currentImage }}
          style={[styles.image, { width: size, height: size }]}
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>Add Photo</Text>
        </View>
      )}
      
      <View style={styles.editButton}>
        <Text style={styles.editIcon}>✏️</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 60,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 60,
  },
  placeholder: {
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.gray300,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  editIcon: {
    fontSize: 12,
  },
});