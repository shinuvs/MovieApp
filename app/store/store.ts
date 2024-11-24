import { configureStore } from '@reduxjs/toolkit';
import { movieApi } from '../services/movieApi';

export const store = configureStore({
  reducer: {
    [movieApi.reducerPath]: movieApi.reducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 