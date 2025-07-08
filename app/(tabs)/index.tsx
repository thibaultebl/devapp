import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Settings, RotateCcw, CircleCheck as CheckCircle } from 'lucide-react-native';
import { UserPreferences, FilterKey } from '../../types/restaurant';
import { questions } from '../../utils/mockData';
import { savePreferences } from '../../utils/preferenceStorage';
import QuestionCard from '../../components/QuestionCard';
import ProgressBar from '../../components/ProgressBar';

type FlowState = 'start' | 'questions' | 'completed';

export default function HomeScreen() {
  const [flowState, setFlowState] = useState<FlowState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
  };

  const handleOptionSelect = (option: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = currentQuestion.id as FilterKey;

    setPreferences(prev => {
      if (currentQuestion.type === 'single') {
        return { ...prev, [questionId]: option.value };
      } else {
        // Multiple selection - ensure currentValues is always an array
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
      // Finished questions, save preferences
      await savePreferences(preferences);
      setFlowState('completed');
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
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.startContent}>
          <Text style={styles.welcomeTitle}>Tell Us Your Preferences</Text>
          <Text style={styles.welcomeSubtitle}>
            Answer a few questions to help us understand your dining preferences
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartFlow}>
            <Text style={styles.startButtonText}>Let's Start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (flowState === 'questions') {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <RotateCcw size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#6B7280" />
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
      </SafeAreaView>
    );
  }

  // Completed state
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <RotateCcw size={24} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.completedContainer}>
        <CheckCircle size={80} color="#10B981" />
        <Text style={styles.completedTitle}>Preferences Saved!</Text>
        <Text style={styles.completedSubtitle}>
          Your dining preferences have been successfully recorded and saved.
        </Text>
        
        <TouchableOpacity style={styles.restartFullButton} onPress={handleRestart}>
          <Text style={styles.restartFullButtonText}>Start Over</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8
  },
  settingsButton: {
    padding: 8
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
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  completedSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48
  },
  restartFullButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16
  },
  restartFullButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  }
});