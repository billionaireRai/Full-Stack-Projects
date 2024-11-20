import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const dataSlice = createSlice({
    name: "DataState",
    initialState,
    reducers: {
        updateData: (state, action) => {
            const { NewData } = action.payload;
            state.data = NewData;
        },
        DeliverySort: (state, action) => {
            const { Time } = action.payload;
            const maxTime = parseInt(Time, 10);  // Convert the time to an integer for comparison...
            // Filter data based on preparation time...
            state.data = state.data.filter(item => {
                // Extract numeric part from "32 Minutes" using a regular expression
                const preparationTimeMatch = item.Preparation_time.match(/(\d+)/); 
                const preparationTime = preparationTimeMatch ? parseInt(preparationTimeMatch[1], 10) : NaN;

                return !isNaN(preparationTime) && preparationTime <= maxTime;
            });
        },
        NewItemSort:(state,action) => { 
            const { offer } = action.payload ;
            const maxOffer = parseInt(offer, 10); 
            state.data = state.data.filter(item => {
                const matching = item.Discounts_offers.match(/(\d+)/) ;
                const value = matching ? parseInt(matching[1],10) : NaN ;

                return !isNaN(value) && value <= maxOffer ;
         })
        },
        LowFatSort:(state,action) => { 
            const { Fatlimit } = action.payload ;
            const maxFat = parseInt(Fatlimit, 10) ;
            state.data = state.data.filter(item => {
                const Term = String(item.Nutritional_information.fat_content);
                const value = parseFloat(Term.substring(0,Term.length-1));
                return value <= maxFat ;
            })
         },
        RatingSort:(state,action) => { 
            state.data = state.data.filter((item) => { 
                const rating = item.Rating;
                return rating >= 4 ;
             })
            },
        PriceSorting: (state, action) => {
                const { PriceStr } = action.payload;
            
                // Function to handle single price filtering...
                const filterBySinglePrice = (singlePrice) => {
                    const price = parseInt(singlePrice, 10);
                    if (!isNaN(price)) {
                        state.data = state.data.filter(item => item.Price <= price);
                    } else {
                        console.error("Invalid single price format");
                    }
                };
            
                // Function to handle price range filtering...
                const filterByPriceRange = (rangeStr) => {
                    const lower = parseInt(rangeStr.split('-')[0].trim().substring(1));
                    const upper = parseInt(rangeStr.split('-')[1].trim().substring(1));
                    if (!isNaN(lower) && !isNaN(upper)) {
                        state.data = state.data.filter(item => item.Price >= lower && item.Price <= upper);
                    } else {
                        console.error("Invalid range format");
                        
                    }
                };
            
                // Function to handle 'Above' price filtering
                const filterByAbovePrice = (minPrice) => {
                    const price = parseInt(minPrice, 10);
                    if (!isNaN(price)) {
                        state.data = state.data.filter(item => item.Price > price);
                    } else {
                        console.error("Invalid 'Above' price format");
                        
                    }
                };

                // Main logic to trigger the filtering based on PriceStr...
                if (PriceStr.includes('$')) {
                    if (PriceStr.startsWith('Above $')) {
                        const minPrice = PriceStr.replace('Above $', '').trim();
                        filterByAbovePrice(minPrice);
                    } else {
                        const priceRange = PriceStr.replace('$', '').trim();
                        const rangeParts = priceRange.split('-');
                        if (rangeParts.length === 1) {
                            filterBySinglePrice(rangeParts[0]);
                        } else if (rangeParts.length === 2) {
                            filterByPriceRange(priceRange);
                        } else {
                            console.error("Invalid price range format");
                            
                        }
                    }
                } else {
                    // Handle the case where PriceStr does not include '$'
                    filterBySinglePrice(PriceStr);
             }
            } 
        },
});

// Action creators
export const { updateData, DeliverySort , NewItemSort ,LowFatSort , RatingSort ,PriceSorting } = dataSlice.actions;

export default dataSlice.reducer;
