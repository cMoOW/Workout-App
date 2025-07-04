import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
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
  const fileInputRef = useRef<any>(null); // Use any for web compatibility

  const requestPermissions = async () => {
    console.log('ProfileImagePicker - Requesting permissions...');
    console.log('Platform:', Platform.OS);
    
    try {
      if (Platform.OS === 'web') {
        console.log('Web platform detected - skipping native permissions');
        return true;
      }

      // Add error handling for each permission request
      let cameraStatus = 'denied';
      let mediaStatus = 'denied';
      
      try {
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        cameraStatus = cameraResult.status;
        console.log('Camera permission status:', cameraStatus);
      } catch (cameraError) {
        console.error('Error requesting camera permissions:', cameraError);
      }
      
      try {
        const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        mediaStatus = mediaResult.status;
        console.log('Media library permission status:', mediaStatus);
      } catch (mediaError) {
        console.error('Error requesting media library permissions:', mediaError);
      }
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'We need camera and photo library permissions to update your profile picture.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in requestPermissions:', error);
      return Platform.OS === 'web'; // Allow web to proceed
    }
  };

  const showImageOptions = () => {
    console.log('ProfileImagePicker - showImageOptions called');
    
    if (Platform.OS === 'web') {
      // On web, directly trigger the file picker
      console.log('Web platform - triggering file picker directly');
      pickImageWeb();
    } else {
      // On mobile, show both camera and library options
      console.log('Mobile platform - showing full options');
      Alert.alert(
        'Select Profile Picture',
        'Choose how you want to set your profile picture',
        [
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickImage },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const pickImageWeb = () => {
    console.log('ProfileImagePicker - pickImageWeb called');
    
    if (Platform.OS !== 'web') {
      pickImage();
      return;
    }

    // Web-specific code
    if (typeof document !== 'undefined') {
      try {
        // First try using the hidden input ref
        if (fileInputRef.current) {
          console.log('Using hidden input ref');
          fileInputRef.current.click();
          return;
        }
      } catch (error) {
        console.log('Hidden input ref failed, trying dynamic approach:', error);
      }

      // Fallback: Create a dynamic file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          console.log('Dynamic input file selected:', file.name);
          setLoading(true);
          
          // Create a FileReader to convert the file to a data URL
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            console.log('Dynamic input image converted to data URL');
            onImageSelected(result);
            setLoading(false);
          };
          reader.onerror = (error) => {
            console.error('Dynamic input FileReader error:', error);
            Alert.alert('Error', 'Failed to process the selected image.');
            setLoading(false);
          };
          reader.readAsDataURL(file);
        }
      };
      
      // Trigger the file picker
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    }
  };

  const takePhoto = async () => {
    console.log('ProfileImagePicker - takePhoto called');
    
    if (Platform.OS === 'web') {
      Alert.alert('Camera Not Available', 'Camera is not available on web. Please choose a photo from your library.');
      return;
    }
    
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setLoading(true);
    try {
      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Photo taken successfully:', result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    console.log('ProfileImagePicker - pickImage called');
    
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setLoading(true);
    try {
      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image selected successfully:', result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      } else {
        console.log('Image selection was canceled');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
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
      
      {/* Hidden file input for web fallback */}
      {Platform.OS === 'web' && typeof document !== 'undefined' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(event) => {
            const file = (event.target as any).files?.[0];
            if (file) {
              console.log('Hidden input file selected:', file.name);
              setLoading(true);
              
              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result as string;
                console.log('Hidden input image converted to data URL');
                onImageSelected(result);
                setLoading(false);
              };
              reader.onerror = (error) => {
                console.error('Hidden input FileReader error:', error);
                Alert.alert('Error', 'Failed to process the selected image.');
                setLoading(false);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      )}
    </View>
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