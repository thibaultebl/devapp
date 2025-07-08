export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
  value: any;
  icon?: string;
}

export interface UserPreferences {
  budget: 'cheap' | 'moderate' | 'expensive' | null;
  hasTransport: boolean | null;
  cuisines: string[];
  ambiance: string[];
  partySize: number | null;
  diningTime: 'breakfast' | 'lunch' | 'dinner' | 'late_night' | null;
  dietary: string[];
  experience: 'casual' | 'special' | 'business' | null;
  noise: 'quiet' | 'moderate' | 'lively' | null;
  seating: 'indoor' | 'outdoor' | 'bar' | null;
}

export type FilterKey = keyof UserPreferences;