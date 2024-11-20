// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []  // Array to hold cart items...
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);  // Add item to cart
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.cardId !== action.payload.cardId);  // Remove item from cart
    },
    clearCart: (state) => {
      state.items = [];  // Clear all items from cart
    }
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
