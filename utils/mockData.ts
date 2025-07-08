import { Restaurant, Question } from '../types/restaurant';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'La Petite Maison',
    rating: 4.7,
    cuisine: 'French',
    priceRange: 'expensive',
    distance: 2.3,
    ambiance: ['romantic', 'quiet', 'elegant'],
    description: 'Intimate French bistro with authentic cuisine and wine selection.',
    imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '123 Rue de la Paix, Downtown',
    googleMapsUrl: 'https://maps.google.com/?q=La+Petite+Maison+Downtown'
  },
  {
    id: '2',
    name: 'Street Tacos',
    rating: 4.3,
    cuisine: 'Mexican',
    priceRange: 'cheap',
    distance: 0.8,
    ambiance: ['casual', 'lively', 'trendy'],
    description: 'Authentic street-style tacos with fresh ingredients and bold flavors.',
    imageUrl: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '456 Market Street, Food District',
    googleMapsUrl: 'https://maps.google.com/?q=Street+Tacos+Market+Street'
  },
  {
    id: '3',
    name: 'Sakura Sushi',
    rating: 4.6,
    cuisine: 'Japanese',
    priceRange: 'moderate',
    distance: 1.5,
    ambiance: ['quiet', 'traditional', 'intimate'],
    description: 'Traditional sushi bar with fresh fish and authentic preparation.',
    imageUrl: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '789 Bamboo Lane, Little Tokyo',
    googleMapsUrl: 'https://maps.google.com/?q=Sakura+Sushi+Bamboo+Lane'
  },
  {
    id: '4',
    name: 'The Garden Terrace',
    rating: 4.4,
    cuisine: 'Mediterranean',
    priceRange: 'moderate',
    distance: 3.2,
    ambiance: ['outdoor', 'relaxed', 'family-friendly'],
    description: 'Beautiful outdoor dining with Mediterranean flavors and garden views.',
    imageUrl: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '321 Garden Way, Riverside',
    googleMapsUrl: 'https://maps.google.com/?q=The+Garden+Terrace+Riverside'
  },
  {
    id: '5',
    name: 'Urban Grill',
    rating: 4.2,
    cuisine: 'American',
    priceRange: 'moderate',
    distance: 1.8,
    ambiance: ['trendy', 'business', 'modern'],
    description: 'Contemporary American cuisine in a sleek, modern setting.',
    imageUrl: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '654 Downtown Plaza, Business District',
    googleMapsUrl: 'https://maps.google.com/?q=Urban+Grill+Downtown+Plaza'
  },
  {
    id: '6',
    name: 'Nonna\'s Kitchen',
    rating: 4.8,
    cuisine: 'Italian',
    priceRange: 'moderate',
    distance: 2.7,
    ambiance: ['cozy', 'family-friendly', 'traditional'],
    description: 'Family-owned Italian restaurant with homemade pasta and warm atmosphere.',
    imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '987 Little Italy Street, Heritage District',
    googleMapsUrl: 'https://maps.google.com/?q=Nonnas+Kitchen+Little+Italy'
  },
  {
    id: '7',
    name: 'The Rooftop Bar',
    rating: 4.1,
    cuisine: 'International',
    priceRange: 'expensive',
    distance: 4.5,
    ambiance: ['trendy', 'nightlife', 'outdoor'],
    description: 'Elevated dining experience with city views and craft cocktails.',
    imageUrl: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '111 Skyline Tower, Downtown',
    googleMapsUrl: 'https://maps.google.com/?q=The+Rooftop+Bar+Skyline+Tower'
  },
  {
    id: '8',
    name: 'Green Bowl',
    rating: 4.5,
    cuisine: 'Healthy',
    priceRange: 'moderate',
    distance: 1.2,
    ambiance: ['casual', 'healthy', 'modern'],
    description: 'Fresh, organic bowls and smoothies for health-conscious diners.',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '444 Wellness Way, Health District',
    googleMapsUrl: 'https://maps.google.com/?q=Green+Bowl+Wellness+Way'
  },
  {
    id: '9',
    name: 'Local Harvest',
    rating: 4.6,
    cuisine: 'Local',
    priceRange: 'moderate',
    distance: 2.1,
    ambiance: ['casual', 'family-friendly', 'cozy'],
    description: 'Farm-to-table restaurant featuring locally sourced ingredients and regional specialties.',
    imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    address: '789 Farm Road, Local District',
    googleMapsUrl: 'https://maps.google.com/?q=Local+Harvest+Farm+Road'
  }
];

export const questions: Question[] = [
  {
    id: 'budget',
    text: 'Price range?',
    type: 'single',
    options: [
      { id: 'cheap', text: 'Low', value: 'cheap', icon: 'DollarSign' },
      { id: 'moderate', text: 'Moderate', value: 'moderate', icon: 'DollarSign' },
      { id: 'expensive', text: 'High', value: 'expensive', icon: 'DollarSign' }
    ]
  },
  {
    id: 'transport',
    text: 'Transport mode?',
    type: 'single',
    options: [
      { id: 'car', text: 'Car', value: true, icon: 'Car' },
      { id: 'no_car', text: 'Walk/Public Transport', value: false, icon: 'MapPin' }
    ]
  },
  {
    id: 'cuisine',
    text: 'Cuisine type?',
    type: 'multiple',
    options: [
      { id: 'local', text: 'Local', value: 'Local', icon: 'Utensils' },
      { id: 'italian', text: 'Italian', value: 'Italian', icon: 'Utensils' },
      { id: 'asian', text: 'Asian', value: 'Japanese', icon: 'Utensils' },
      { id: 'mexican', text: 'Mexican', value: 'Mexican', icon: 'Utensils' },
      { id: 'american', text: 'American', value: 'American', icon: 'Utensils' },
      { id: 'french', text: 'French', value: 'French', icon: 'Utensils' },
      { id: 'mediterranean', text: 'Mediterranean', value: 'Mediterranean', icon: 'Utensils' }
    ]
  },
  {
    id: 'ambiance',
    text: 'Atmosphere mood?',
    type: 'multiple',
    options: [
      { id: 'casual', text: 'Casual', value: 'casual', icon: 'Coffee' },
      { id: 'romantic', text: 'Romantic', value: 'romantic', icon: 'Heart' },
      { id: 'family', text: 'Family Friendly', value: 'family-friendly', icon: 'Users' }
    ]
  },
  {
    id: 'time',
    text: 'When?',
    type: 'single',
    options: [
      { id: 'breakfast', text: 'Breakfast', value: 'breakfast', icon: 'Sun' },
      { id: 'lunch', text: 'Lunch', value: 'lunch', icon: 'Clock' },
      { id: 'dinner', text: 'Dinner', value: 'dinner', icon: 'Moon' }
    ]
  }
];