import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Settings, Info, MessageCircle, Star, User } from 'lucide-react-native';

export default function ProfileScreen() {
  const handlePress = (action: string) => {
    console.log(`Pressed: ${action}`);
    // Add navigation or functionality here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#6B7280" />
          </View>
          <Text style={styles.profileName}>Food Explorer</Text>
          <Text style={styles.profileSubtitle}>Discovering great restaurants</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('preferences')}
          >
            <View style={styles.menuItemLeft}>
              <Settings size={24} color="#6B7280" />
              <Text style={styles.menuItemText}>Preferences</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('rate')}
          >
            <View style={styles.menuItemLeft}>
              <Star size={24} color="#6B7280" />
              <Text style={styles.menuItemText}>Rate This App</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('feedback')}
          >
            <View style={styles.menuItemLeft}>
              <MessageCircle size={24} color="#6B7280" />
              <Text style={styles.menuItemText}>Send Feedback</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('about')}
          >
            <View style={styles.menuItemLeft}>
              <Info size={24} color="#6B7280" />
              <Text style={styles.menuItemText}>About</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
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
  content: {
    flex: 1
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 32
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
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