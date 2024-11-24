import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Movie, MovieDetails, MovieCredits } from '../types/movie.types';
import { API_BASE_URL, API_KEY } from '../constants/api';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${API_KEY}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrending: builder.query<Movie[], void>({
      query: () => 'trending/movie/week',
      transformResponse: (response: { results: Movie[] }) => response.results,
    }),
    getPopular: builder.query<Movie[], void>({
      query: () => 'movie/popular',
      transformResponse: (response: { results: Movie[] }) => response.results,
    }),
    getTopRated: builder.query<Movie[], void>({
      query: () => 'movie/top_rated',
      transformResponse: (response: { results: Movie[] }) => response.results,
    }),
    getUpcoming: builder.query<Movie[], void>({
      query: () => 'movie/upcoming',
      transformResponse: (response: { results: Movie[] }) => response.results,
    }),
    getNowPlaying: builder.query<Movie[], void>({
      query: () => 'movie/now_playing',
      transformResponse: (response: { results: Movie[] }) => response.results,
    }),
    getMovieDetails: builder.query<MovieDetails, string>({
      query: (movieId) => `movie/${movieId}?api_key=${API_KEY}`,
    }),
    getMovieCredits: builder.query<MovieCredits, string>({
      query: (movieId) => `movie/${movieId}/credits?api_key=${API_KEY}`,
    }),
    searchMovies: builder.query<Movie[], string>({
      query: (query) => ({
        url: '/search/movie',
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1
        }
      }),
      transformResponse: (response: any) => response.results,
    }),
    getTrendingTVShows: builder.query<Movie[], void>({
      query: () => `trending/tv/day?api_key=${API_KEY}`,
      transformResponse: (response: { results: Movie[] }) => response.results,
    }),
  }),
});

export const {
  useGetTrendingQuery,
  useGetPopularQuery,
  useGetTopRatedQuery,
  useGetUpcomingQuery,
  useGetNowPlayingQuery,
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useSearchMoviesQuery,
  useGetTrendingTVShowsQuery,
} = movieApi; 