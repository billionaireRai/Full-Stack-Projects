import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  HomeCards: { data: [] }
};


const CardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setHomeCards: (state, action) => {
      // While setting state in redux collection we need to use action.payload...
      let {data} = action.payload ;
      state.HomeCards.data = action.payload.data;
    },
    SortByCate: (state, action) => {
      const { Product_Category } = action.payload;
      // Ensure HomeCards.result is an array before filtering
      if (Array.isArray(state.HomeCards.data)) {
        const filteredCards = state.HomeCards.data.filter(card => card.category === Product_Category);
        // Immutably updating the state...
        state.HomeCards.data = filteredCards;
      }
    },
    SortByRating:(state,action) => { 
      const {RatingNumber} = action.payload ;
      if (Array.isArray(state.HomeCards.data)) {
        const newcard = state.HomeCards.data.filter(card => parseFloat(card.rating) >= parseFloat(RatingNumber))
        state.HomeCards.data = newcard ; 
      }
    },
    // "$200 - $500" These kinds of data is getting sorted in below 2 reducers...
    SortByPriceRange: (state, action) => {
      const { Pricerange } = action.payload;
      let PriceArr = Pricerange.split("-");
      let lowerlimit = parseInt(PriceArr[0].substring(1).trim());
      let upperlimit = parseInt(PriceArr[1].substring(2).trim());
      state.HomeCards.data = state.HomeCards.data.filter(card => { 
        return parseInt(card.price.substring(1).trim()) >= lowerlimit && parseInt(card.price.substring(1).trim()) <= upperlimit;
      });
    },
   SortByPriceLast:(state,action) => { 
    const {PriceData} = action.payload ;
    const AcctualValue = parseInt(PriceData.substring(1)) ;
    if (Array.isArray(state.HomeCards.data)) {
     state.HomeCards.data = state.HomeCards.data.filter(card =>{ return parseInt(card.price.substring(1)) > AcctualValue })
    }
  },
  
   }
}); 

export const { SortByCate, setHomeCards , SortByRating ,SortByPriceRange ,SortByPriceLast } = CardSlice.actions;

export default CardSlice.reducer;
