import "./Cart.css";
import React, { useState , useEffect , useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "./Redux/cartSlice";
import { useNavigate } from "react-router-dom";
import {setQuantity,increment,decrement} from "./Redux/counterSlice";
import { useForm } from "react-hook-form";


const Cart = () => { 
  const navigate = useNavigate();
  const Percent_off = useRef(0);  // This value will be used to reduce total cost...
  const dispatch = useDispatch();
  const cartitems = useSelector((state) => state.cartstate.cartitems);

  // setting quantity of cartitem in redux state for manipulation...
  useEffect(() =>  {
    async function fix_Quant() {
      await cartitems.forEach(element => { dispatch(setQuantity({cardId:element.Item_._id , quantity:element.quantity})) ;
      console.log(`Dispatching setQuantity with ID: ${element.Item_._id} and Quantity: ${element.quantity}`) ;
      })
    }
    fix_Quant() ;
  }, [cartitems,dispatch])
   
  const quantities = useSelector((state) =>  state.counter.quantities ) ;
  // console.log(quantities);  {66b2e5afc7c63733c8b3eb08: 1} It is of this format...

  let final_cost = cartitems.reduce((acc, item) => {
    let quantity = quantities[item.Item_._id] || item.quantity ; // Use quantity from Redux state or default to 0...
    if (isNaN(quantity)) {
      console.error('Invalid Quantity:', item.Item_.Price, quantity);
    }
    return acc + item.Item_.Price * quantity;
  }, 0).toFixed(2) ;
  
  
  const coupenForm = { ...useForm() }; // Spread the useForm hook (assuming it's from a form library)
  const SubmitCoupen = async (coupen) => { 
    const response = await fetch("http://localhost:4000/coupencheck", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(coupen),
    });
  
    if (response.ok) {
      const responseBody = await response.json(); // Make sure to parse the JSON response
      Percent_off.current = responseBody; // Update the ref with the response
      console.log(`The response status: ${response.status} and value: ${response.statusText}`);
      alert("CouponCode is successsfully Applied....");
    } else {
      alert("Invalid coupencode entered... ")
      console.log(`Error status: ${response.status} and ${response.statusText}`);
    }
  };
  

  const [showcart, setshowcart] = useState(false);
  const [prevdot, setprevdot] = useState("");

  // Effect to handle cart visibility
  useEffect(() => {
    if (cartitems.length !== 0) { setshowcart(true); } 
    else {  setshowcart(false);  }
  }, [cartitems]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setprevdot((prevdot) => {
        if (prevdot.endsWith(".....")) {
          return "";
        } else {
          return prevdot + ".";
        }
      });
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {!showcart ? (
        <div className="Wrapper">
          <div id="Box">
            <div id="Top">Your Cart Is currently Empty !!!</div>
            <span id="Low">Please Add Some Items To Cart{prevdot}</span>
          </div>
        </div>
      ) : (
        <div className="main_body">
          <div className="LEFT">
            <nav>
              <ul>
                <li>Food Cart{prevdot}</li>
                <li>Price</li>
              </ul>
            </nav>
            {/* Acctually when we bring state from Redux Store and render it dynamically => (item.Item_.) like this...*/}
           {cartitems.map((item, index) => {
            const quantity = quantities[item.Item_._id] || item.quantity;
            return (
              <div key={index} className="product">
                <img src={item.Item_.Image_Url} alt={item.Item_.Name} />
                <div className="details">
                  <ul>
                    <li><span>{item.Item_.Name}</span></li>
                    <li><span>${item.Item_.Price}</span></li>
                  </ul>
                  <div className="my_grid">
                    <div style={{ color: "orange" }}>{item.Item_.Availability_status}</div>
                    <div id="RRR">
                      Rating - <span>{item.Item_.Rating}</span>
                      <svg width="20" height="20" fill="none" role="img" aria-hidden="true">
                        <circle cx="10" cy="10" r="9" fill="url(#StoreRating20_svg__paint0_linear_32982_71567)"></circle>
                        <path d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z" fill="white"></path>
                        <defs>
                          <linearGradient id="StoreRating20_svg__paint0_linear_32982_71567" x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#21973B"></stop>
                            <stop offset="1" stopColor="#128540"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div>Prep_Time : {item.Item_.Preparation_time}</div>
                    <div>{item.Item_.Restaurant_name}</div>
                    <div>
                      <button onClick={() => {dispatch(increment({cardId:item.Item_._id}))}} id="plus" type="button"> +</button>{" "}
                      {quantity}{" "}
                      <button onClick={() => {dispatch(decrement({cardId:item.Item_._id}))}} id="minus" type="button">-</button>
                    </div>
                    <div>Item-Cost : ${(quantity * item.Item_.Price).toFixed(2)}{" "}</div>
                  </div>
                  <ul id="btns">
                    <li><button onClick={() => { dispatch(removeItem({ID:item.Item_._id})); }} type="button"> Remove From Cart</button></li>
                    <li><button type="button">Save For Later</button></li>
                  </ul>
                </div>
                        </div>
            );
          })}
          </div>
          <div className="Right">
            <div className="right_top">
            <h3>
                Subtotal ({cartitems.length} Items) : <span id="org">${(final_cost - (final_cost * (Percent_off.current/100))).toFixed(2)}</span> /- 
            </h3>
              <form id="coupenForm" onSubmit={coupenForm.handleSubmit(SubmitCoupen)} action="" method="post">
                <label htmlFor="coupen">Coupen-Code : </label>
                <input {...coupenForm.register('coupenCode',{required:true , message:'Neccessary for applying coupencode...'})} type="text" placeholder="Enter CoupenCode (If You Have)"/>
                {coupenForm.formState.errors.coupenCode && (<div className='Red'>{coupenForm.formState.errors.coupenCode.message}</div>) }
              </form>
              <ul id="btns_2">
                {/* Targeting this button for above form by id... */}
                <li><button form="coupenForm" type="submit">Apply CoupenCode</button></li>
                <li><button onClick={() => { navigate('/Payment',{state:{FoodAdded:[cartitems],final_cost:final_cost}})}}> Proceed To Payment <img id="IMG" height="10px" width="10px" src={`${process.env.PUBLIC_URL}/next.png`} alt="Filter"/></button></li>
              </ul>
            </div>
            <div className="right_bottom">
              <h3 id="org">Benefits of ordering from Twiggy</h3>
              <ul>
                <li>Fast 30 minutes Delivery</li>
                <li>You get Well Monitered Food Delivery </li>
                <li>Variety of Discount offers</li>
                <li>Partnershiped with Top food-chain brand in your City</li>
                <li>Many More{prevdot}</li>
              </ul>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
