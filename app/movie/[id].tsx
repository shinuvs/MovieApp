import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useGetMovieDetailsQuery, useGetMovieCreditsQuery } from '../services/movieApi';
import { COLORS, SPACING } from '../constants/theme';
import { AntDesign } from '@expo/vector-icons';
import { MESSAGES } from '../constants/strings';
import { IMAGE_BASE_URL } from '../constants/api';

const MovieDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  
  const {
    data: movieDetails,
    isLoading: detailsLoading,
    error: detailsError
  } = useGetMovieDetailsQuery(movieId);

  const {
    data: credits,
    isLoading: creditsLoading
  } = useGetMovieCreditsQuery(movieId);

  if (detailsLoading || creditsLoading) {
    return (
      <>
        <Stack.Screen options={{ title: MESSAGES.LOADING.MOVIE_DETAILS }} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </>
    );
  }

  if (detailsError || !movieDetails) {
    return (
      <>
        <Stack.Screen options={{ title: MESSAGES.SCREENS.ERROR }} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{MESSAGES.ERRORS.MOVIE_DETAILS_LOAD_FAILED}</Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: movieDetails.title,
          headerTitleStyle: {
            fontSize: 18,
          },
        }} 
      />
      <ScrollView>
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${movieDetails.poster_path}` }}
          style={styles.posterImage}
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{movieDetails.title}</Text>
          <Text style={styles.releaseDate}>
            Released: {new Date(movieDetails.release_date).getFullYear()}
          </Text>
          
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={20} color={COLORS.primary} />
            <Text style={styles.rating}>
              {movieDetails.vote_average.toFixed(1)}/10
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movieDetails.overview}</Text>

          {credits?.cast && (
            <>
              <Text style={styles.sectionTitle}>Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {credits.cast.slice(0, 10).map((actor) => (
                  <View key={actor.id} style={styles.castItem}>
                    <Image
                      source={{
                        uri: actor.profile_path
                          ? `${IMAGE_BASE_URL}${actor.profile_path}`
                          : 'https://via.placeholder.com/200x300'
                      }}
                      style={styles.castImage}
                    />
                    <Text style={styles.castName}>{actor.name}</Text>
                    <Text style={styles.characterName}>{actor.character}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  releaseDate: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  rating: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginLeft: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  overview: {
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  castItem: {
    marginRight: SPACING.md,
    width: 100,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  castName: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  characterName: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default MovieDetailScreen; 