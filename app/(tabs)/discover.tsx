import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Sparkles, Star, Clock, RotateCcw, CircleCheck as CheckCircle, Heart, Settings, User, History, CircleHelp as HelpCircle, X } from 'lucide-react-native';
import { UserPreferences, FilterKey } from '@/types/restaurant';
import { questions } from '@/utils/mockData';
import { saveCriteria, getCriteria } from '@/utils/criteriaStorage';
import { getCurrentLocation } from '@/utils/locationService';
import { getAllRestaurantData } from '@/utils/googlePlacesService';
import { getAIRecommendation, AIRecommendationResult } from '@/utils/geminiService';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import RecommendationCard from '@/components/RecommendationCard';
import FavoritesModal from '@/components/FavoritesModal';
import SettingsModal from '@/components/SettingsModal';

type FlowState = 'start' | 'questions' | 'loading' | 'results' | 'error';

export default function DiscoverScreen() {
  const [flowState, setFlowState] = useState<FlowState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [recommendation, setRecommendation] = useState<AIRecommendationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: null,
    hasTransport: null,
    cuisines: [],
    ambiance: [],
    partySize: null,
    diningTime: null,
    dietary: [],
    experience: null,
    noise: null,
    seating: null
  });

  const handleStartFlow = () => {
    setFlowState('questions');
    setCurrentQuestionIndex(0);
    setPreferences({
      budget: null,
      hasTransport: null,
      cuisines: [],
      ambiance: [],
      partySize: null,
      diningTime: null,
      dietary: [],
      experience: null,
      noise: null,
      seating: null
    });
  };

  const handleRestart = () => {
    setFlowState('start');
    setCurrentQuestionIndex(0);
    setRecommendation(null);
    setError('');
  };

  const handleOptionSelect = (option: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion.id as FilterKey;

    setPreferences(prev => {
      if (currentQuestion.type === 'single') {
        return { ...prev, [questionId]: option.value };
      } else {
        const currentValues = Array.isArray(prev[questionId]) ? prev[questionId] as any[] : [];
        const isSelected = currentValues.includes(option.value);
        
        if (isSelected) {
          return { ...prev, [questionId]: currentValues.filter(v => v !== option.value) };
        } else {
          return { ...prev, [questionId]: [...currentValues, option.value] };
        }
      }
    });
  };

  const canProceed = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion.id as FilterKey;
    const currentValue = preferences[questionId];

    if (currentQuestion.type === 'single') {
      return currentValue !== null;
    } else {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished questions, save preferences and find restaurants
      await saveCriteria(preferences);
      await findRestaurants();
    }
  };

  const findRestaurants = async () => {
    setFlowState('loading');
    setError('');
    
    try {
      // Step 1: Get user location
      setLoadingStep('Getting your location...');
      const location = await getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get your location. Please enable location services.');
      }

      // Step 2: Fetch nearby restaurants
      setLoadingStep('Finding nearby restaurants...');
      const restaurants = await getAllRestaurantData(location);
      if (restaurants.length === 0) {
        throw new Error('No restaurants found in your area.');
      }

      // Step 3: Get AI recommendation
      setLoadingStep('Analyzing restaurants with AI...');
      const aiResult = await getAIRecommendation(restaurants, preferences);
      if (!aiResult) {
        throw new Error('Unable to generate recommendations. Please try again.');
      }

      setRecommendation(aiResult);
      setFlowState('results');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setFlowState('error');
    }
  };

  const getCurrentSelectedValues = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion.id as FilterKey;
    const value = preferences[questionId];
    
    if (currentQuestion.type === 'single') {
      return value !== null ? [value] : [];
    } else {
      return Array.isArray(value) ? value : [];
    }
  };

  if (flowState === 'start') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(true)}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowFavorites(true)}>
            <Heart size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.startContent}>
          <Sparkles size={80} color="#000000" />
          <Text style={styles.welcomeTitle}>Discover Your Perfect Restaurant</Text>
          <Text style={styles.welcomeSubtitle}>
            Answer a few questions and we'll find the ideal dining spot for you using AI
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartFlow}>
            <Sparkles size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Let's Start</Text>
          </TouchableOpacity>
        </View>

        <FavoritesModal 
          visible={showFavorites} 
          onClose={() => setShowFavorites(false)} 
        />
        
        <SettingsModal 
          visible={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </SafeAreaView>
    );
  }

  if (flowState === 'questions') {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(true)}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <RotateCcw size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowFavorites(true)}>
            <Heart size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ProgressBar 
          currentStep={currentQuestionIndex + 1} 
          totalSteps={questions.length} 
        />

        <QuestionCard
          question={currentQuestion}
          selectedValues={getCurrentSelectedValues()}
          onOptionSelect={handleOptionSelect}
          onNext={handleNext}
          canProceed={canProceed()}
        />

        <FavoritesModal 
          visible={showFavorites} 
          onClose={() => setShowFavorites(false)} 
        />
        
        <SettingsModal 
          visible={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </SafeAreaView>
    );
  }

  if (flowState === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(true)}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowFavorites(true)}>
            <Heart size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingTitle}>Finding Your Perfect Restaurant</Text>
          <Text style={styles.loadingStep}>{loadingStep}</Text>
        </View>

        <FavoritesModal 
          visible={showFavorites} 
          onClose={() => setShowFavorites(false)} 
        />
        
        <SettingsModal 
          visible={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </SafeAreaView>
    );
  }

  if (flowState === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(true)}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowFavorites(true)}>
            <Heart size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.tryAgainButton} onPress={handleRestart}>
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>

        <FavoritesModal 
          visible={showFavorites} 
          onClose={() => setShowFavorites(false)} 
        />
        
        <SettingsModal 
          visible={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </SafeAreaView>
    );
  }

  if (flowState === 'results' && recommendation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(true)}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowFavorites(true)}>
            <Heart size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <CheckCircle size={32} color="#10B981" />
            <Text style={styles.resultsTitle}>Perfect Match Found!</Text>
            <Text style={styles.resultsSubtitle}>{recommendation.summary}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Your Perfect Restaurant</Text>
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

          <TouchableOpacity style={styles.discoverAgainButton} onPress={handleRestart}>
            <Sparkles size={20} color="#FFFFFF" />
            <Text style={styles.discoverAgainButtonText}>Discover Again</Text>
          </TouchableOpacity>
        </ScrollView>

        <FavoritesModal 
          visible={showFavorites} 
          onClose={() => setShowFavorites(false)} 
        />
        
        <SettingsModal 
          visible={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8
  },
  headerButton: {
    padding: 8
  },
  headerSpacer: {
    flex: 1
  },
  restartButton: {
    padding: 8
  },
  startContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48
  },
  startButton: {
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
  startButtonText: {
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
  resultsHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  resultsSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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