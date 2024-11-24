import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../../../types/movie.types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteMovies');
      console.log('Raw loaded favorites:', savedFavorites);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        const validFavorites = parsedFavorites.filter((movie: Movie) => {
          const isValid = movie && typeof movie === 'object' && 
            movie.id !== undefined && 
            movie.title !== undefined;
          if (!isValid) {
            console.warn('Invalid movie object found:', movie);
          }
          return isValid;
        });
        console.log('Valid favorites after filtering:', validFavorites);
        setFavorites(validFavorites);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (movie: Movie) => {
    try {
      if (!movie || typeof movie !== 'object' || !movie.id || !movie.title) {
        console.error('Invalid movie data:', movie);
        throw new Error('Invalid movie data: Movie must have id and title');
      }
      const updatedFavorites = [...favorites, movie];
      await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setError(null);
    } catch (err) {
      setError('Failed to add favorite');
      console.error(err);
    }
  }, [favorites]);

  const removeFavorite = useCallback(async (movieId: number) => {
    try {
      const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
      await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setError(null);
    } catch (err) {
      setError('Failed to remove favorite');
      console.error(err);
    }
  }, [favorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    error,
    loadFavorites,
    addFavorite,
    removeFavorite,
  };
}; 