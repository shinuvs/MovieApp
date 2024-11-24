import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  Share
} from 'react-native';
import { Movie } from '../../types/movie.types';
import { useFavorites } from './hooks/useFavorites';
import { Stack } from 'expo-router';
import { IMAGE_BASE_URL } from '../../constants/api';

interface ErrorState {
  message: string;
  type: 'share' | 'remove' | 'general';
}

interface FavoriteMoviesProps {
  onAddFavorite?: (movie: Movie) => void;
}

const FavoriteMovies: React.FC<FavoriteMoviesProps> = ({ onAddFavorite }) => {
  const { favorites, removeFavorite, isLoading } = useFavorites();
  const [error, setError] = useState<ErrorState | null>(null);

  const clearError = () => {
    setError(null);
  };

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRemove = async (movieId: number) => {
    try {
      await removeFavorite(movieId);
      clearError();
    } catch (err) {
      setError({
        message: 'Failed to remove movie from favorites. Please try again.',
        type: 'remove'
      });
    }
  };

  const handleShare = async (movie: Movie) => {
    try {
      await Share.share({
        message: `Check out this movie: ${movie.title} (${movie.release_date?.substring(0, 4)})`,
        title: 'Share Movie',
      });
      clearError();
    } catch (err) {
      setError({
        message: 'Failed to share movie. Please try again.',
        type: 'share'
      });
    }
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ 
          title: 'Favorites',
          headerTitleStyle: {
            fontSize: 18,
          },
        }} 
      />
      {error && (
        <TouchableOpacity 
          style={[styles.errorContainer, 
            error.type === 'remove' && styles.errorRemove,
            error.type === 'share' && styles.errorShare,
          ]} 
          onPress={clearError}
        >
          <Text style={styles.errorText}>{error.message}</Text>
          <Text style={styles.errorDismiss}>Tap to dismiss</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <View style={styles.cardContent}>
              <Image 
                source={{ uri: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : undefined }} 
                style={styles.poster}
                resizeMode="cover"
              />
              <View style={styles.movieInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.year}>{item.release_date?.substring(0, 4)}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemove(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove from Favorites</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.shareButton}
                    onPress={() => handleShare(item)}
                  >
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
  movieCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  year: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  shareButton: {
    backgroundColor: '#4267B2',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  errorContainer: {
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffebee',
    borderWidth: 1,
  },
  errorRemove: {
    backgroundColor: '#ffebee',
    borderColor: '#ef5350',
  },
  errorShare: {
    backgroundColor: '#e3f2fd',
    borderColor: '#42a5f5',
  },
  errorText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 2,
  },
  errorDismiss: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default FavoriteMovies; 