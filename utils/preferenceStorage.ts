import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types/restaurant';

const PREFERENCES_KEY = 'user_preferences';

export async function savePreferences(preferences: UserPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    console.log('Preferences saved:', preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

export async function getPreferences(): Promise<UserPreferences | null> {
  try {
    const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading preferences:', error);
    return null;
  }
}

export async function clearPreferences(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PREFERENCES_KEY);
  } catch (error) {
    console.error('Error clearing preferences:', error);
  }
}