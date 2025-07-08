import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Question, QuestionOption } from '../types/restaurant';

interface QuestionCardProps {
  question: Question;
  selectedValues: any[];
  onOptionSelect: (option: QuestionOption) => void;
  onNext: () => void;
  canProceed: boolean;
}

export default function QuestionCard({ 
  question, 
  selectedValues, 
  onOptionSelect, 
  onNext, 
  canProceed 
}: QuestionCardProps) {
  const isSelected = (option: QuestionOption) => {
    return selectedValues.includes(option.value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {question.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              isSelected(option) && styles.selectedOption
            ]}
            onPress={() => onOptionSelect(option)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              isSelected(option) && styles.selectedOptionText
            ]}>
              {option.text}
            </Text>
            
            {isSelected(option) && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {question.type === 'multiple' && (
        <Text style={styles.helperText}>You can select multiple options</Text>
      )}

      <TouchableOpacity
        style={[
          styles.nextButton,
          !canProceed && styles.nextButtonDisabled
        ]}
        onPress={onNext}
        disabled={!canProceed}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.nextButtonText,
          !canProceed && styles.nextButtonTextDisabled
        ]}>
          Continue
        </Text>
        <ChevronRight 
          size={20} 
          color={canProceed ? '#FFFFFF' : '#9CA3AF'} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 24
  },
  optionsContainer: {
    gap: 16,
    paddingBottom: 20
  },
  option: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectedOption: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B'
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    flex: 1
  },
  selectedOptionText: {
    color: '#92400E'
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic'
  },
  nextButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 40
  },
  nextButtonDisabled: {
    backgroundColor: '#F3F4F6'
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF'
  }
});