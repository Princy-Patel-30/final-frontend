import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/Auth.Slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
