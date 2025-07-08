import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserPreferences } from '../types/restaurant';
import { RestaurantData } from './googlePlacesService';

const GEMINI_API_KEY = "AIzaSyAZAQ-r7ggkcCs1I3CYwIHNLYHSxiU3K-0";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface RestaurantRecommendation {
  restaurant: RestaurantData;
  matchScore: number;
  reasoning: string;
}

export interface AIRecommendationResult {
  topRecommendation: RestaurantRecommendation;
  alternativeOptions: RestaurantRecommendation[];
  summary: string;
}

export async function getAIRecommendation(
  restaurants: RestaurantData[],
  preferences: UserPreferences
): Promise<AIRecommendationResult | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = createRecommendationPrompt(restaurants, preferences);
    
    console.log('Sending request to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received AI response');
    return parseAIResponse(text, restaurants);
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    return null;
  }
}

function createRecommendationPrompt(restaurants: RestaurantData[], preferences: UserPreferences): string {
  const preferencesText = formatPreferences(preferences);
  const restaurantsText = formatRestaurants(restaurants);

  return `
You are an expert restaurant recommendation AI. Analyze the following restaurants and user preferences to provide personalized recommendations.

USER PREFERENCES:
${preferencesText}

AVAILABLE RESTAURANTS:
${restaurantsText}

TASK:
1. Analyze each restaurant against the user's preferences
2. Score each restaurant from 1-100 based on how well it matches the preferences
3. Select the TOP recommendation and 2-3 alternative options
4. Provide clear reasoning for each recommendation

RESPONSE FORMAT (JSON):
{
  "topRecommendation": {
    "place_id": "restaurant_place_id",
    "matchScore": 95,
    "reasoning": "Detailed explanation of why this is the best match"
  },
  "alternativeOptions": [
    {
      "place_id": "restaurant_place_id",
      "matchScore": 85,
      "reasoning": "Why this is a good alternative"
    }
  ],
  "summary": "Overall summary of the recommendations and key factors considered"
}

Consider these factors in your analysis:
- Budget compatibility (price_level vs budget preference)
- Distance and transportation needs
- Cuisine preferences
- Ambiance and atmosphere (inferred from reviews and restaurant type)
- Dining time appropriateness
- Dietary restrictions (if mentioned in reviews or restaurant type)
- Overall rating and review quality
- Current availability (opening hours)

Provide thoughtful, personalized reasoning that shows you understand both the user's needs and each restaurant's characteristics.
`;
}

function formatPreferences(preferences: UserPreferences): string {
  const parts: string[] = [];
  
  if (preferences.budget) {
    parts.push(`Budget: ${preferences.budget}`);
  }
  
  if (preferences.hasTransport !== null) {
    parts.push(`Transportation: ${preferences.hasTransport ? 'Has car/transport' : 'Walking/public transport only'}`);
  }
  
  if (preferences.cuisines.length > 0) {
    parts.push(`Preferred cuisines: ${preferences.cuisines.join(', ')}`);
  }
  
  if (preferences.ambiance.length > 0) {
    parts.push(`Preferred ambiance: ${preferences.ambiance.join(', ')}`);
  }
  
  if (preferences.diningTime) {
    parts.push(`Dining time: ${preferences.diningTime}`);
  }
  
  if (preferences.dietary.length > 0) {
    parts.push(`Dietary restrictions: ${preferences.dietary.join(', ')}`);
  }
  
  if (preferences.experience) {
    parts.push(`Experience type: ${preferences.experience}`);
  }
  
  if (preferences.noise) {
    parts.push(`Noise preference: ${preferences.noise}`);
  }
  
  if (preferences.seating) {
    parts.push(`Seating preference: ${preferences.seating}`);
  }

  return parts.join('\n');
}

function formatRestaurants(restaurants: RestaurantData[]): string {
  return restaurants.map((restaurant, index) => {
    const reviews = restaurant.reviews?.slice(0, 2).map(r => 
      `"${r.text.substring(0, 100)}..." (${r.rating}/5)`
    ).join('\n  ') || 'No reviews available';

    const openNow = restaurant.opening_hours?.open_now ? 'Open now' : 'Closed';
    const priceLevel = restaurant.price_level ? '$'.repeat(restaurant.price_level) : 'Price not available';

    return `
${index + 1}. ${restaurant.name}
   Place ID: ${restaurant.place_id}
   Address: ${restaurant.formatted_address}
   Rating: ${restaurant.rating || 'N/A'}/5
   Price Level: ${priceLevel}
   Distance: ${restaurant.distance}km
   Status: ${openNow}
   Types: ${restaurant.types.join(', ')}
   Recent Reviews:
   ${reviews}
`;
  }).join('\n');
}

function parseAIResponse(responseText: string, restaurants: RestaurantData[]): AIRecommendationResult | null {
  try {
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Find restaurants by place_id
    const findRestaurant = (placeId: string) => 
      restaurants.find(r => r.place_id === placeId);

    const topRestaurant = findRestaurant(parsed.topRecommendation.place_id);
    if (!topRestaurant) {
      throw new Error('Top recommendation restaurant not found');
    }

    const topRecommendation: RestaurantRecommendation = {
      restaurant: topRestaurant,
      matchScore: parsed.topRecommendation.matchScore,
      reasoning: parsed.topRecommendation.reasoning,
    };

    const alternativeOptions: RestaurantRecommendation[] = parsed.alternativeOptions
      .map((alt: any) => {
        const restaurant = findRestaurant(alt.place_id);
        if (!restaurant) return null;
        
        return {
          restaurant,
          matchScore: alt.matchScore,
          reasoning: alt.reasoning,
        };
      })
      .filter(Boolean);

    return {
      topRecommendation,
      alternativeOptions,
      summary: parsed.summary,
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    console.log('Raw response:', responseText);
    return null;
  }
}