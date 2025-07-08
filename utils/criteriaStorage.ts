import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types/restaurant';

const CRITERIA_KEY = 'user_criteria';

export async function saveCriteria(criteria: UserPreferences): Promise<void> {
  try {
    const criteriaWithTimestamp = {
      ...criteria,
      timestamp: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(CRITERIA_KEY, JSON.stringify(criteriaWithTimestamp));
    console.log('User criteria saved:', criteriaWithTimestamp);
  } catch (error) {
    console.error('Error saving criteria:', error);
  }
}

export async function getCriteria(): Promise<UserPreferences | null> {
  try {
    const stored = await AsyncStorage.getItem(CRITERIA_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    // Remove timestamp before returning
    const { timestamp, ...criteria } = parsed;
    return criteria;
  } catch (error) {
    console.error('Error loading criteria:', error);
    return null;
  }
}

export async function clearCriteria(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CRITERIA_KEY);
    console.log('User criteria cleared');
  } catch (error) {
    console.error('Error clearing criteria:', error);
  }
}

export async function exportCriteriaAsJSON(): Promise<string | null> {
  try {
    const criteria = await getCriteria();
    if (!criteria) return null;
    
    return JSON.stringify(criteria, null, 2);
  } catch (error) {
    console.error('Error exporting criteria:', error);
    return null;
  }
}