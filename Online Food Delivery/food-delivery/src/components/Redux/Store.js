import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../Redux/dataSlice.js';
import cartReducer from './cartSlice.js';
import counterReducer from './counterSlice.js'

export const store = configureStore({
  reducer: {
    DataState: dataReducer,
    cartstate:cartReducer,
    counter:counterReducer
  },
});