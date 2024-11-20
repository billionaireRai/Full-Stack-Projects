import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cartstate',
  initialState: { cartitems: [] },
  reducers: {
    addItem: (state, action) => {
      const { Item_, quantity } = action.payload;
      const is_present = state.cartitems.find((item) => item.Item_._id === Item_._id);
      if (is_present){
        is_present.quantity += quantity; // If user added same item again quantity will increase by 1 ...
      } else {
        state.cartitems.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      const { ID } = action.payload ;
      state.cartitems = state.cartitems.filter((item) => item.Item_._id !== ID) ;
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;