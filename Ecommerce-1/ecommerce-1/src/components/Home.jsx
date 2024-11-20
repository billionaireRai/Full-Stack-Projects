import "./Home.css";
import "./Cards";
import React, { useState, useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { SortByCate ,setHomeCards,SortByRating ,SortByPriceRange ,SortByPriceLast } from "./redux/CardsSlice"; // Also will gona bring other reducers of this state...
import Cards from "./Cards";

const Home = () => {
  const dispatch = useDispatch() ;
  const LastValue = "$800" ;

  const [data, setdata] = useState(null);
  const [clicking1, setclicking1] = useState(false) ;
  const [clicking2, setclicking2] = useState(false) ;
  const [clicking3, setclicking3] = useState(false) ;
  const [clicking4, setclicking4] = useState(false) ;

  async function FetchData() {
    try {
      const response = await fetch("http://localhost:4000/products", {
        method: "POST",
      });
      if (response.ok) {
        const result = await response.json();
        return result; // Return the fetched data
      } else {
        console.log("Response not ok");
        return null; // or handle error case
      }
    } catch (error) {
      console.log("An error occurred in fetching data:", error);
      return null; // or handle error case
    }
  }

  // Use FetchData and setdata correctly...
  useEffect(() => {
    async function fetchDataAndSetData() {
      const result = await FetchData();
      if (result !== null) {
        setdata(result);  // Set state only if result is not null
        dispatch(setHomeCards({data:result}));
      }
    }
    fetchDataAndSetData();
  }, [dispatch]); // Renders only once dispatch changes...

  const homeCards = useSelector(state => state.card.HomeCards);
  console.log("Homecards details :",homeCards) ;

  // Function for categorywise sorting of products... 
  function CategoryClick(Product_Category) {
    setclicking1(true) ;
    // In curly braces we pust variable which is to be the BASIS of state manipulation OR action.payload in that reducer....
    dispatch(SortByCate({Product_Category : Product_Category })); 
  }

  function RatingClick(num) {
    setclicking2(true) ;
    dispatch(SortByRating({RatingNumber:num})) 
  }

  function PriceClick(range) {
    setclicking3(true) ;
    dispatch(SortByPriceRange({Pricerange:range}))
  }
  function LastPrice(Value) {
    setclicking4(true) ;
    dispatch(SortByPriceLast({PriceData:Value}))
  }

  // defining the number of cards to be generated , generating array...
  const numberOfCards = 92;
  const cardArray = Array.from({ length: numberOfCards },(_, index) => index + 1) ;

  // Array containing price range.
  const PriceRange = ["$50 - $100","$100 - $300","$300 - $400","$400 - $600","$600 - $700","$700 - $800"
  ];
  // Array of categories
  const categories = ["Electronics","Clothing and Apparel","Home and Kitchen","Health and Beauty","Books and Media","Toys and Games","Sports and Outdoors","Automotive","Jewelry and Watches","Grocery and Gourmet Food",
  ];
  return (
    <>
      <div className="main">
        <div className="Left">
          <h3>Product Categories</h3>
          <ul>
            {categories.map((category,index) => (
              <li onClick={() => (CategoryClick(category)) } key={index}> {index + 1}.{category} </li> ))} 
          </ul>
          <h3>Customer Rating</h3>
          <ul onClick={() => {RatingClick(4)}} id="Star">
            <li>
              <img src="/Images\rating.png" alt="" />
            </li>
            <li>& More Stars .</li>
          </ul>
          <h3>Price Range</h3>
          <ul className="PriceRange">
            {PriceRange.map((Range, index) => (<li onClick={() => {PriceClick(Range)}} key={index}> {Range} </li> ))}
            <li onClick={() => {LastPrice(LastValue)}}>$800 & above</li>
          </ul>
        </div>
        <div className="Right">
          <h3>Products</h3>
          {/* .map() over cardArray to generate new array and render Cards dynamically 
          {/* data[cardNumber - 1] sends each object from array as a prop...  */}
          
          {homeCards && (clicking1 || clicking2 || clicking3 || clicking4) ? ( homeCards.data.map((card,index) => (
             <Cards homeCards={card} cardId={`Card-${index + 1}`} key={index} />
          ))
          ) : (
             data && cardArray.map((cardNumber) => (
            <Cards Data={data[cardNumber - 1]} cardId={`Card-${cardNumber}`} key={cardNumber} />
          ))
      )}

        </div>
      </div>
    </>
  );
};

export default Home ;
