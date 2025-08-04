import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { X, Clock, Trash2 } from 'lucide-react-native';
import { Restaurant } from '../types/restaurant';
import { getHistory, clearHistory } from '../utils/storage';
import RestaurantCard from './RestaurantCard';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HistoryModal({ visible, onClose }: HistoryModalProps) {
  const [history, setHistory] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (visible) {
      loadHistory();
    }
  }, [visible]);

  const loadHistory = async () => {
    const historyData = await getHistory();
    setHistory(historyData);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Restaurant History</Text>
          <View style={styles.headerActions}>
            {history.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Clock size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptySubtitle}>
              Restaurants you discover will appear here
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.historyList}>
            {history.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                showFullDetails={false}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  clearButton: {
    padding: 8
  },
  closeButton: {
    padding: 8
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16
  }
});