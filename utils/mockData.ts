import { Question } from '../types/restaurant';

export const questions: Question[] = [
  {
    id: 'budget',
    text: 'What\'s your preferred price range?',
    type: 'single',
    options: [
      { id: 'cheap', text: 'Budget-friendly ($)', value: 'cheap', icon: 'DollarSign' },
      { id: 'moderate', text: 'Moderate ($$)', value: 'moderate', icon: 'DollarSign' },
      { id: 'expensive', text: 'Premium ($$$)', value: 'expensive', icon: 'DollarSign' }
    ]
  },
  {
    id: 'hasTransport',
    text: 'How will you get there?',
    type: 'single',
    options: [
      { id: 'car', text: 'I have a car', value: true, icon: 'Car' },
      { id: 'no_car', text: 'Walking/Public transport', value: false, icon: 'MapPin' }
    ]
  },
  {
    id: 'cuisines',
    text: 'What type of cuisine do you prefer?',
    type: 'multiple',
    options: [
      { id: 'local', text: 'Local cuisine', value: 'Local', icon: 'Utensils' },
      { id: 'italian', text: 'Italian', value: 'Italian', icon: 'Utensils' },
      { id: 'japanese', text: 'Japanese', value: 'Japanese', icon: 'Utensils' },
      { id: 'mexican', text: 'Mexican', value: 'Mexican', icon: 'Utensils' },
      { id: 'american', text: 'American', value: 'American', icon: 'Utensils' },
      { id: 'french', text: 'French', value: 'French', icon: 'Utensils' },
      { id: 'mediterranean', text: 'Mediterranean', value: 'Mediterranean', icon: 'Utensils' }
    ]
  },
  {
    id: 'ambiance',
    text: 'What kind of atmosphere do you prefer?',
    type: 'multiple',
    options: [
      { id: 'casual', text: 'Casual & relaxed', value: 'casual', icon: 'Coffee' },
      { id: 'romantic', text: 'Romantic', value: 'romantic', icon: 'Heart' },
      { id: 'family', text: 'Family-friendly', value: 'family-friendly', icon: 'Users' },
      { id: 'business', text: 'Business/Professional', value: 'business', icon: 'Briefcase' }
    ]
  },
  {
    id: 'diningTime',
    text: 'When are you planning to dine?',
    type: 'single',
    options: [
      { id: 'breakfast', text: 'Breakfast', value: 'breakfast', icon: 'Sun' },
      { id: 'lunch', text: 'Lunch', value: 'lunch', icon: 'Clock' },
      { id: 'dinner', text: 'Dinner', value: 'dinner', icon: 'Moon' },
      { id: 'late_night', text: 'Late night', value: 'late_night', icon: 'Moon' }
    ]
  }
];