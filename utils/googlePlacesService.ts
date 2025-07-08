import { UserLocation } from './locationService';

const NEARBY_API_KEY = "AIzaSyAJIaHSfSaxodPUT7teMDVVoEODMZ70uuY";
const DETAILS_API_KEY = "AIzaSyDJW8p6maf1oF8tt7G5i-2HyNspHHuyNeM";
const PHOTO_API_KEY = "AIzaSyDJW8p6maf1oF8tt7G5i-2HyNspHHuyNeM";

export interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

export interface PlaceBasic {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  types: string[];
  vicinity: string;
  photos?: PlacePhoto[];
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  rating?: number;
  price_level?: number;
  types: string[];
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  photos?: PlacePhoto[];
  website?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface RestaurantData extends PlaceDetails {
  distance?: number;
  localImagePath?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getNearbyRestaurants(location: UserLocation, radius: number = 5000): Promise<PlaceBasic[]> {
  const params = new URLSearchParams({
    location: `${location.latitude},${location.longitude}`,
    radius: radius.toString(),
    type: 'restaurant',
    key: NEARBY_API_KEY,
  });

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    
    const data = await response.json() as {
      results: PlaceBasic[];
      status: string;
    };

    if (data.status !== 'OK') {
      throw new Error(`Places API error: ${data.status}`);
    }

    return data.results;
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    return [];
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const params = new URLSearchParams({
    place_id: placeId,
    key: DETAILS_API_KEY,
    fields: 'place_id,name,formatted_address,formatted_phone_number,rating,price_level,types,opening_hours,reviews,photos,website,geometry',
    language: 'en',
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    
    const data = await response.json() as { 
      result: PlaceDetails;
      status: string;
    };

    if (data.status !== 'OK') {
      throw new Error(`Place Details API error: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error(`Error fetching details for ${placeId}:`, error);
    return null;
  }
}

export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  const params = new URLSearchParams({
    photo_reference: photoReference,
    maxwidth: maxWidth.toString(),
    key: PHOTO_API_KEY,
  });

  return `https://maps.googleapis.com/maps/api/place/photo?${params.toString()}`;
}

export async function getAllRestaurantData(location: UserLocation): Promise<RestaurantData[]> {
  console.log('Fetching nearby restaurants...');
  const nearbyPlaces = await getNearbyRestaurants(location);
  
  console.log(`Found ${nearbyPlaces.length} restaurants. Fetching details...`);
  const restaurantData: RestaurantData[] = [];

  for (let i = 0; i < nearbyPlaces.length; i++) {
    const place = nearbyPlaces[i];
    console.log(`Fetching details for ${place.name} (${i + 1}/${nearbyPlaces.length})`);
    
    const details = await getPlaceDetails(place.place_id);
    if (details) {
      // Calculate distance
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        details.geometry.location.lat,
        details.geometry.location.lng
      );

      restaurantData.push({
        ...details,
        distance,
      });
    }
    
    // Rate limiting
    await delay(100);
  }

  console.log(`Successfully fetched ${restaurantData.length} restaurant details`);
  return restaurantData;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return Math.round(d * 100) / 100; // Round to 2 decimal places
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}