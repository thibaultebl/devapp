import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Star, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react-native';
import { RestaurantRecommendation } from '../utils/geminiService';
import { getPhotoUrl } from '../utils/googlePlacesService';

interface RecommendationCardProps {
  recommendation: RestaurantRecommendation;
  isTopPick: boolean;
}

export default function RecommendationCard({ recommendation, isTopPick }: RecommendationCardProps) {
  const { restaurant, matchScore, reasoning } = recommendation;

  const handleMapPress = () => {
    const url = `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
    Linking.openURL(url);
  };

  const handleWebsitePress = () => {
    if (restaurant.website) {
      Linking.openURL(restaurant.website);
    }
  };

  const renderPriceIndicator = () => {
    const count = restaurant.price_level || 1;
    return (
      <View style={styles.priceContainer}>
        {[...Array(4)].map((_, index) => (
          <DollarSign
            key={index}
            size={14}
            color={index < count ? '#F59E0B' : '#E5E7EB'}
          />
        ))}
      </View>
    );
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#F59E0B';
    if (score >= 70) return '#F97316';
    return '#6B7280';
  };

  const photoUrl = restaurant.photos?.[0] 
    ? getPhotoUrl(restaurant.photos[0].photo_reference, 400)
    : 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg';

  return (
    <View style={[styles.card, isTopPick && styles.topPickCard]}>
      {isTopPick && (
        <View style={styles.topPickBadge}>
          <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.topPickText}>Top Pick</Text>
        </View>
      )}

      <Image source={{ uri: photoUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={[styles.matchScore, { backgroundColor: getMatchScoreColor(matchScore) }]}>
            <Text style={styles.matchScoreText}>{matchScore}%</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.rating}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{restaurant.rating?.toFixed(1) || 'N/A'}</Text>
          </View>
          {renderPriceIndicator()}
          <View style={styles.statusContainer}>
            <Clock size={14} color={restaurant.opening_hours?.open_now ? '#10B981' : '#EF4444'} />
            <Text style={[
              styles.statusText,
              { color: restaurant.opening_hours?.open_now ? '#10B981' : '#EF4444' }
            ]}>
              {restaurant.opening_hours?.open_now ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.distance}>{restaurant.distance}km away</Text>
        </View>

        <Text style={styles.address}>{restaurant.formatted_address}</Text>

        <View style={styles.reasoningContainer}>
          <Text style={styles.reasoningTitle}>Why this matches you:</Text>
          <Text style={styles.reasoning}>{reasoning}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
            <MapPin size={16} color="#FFFFFF" />
            <Text style={styles.mapButtonText}>Directions</Text>
          </TouchableOpacity>
          
          {restaurant.website && (
            <TouchableOpacity style={styles.websiteButton} onPress={handleWebsitePress}>
              <ExternalLink size={16} color="#000000" />
              <Text style={styles.websiteButtonText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative'
  },
  topPickCard: {
    borderWidth: 2,
    borderColor: '#F59E0B'
  },
  topPickBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1
  },
  topPickText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  content: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12
  },
  matchScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  matchScoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 2
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600'
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8
  },
  distance: {
    fontSize: 14,
    color: '#6B7280'
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16
  },
  reasoningContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  reasoningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4
  },
  reasoning: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  mapButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  websiteButton: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1
  },
  websiteButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600'
  }
});