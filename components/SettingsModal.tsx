import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView, ScrollView } from 'react-native';
import { X, User, History, HelpCircle, ChevronRight } from 'lucide-react-native';
import HistoryModal from './HistoryModal';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const [showHistory, setShowHistory] = useState(false);

  const handlePersonalInfo = () => {
    console.log('Personal Information pressed');
    // Add navigation to personal info screen
  };

  const handleHistory = () => {
    setShowHistory(true);
  };

  const handleGetHelp = () => {
    console.log('Get Help pressed');
    // Add navigation to help screen
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInfo}>
              <View style={styles.menuItemLeft}>
                <User size={24} color="#6B7280" />
                <Text style={styles.menuItemText}>Personal Information</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleHistory}>
              <View style={styles.menuItemLeft}>
                <History size={24} color="#6B7280" />
                <Text style={styles.menuItemText}>History</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleGetHelp}>
              <View style={styles.menuItemLeft}>
                <HelpCircle size={24} color="#6B7280" />
                <Text style={styles.menuItemText}>Get Help</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <HistoryModal 
        visible={showHistory} 
        onClose={() => setShowHistory(false)} 
      />
    </>
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
  closeButton: {
    padding: 8
  },
  content: {
    flex: 1,
    paddingTop: 16
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937'
  }
});