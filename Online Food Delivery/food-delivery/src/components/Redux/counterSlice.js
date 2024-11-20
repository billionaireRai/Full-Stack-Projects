import { createSlice } from "@reduxjs/toolkit";

// In this initialState variable we can store multiple states used in our project...
const initialState = {
  quantities: {}, // Object to store quantities for each item...
};

// Here we integrate this initialState and define manipulation functions on it...
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action) => {
      const { cardId } = action.payload;
      if (state.quantities[cardId] === undefined) {
        state.quantities[cardId] = 0; // Initialize quantity if not exists...
      }
      state.quantities[cardId] += 1;
    },
    decrement: (state, action) => {
      const { cardId } = action.payload;
      if (state.quantities[cardId] > 0) {
        state.quantities[cardId] -= 1;
      }
    },
    setQuantity: (state, action) => {
      const { cardId, quantity } = action.payload;
      state.quantities[cardId] = quantity;
    },
    ResetQuantity:(state,action) => {
      const {cardId} = action.payload ;
      state.quantities[cardId] = 0
    }
  },
});

// Action creators
export const { increment, decrement, setQuantity , ResetQuantity } = counterSlice.actions;

export default counterSlice.reducer;