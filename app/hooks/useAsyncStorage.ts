import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
          console.log(`Loaded ${key} from storage:`, parsedValue);
        } else {
          console.log(`No stored value for ${key}, using default:`, defaultValue);
        }
      } catch (error) {
        console.error(`Error loading ${key} from AsyncStorage:`, error);
      } finally {
        setLoading(false);
        isInitialized.current = true;
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = useCallback(async (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log(`Updating ${key}:`, valueToStore);
      
      // Update state first
      setStoredValue(valueToStore);
      
      // Then save to AsyncStorage synchronously
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`Successfully saved ${key} to storage`);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(defaultValue);
      console.log(`Removed ${key} from storage`);
    } catch (error) {
      console.error(`Error removing ${key} from AsyncStorage:`, error);
    }
  }, [key, defaultValue]);

  return { 
    value: storedValue, 
    setValue, 
    removeValue, 
    loading: loading || !isInitialized.current 
  };
}