import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MapPin, Sparkles, Clock, Star } from 'lucide-react-native';
import { getCurrentLocation } from '../../utils/locationService';
import { getAllRestaurantData } from '../../utils/googlePlacesService';
import { getAIRecommendation, AIRecommendationResult } from '../../utils/geminiService';
import { getCriteria } from '../../utils/criteriaStorage';
import RecommendationCard from '../../components/RecommendationCard';

type DiscoverState = 'idle' | 'loading' | 'results' | 'error';

export default function DiscoverScreen() {
  const [state, setState] = useState<DiscoverState>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [recommendation, setRecommendation] = useState<AIRecommendationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleDiscover = async () => {
    setState('loading');
    setError('');
    
    try {
      // Step 1: Get user location
      setLoadingStep('Getting your location...');
      const location = await getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get your location. Please enable location services.');
      }

      // Step 2: Get user preferences
      setLoadingStep('Loading your preferences...');
      const preferences = await getCriteria();
      if (!preferences) {
        throw new Error('No preferences found. Please complete the preference setup first.');
      }

      // Step 3: Fetch nearby restaurants
      setLoadingStep('Finding nearby restaurants...');
      const restaurants = await getAllRestaurantData(location);
      if (restaurants.length === 0) {
        throw new Error('No restaurants found in your area.');
      }

      // Step 4: Get AI recommendation
      setLoadingStep('Analyzing restaurants with AI...');
      const aiResult = await getAIRecommendation(restaurants, preferences);
      if (!aiResult) {
        throw new Error('Unable to generate recommendations. Please try again.');
      }

      setRecommendation(aiResult);
      setState('results');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setState('error');
    }
  };

  const handleTryAgain = () => {
    setState('idle');
    setRecommendation(null);
    setError('');
  };

  if (state === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingTitle}>Finding Your Perfect Restaurant</Text>
          <Text style={styles.loadingStep}>{loadingStep}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (state === 'results' && recommendation) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.resultsContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Your AI Recommendations</Text>
            <Text style={styles.subtitle}>{recommendation.summary}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Top Recommendation</Text>
            </View>
            <RecommendationCard 
              recommendation={recommendation.topRecommendation}
              isTopPick={true}
            />
          </View>

          {recommendation.alternativeOptions.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Alternative Options</Text>
              </View>
              {recommendation.alternativeOptions.map((alt, index) => (
                <RecommendationCard 
                  key={alt.restaurant.place_id}
                  recommendation={alt}
                  isTopPick={false}
                />
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.discoverAgainButton} onPress={handleTryAgain}>
            <Sparkles size={20} color="#FFFFFF" />
            <Text style={styles.discoverAgainButtonText}>Discover Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.idleContainer}>
        <View style={styles.heroSection}>
          <Sparkles size={80} color="#000000" />
          <Text style={styles.heroTitle}>Discover Your Perfect Restaurant</Text>
          <Text style={styles.heroSubtitle}>
            Using AI and your preferences, we'll find the ideal dining spot near you
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.feature}>
            <MapPin size={24} color="#6B7280" />
            <Text style={styles.featureText}>Uses your current location</Text>
          </View>
          <View style={styles.feature}>
            <Sparkles size={24} color="#6B7280" />
            <Text style={styles.featureText}>AI-powered recommendations</Text>
          </View>
          <View style={styles.feature}>
            <Star size={24} color="#6B7280" />
            <Text style={styles.featureText}>Personalized to your taste</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.discoverButton} onPress={handleDiscover}>
          <Sparkles size={20} color="#FFFFFF" />
          <Text style={styles.discoverButtonText}>Discover Restaurants</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  idleContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center'
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26
  },
  featuresSection: {
    marginBottom: 48
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500'
  },
  discoverButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center'
  },
  loadingStep: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center'
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32
  },
  tryAgainButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16
  },
  tryAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  resultsContainer: {
    flex: 1
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8
  },
  discoverAgainButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginHorizontal: 24,
    marginVertical: 24
  },
  discoverAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  }
});