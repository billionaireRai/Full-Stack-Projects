import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice'; // Assuming these are in the same directory
import cartReducer from './cartSlice'; // Assuming these are in the same directory
import cardReducer from './CardsSlice'; // Assuming these are in the same directory

export default configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    card:cardReducer
  },
});
