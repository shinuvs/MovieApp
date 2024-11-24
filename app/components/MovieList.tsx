import React, { memo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Movie, MovieListProps } from '../types/movie.types';
import { COLORS, SPACING } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMAGE_BASE_URL } from '../constants/api';
const keyExtractor = (item: Movie) => item.id.toString();
const getImageUrl = (path: string): string => `${IMAGE_BASE_URL}${path}`;

const MovieList = memo(({ title, data, onMoviePress }: MovieListProps) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async (): Promise<void> => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteMovies');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (movie: Movie) => {
    try {
      
      if (!movie || !movie.id || !movie.title) {
        console.error('Invalid movie object:', movie);
        return;
      }

      let updatedFavorites: Movie[];
      if (favorites.some(fav => fav.id === movie.id)) {
        updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      } else {
        updatedFavorites = [...favorites, movie];
      }
      
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => onMoviePress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getImageUrl(item.poster_path) }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {(item.vote_average ?? 0).toFixed(1)}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.favoriteButtonText}>
            {favorites.some(fav => fav.id === item.id) ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{item.title}</Text>
      <Text style={styles.releaseDate}>{item.release_date}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  item: {
    width: 170,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: SPACING.sm,
    marginHorizontal: SPACING.xs,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: SPACING.xs,
  },
  name: {
    marginTop: SPACING.sm,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
    marginVertical: SPACING.sm,
    color: COLORS.text.primary,
  },
  releaseDate: {
    fontSize: 14,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  favoriteButtonText: {
    color: COLORS.background.primary,
    fontSize: 20,
  },
});

export default MovieList; 