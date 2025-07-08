import { Restaurant, UserPreferences } from '../types/restaurant';
import { mockRestaurants } from './mockData';

export function filterRestaurants(preferences: UserPreferences): Restaurant[] {
  let filtered = [...mockRestaurants];

  // Filter by budget
  if (preferences.budget) {
    filtered = filtered.filter(restaurant => restaurant.priceRange === preferences.budget);
  }

  // Filter by distance based on transport
  const maxDistance = preferences.hasTransport === false ? 5 : 25; // 5km without car, 25km with car
  filtered = filtered.filter(restaurant => restaurant.distance <= maxDistance);

  // Filter by cuisine
  if (preferences.cuisines.length > 0) {
    filtered = filtered.filter(restaurant => 
      preferences.cuisines.some(cuisine => 
        restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      )
    );
  }

  // Filter by ambiance
  if (preferences.ambiance.length > 0) {
    filtered = filtered.filter(restaurant =>
      preferences.ambiance.some(amb => 
        restaurant.ambiance.some(restAmb => 
          restAmb.toLowerCase().includes(amb.toLowerCase())
        )
      )
    );
  }

  return filtered;
}

export function getFilterProgress(preferences: UserPreferences): number {
  const totalQuestions = 5; // Adjust based on your questions
  let answered = 0;
  
  if (preferences.budget) answered++;
  if (preferences.hasTransport !== null) answered++;
  if (preferences.cuisines.length > 0) answered++;
  if (preferences.ambiance.length > 0) answered++;
  if (preferences.diningTime) answered++;
  
  return Math.round((answered / totalQuestions) * 100);
}