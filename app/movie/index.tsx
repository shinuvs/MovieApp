import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, RefreshControl, TextInput } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import MVChip from "../components/MVChip";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import MovieList from '../components/MovieList';
import { Movie } from '../types/movie.types';
import { COLORS, SPACING } from '../constants/theme';
import {
  useGetTrendingQuery,
  useGetPopularQuery,
  useGetTopRatedQuery,
  useGetUpcomingQuery,
  useGetNowPlayingQuery,
  useSearchMoviesQuery,
  useGetTrendingTVShowsQuery,
} from '../services/movieApi';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';

const MovieScreenContent = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedChip, setSelectedChip] = useState('Movies');

  const {
    data: trendingData,
    error: trendingError,
    isLoading: trendingLoading,
    refetch: refetchTrending
  } = useGetTrendingQuery();

  const {
    data: popularData,
    error: popularError,
    isLoading: popularLoading,
    refetch: refetchPopular
  } = useGetPopularQuery();

  const {
    data: topRatedData,
    isLoading: topRatedLoading,
    refetch: refetchTopRated
  } = useGetTopRatedQuery();

  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    refetch: refetchUpcoming
  } = useGetUpcomingQuery();

  const {
    data: nowPlayingData,
    isLoading: nowPlayingLoading,
    refetch: refetchNowPlaying
  } = useGetNowPlayingQuery();

  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useSearchMoviesQuery(debouncedQuery, { skip: !debouncedQuery });

  const {
    data: tvShowsData,
    isLoading: tvShowsLoading,
    refetch: refetchTVShows
  } = useGetTrendingTVShowsQuery();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchTrending(),
      refetchPopular(),
      refetchTopRated(),
      refetchUpcoming(),
      refetchNowPlaying(),
      refetchTVShows(),
    ]);
    setRefreshing(false);
  }, []);

  const handleMoviePress = (movie: Movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id }
    } as any);
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setDebouncedQuery(text);
    }, 500),
    []
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchQuery('');
      setDebouncedQuery('');
      debouncedSearch.cancel();
      return;
    }
    debouncedSearch(text);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const isLoading = trendingLoading || popularLoading || topRatedLoading || 
                    upcomingLoading || nowPlayingLoading || searchLoading || tvShowsLoading;
  const error = trendingError || popularError;

  const filterContent = async () => {
    switch (selectedChip) {
      case 'Movies':
        return trendingData || [];
      case 'TV Shows':
        return tvShowsData || [];
      case 'People':
        return []; // TODO: Implement people data
      case 'Favorites':
        return [];
      default:
        return trendingData || [];
    }
  };

  useEffect(() => {
    const updateFilteredContent = async () => {
      const content = await filterContent();
    };
    updateFilteredContent();
  }, [selectedChip, trendingData, tvShowsData]);

  const handleLogout = () => {
    router.replace('/login'); // Navigate to login screen
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Movies',
          headerBackVisible: false,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons 
            name="search" 
            size={20} 
            color={COLORS.text.secondary} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor={COLORS.text.secondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                handleSearch('');
              }}
              style={styles.clearButton}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={COLORS.text.secondary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.chipContainer}>
        <MVChip 
          label="Movies" 
          selected={selectedChip === 'Movies'}
          onPress={() => setSelectedChip('Movies')}
        />
        <MVChip 
          label="TV Shows" 
          selected={selectedChip === 'TV Shows'}
          onPress={() => setSelectedChip('TV Shows')}
        />
        <MVChip 
          label="People" 
          selected={selectedChip === 'People'}
          onPress={() => setSelectedChip('People')}
        />
        <MVChip 
          label="Favorites" 
          selected={selectedChip === 'Favorites'}
          onPress={() => router.push('/movie/favorites')}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : debouncedQuery ? (
        <GestureHandlerRootView>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollViewContent}
          >
            {searchResults && searchResults.length > 0 ? (
              <MovieList
                title="Search Results"
                data={searchResults}
                onMoviePress={handleMoviePress}
              />
            ) : (
              <View style={styles.centerContainer}>
                <Text style={styles.noResultsText}>No results found</Text>
              </View>
            )}
          </ScrollView>
        </GestureHandlerRootView>
      ) : (
        <GestureHandlerRootView>
          <ScrollView
            horizontal={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollViewContent}
          >
            {selectedChip === 'TV Shows' ? (
              tvShowsData && (
                <MovieList
                  title="Trending TV Shows"
                  data={tvShowsData}
                  onMoviePress={handleMoviePress}
                />
              )
            ) : (
              <>
                {trendingData && (
                  <MovieList
                    title="Trending"
                    data={trendingData}
                    onMoviePress={handleMoviePress}
                  />
                )}
                {popularData && (
                  <MovieList
                    title="Popular"
                    data={popularData}
                    onMoviePress={handleMoviePress}
                  />
                )}
                {topRatedData && (
                  <MovieList
                    title="Top Rated"
                    data={topRatedData}
                    onMoviePress={handleMoviePress}
                  />
                )}
                {upcomingData && (
                  <MovieList
                    title="Upcoming"
                    data={upcomingData}
                    onMoviePress={handleMoviePress}
                  />
                )}
                {nowPlayingData && (
                  <MovieList
                    title="Now Playing"
                    data={nowPlayingData}
                    onMoviePress={handleMoviePress}
                  />
                )}
              </>
            )}
          </ScrollView>
        </GestureHandlerRootView>
      )}
    </View>
  );
};

export default MovieScreenContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  chipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.xs,
  },
  retryText: {
    color: COLORS.background.primary,
    fontSize: 16,
  },
  scrollViewContent: {
    paddingBottom: SPACING.lg,
  },
  searchContainer: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    padding: SPACING.sm,
    color: COLORS.text.primary,
    fontSize: 16,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  logoutButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});