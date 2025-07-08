import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Star, MapPin, DollarSign, Heart } from 'lucide-react-native';
import { Restaurant } from '../types/restaurant';
import { addToFavorites, removeFromFavorites, isFavorite } from '../utils/storage';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: () => void;
  showFullDetails?: boolean;
  onFavoritesChange?: () => void;
}

export default function RestaurantCard({ restaurant, onPress, showFullDetails = false, onFavoritesChange }: RestaurantCardProps) {
  const [isRestaurantFavorite, setIsRestaurantFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [restaurant.id]);

  const checkFavoriteStatus = async () => {
    const favoriteStatus = await isFavorite(restaurant.id);
    setIsRestaurantFavorite(favoriteStatus);
  };

  const handleMapPress = () => {
    Linking.openURL(restaurant.googleMapsUrl);
  };

  const handleFavoritePress = async () => {
    if (isRestaurantFavorite) {
      await removeFromFavorites(restaurant.id);
      setIsRestaurantFavorite(false);
    } else {
      await addToFavorites(restaurant);
      setIsRestaurantFavorite(true);
    }
    onFavoritesChange?.();
  };

  const renderPriceIndicator = () => {
    const count = restaurant.priceRange === 'cheap' ? 1 : restaurant.priceRange === 'moderate' ? 2 : 3;
    return (
      <View style={styles.priceContainer}>
        {[...Array(3)].map((_, index) => (
          <DollarSign
            key={index}
            size={16}
            color={index < count ? '#F59E0B' : '#E5E7EB'}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.headerRight}>
            <View style={styles.rating}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={handleFavoritePress}
              activeOpacity={0.7}
            >
              <Heart 
                size={20} 
                color={isRestaurantFavorite ? '#000000' : '#9CA3AF'}
                fill={isRestaurantFavorite ? '#000000' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
          {renderPriceIndicator()}
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.distance}>{restaurant.distance.toFixed(1)} km away</Text>
        </View>

        {showFullDetails && (
          <>
            <Text style={styles.description}>{restaurant.description}</Text>
            <Text style={styles.address}>{restaurant.address}</Text>
            
            <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.mapButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
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
    overflow: 'hidden'
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
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
  favoriteButton: {
    padding: 4
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  cuisine: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500'
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 2
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12
  },
  distance: {
    fontSize: 14,
    color: '#6B7280'
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16
  },
  mapButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});