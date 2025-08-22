import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define persist configurations
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user', 'navItems'], // Specify persisted reducers
};

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export default store;
