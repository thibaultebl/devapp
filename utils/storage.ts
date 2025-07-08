import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurant } from '../types/restaurant';

const FAVORITES_KEY = 'restaurant_favorites';
const HISTORY_KEY = 'restaurant_history';

export async function addToFavorites(restaurant: Restaurant): Promise<void> {
  try {
    const existingFavorites = await getFavorites();
    const isAlreadyFavorite = existingFavorites.some(r => r.id === restaurant.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [restaurant, ...existingFavorites];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

export async function removeFromFavorites(restaurantId: string): Promise<void> {
  try {
    const existingFavorites = await getFavorites();
    const updatedFavorites = existingFavorites.filter(r => r.id !== restaurantId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

export async function getFavorites(): Promise<Restaurant[]> {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

export async function isFavorite(restaurantId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some(r => r.id === restaurantId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}

export async function clearFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}

export async function addToHistory(restaurant: Restaurant): Promise<void> {
  try {
    const existingHistory = await getHistory();
    const isAlreadyInHistory = existingHistory.some(r => r.id === restaurant.id);
    
    if (!isAlreadyInHistory) {
      const updatedHistory = [restaurant, ...existingHistory];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error('Error adding to history:', error);
  }
}

export async function getHistory(): Promise<Restaurant[]> {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}