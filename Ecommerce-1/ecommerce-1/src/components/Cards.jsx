import React from 'react';
import './Cards.css';
import {useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from './redux/cartSlice';
import { decrement, increment } from './redux/counterSlice';
import { v4 as uuidv4 } from 'uuid';

const Cards = ({cardId ,Data,homeCards}) => {
  const quantity = useSelector((state) => state.counter.quantities[cardId] || 0);
  const dispatch = useDispatch() ;
  const navigate = useNavigate() ;

  const handleBUY = () => {
    // Redirect logic to payment gateway...
    navigate('/Payment');
  };

  const handleADDCART = () => {
    // Dispatch add item action based on the source of Data
    const itemData = homeCards ? homeCards : Data;
    dispatch(addItem({ cardId, Data: itemData, quantity }));
    alert('Item is added to cart...');
    // navigate('/Cart', { state: { quantity } }) sends the quantity as part of the route state.
    navigate('/Cart',{state:{quantity}})
  };

  return (
    <div className="card" id={cardId}>
      { (
        <>
          <img src={homeCards ? homeCards.image_link : Data.image_link} alt="" />
          <div>
            <li>PRODUCT CATEGORY : {homeCards ? homeCards.category : Data.category}</li>
            <li>PRODUCT NAME: {homeCards ? homeCards.name: Data.name}</li>
            <li>PRICE: {homeCards ? homeCards.price : Data.price}</li>
            <li>DELIVERY COST: {homeCards ? homeCards.delivery_cost : Data.delivery_cost}</li>
            <li>RATING: {homeCards ? homeCards.rating : Data.rating}</li>
            <li>REVIEW: <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa quisquam fugiat velit qui deleniti incidunt!</p></li>
          </div>
          <ul>
            <button onClick={handleBUY} className="buy-button" type="button">Buy Now</button>
            <button onClick={handleADDCART} className="cart-button" type="button">Add To Cart</button>
            <div id={uuidv4()} className="quantity">
              <h4>Quantity</h4>
              <button onClick={() => dispatch(increment({ cardId }))} type="button">+</button>
              <span>{quantity}</span>
              <button onClick={() => dispatch(decrement({ cardId }))} type="button">-</button>
            </div>
          </ul>
        </>
      )}
    </div>
  );
};

export default Cards;
