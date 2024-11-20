import React from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from './redux/cartSlice';
import { useNavigate, useLocation } from "react-router-dom";

const Cart = () => {
  const homeCards = useSelector(state => state.card.HomeCards)
  const cartItems = useSelector((state) => state.cart.items);
  console.log(cartItems)
  // const homeCards = useSelector((state) => state.card.HomeCards.data)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;
  const quantity = state?.quantity || 0; // Default to 0 if state.quantity is undefined

  // Calculate total cost of all items in the cart
  let totalCost = 0 ; 
  cartItems.forEach((item) => {
    const itemPrice =  parseInt(item.Data.price.substring(1) ) ;
    const deliveryCost = parseInt(item.Data.delivery_cost.substring(1)) ;   
    const gst = Math.ceil((3 / 100) * quantity * itemPrice);
    const itemTotalCost = Math.floor(quantity * itemPrice + deliveryCost + gst);
    totalCost += itemTotalCost;
  });

  return (
    <div className="Main">
      <h2>Your Shopping Cart</h2>
      {cartItems.map((item) => (
        <div className="card" key={item.cardId}>
          <img src={item.Data.image_link} alt="" />
          <div>
             <ul>
                 <li><strong>PRODUCT CATEGORY :</strong> {item.Data.category}</li>
                 <li><strong>PRODUCT NAME:</strong> {item.Data.name}</li>
                 <li><strong>PRICE:</strong> {item.Data.price}</li>
                 <li><strong>DELIVERY COST:</strong> {item.Data.delivery_cost}</li>
                 <li><strong>RATING:</strong> {item.Data.rating}</li>
             </ul>
          </div>
          <div className="Each">
            <div>
              <span><h2>COST: ${quantity * parseInt(item.Data.price.substring(1))} /-</h2></span>
              <span><h2>DELIVERY COST: ${quantity === 0 ? 0 : Math.floor(parseInt(item.Data.delivery_cost.substring(1)) / quantity)} /-</h2></span>
              <span><h2>GST: ${Math.ceil((3 / 100) * quantity * parseInt(item.Data.price.substring(1)))} /-</h2></span>
              <span className="Final_cost">
                <h2>
                  TOTAL COST: ${
                    quantity === 0 ? 0
                      : (
                          quantity * parseInt(item.Data.price.substring(1)) +
                          parseInt(item.Data.delivery_cost.substring(1)) +
                          (3 / 100) * quantity * parseInt(item.Data.price.substring(1))
                        )
                  } /-
                </h2>
              </span>
            </div>
            <button onClick={() => { dispatch(removeItem(item))}} type="button">Remove From Cart</button>
          </div>
        </div>
      ))}
      {cartItems.length === 0 && (<div id="cartext"> No Items are there in your cart... </div>)}
      {cartItems.length !== 0 && (<div id="lastdiv">FINAL-COST  :  ${totalCost} /-</div>)}
      {cartItems.length !== 0 && (
        <button onClick={() => navigate('/Payment', { state: { totalCost: totalCost, totalquantity: quantity } })} className="Payment" type="button">Go To Payment Section</button>
      )}
    </div>
  );
};

export default Cart;
