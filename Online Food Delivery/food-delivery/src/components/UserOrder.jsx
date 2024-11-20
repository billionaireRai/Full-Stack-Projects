import './UserOrder.css';
import React,{useCallback, useState,useEffect} from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { addItem } from './Redux/cartSlice.js';
import { useForm } from 'react-hook-form';
import { AuthUser } from '../AuthContext.js';
import { usePaymentStatus } from '../PaymentContext.js';

const UserOrder = () => {
  const { isAuth } = AuthUser();
  const { paymentstatus } = usePaymentStatus();
  const dispatch = useDispatch();
  const cartitems = useSelector((state) => state.cartstate.cartitems);
  const reviewForm = useForm() ;
  const [DOT, setDOT] = useState('.');
  const [window, setwindow] = useState('AO'); 
  const [intype, setintype] = useState('Director'); // Selected time-frame...
  
  useEffect(() => {
    const DotInterval = setInterval(() => {
      setDOT(prevdot => (prevdot.endsWith('....') ? '' : prevdot + '.'));
    }, 300);
    return () => clearInterval(DotInterval);
  }, []);


  useEffect(() => {
    // I will sort the orders according to the date...
  }, [intype])
  
  const Function_Target_Nav = useCallback( async (e) => { 
    // removing color from each li item...
    var collection = document.getElementById('opt').querySelectorAll('li');
    collection.forEach((Each_li) => { Each_li.style.color = 'white' });
    // applying color now...
    var Target = e.target;
    Target.style.color = "orange";
    setwindow(Target.id); // updating the state with the new window id...
    // further adding the scrolling functionality...
    var window_elemt = document.querySelector(`.MainSection > div.${Target.id}`);
    window_elemt.scrollIntoView({behavior:'smooth'});
  },[window]);
   
  const reviewSubmitFunc = async (data) => { 
    const resPo = await fetch("http://localhost:4000/submit-review",{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    }) 
    if (resPo.ok) {
      alert("Your Review is successfully submitted...");
    }
  }
  return (
    <div className='WrapperTag'>
      {!isAuth ? (
        <div className="Wrapper">
          <div id="Box_2">
            <div id="Top">Your Orders History Is Not Available</div>
            <span id="Low">Please either LogIn / Make New Order...</span>
          </div>
        </div>
      ) : (
        <>
        <div id='toportion'><h2>Your Order Details</h2>
           <div className='searchBar'><input type="text" placeholder='Search Your Order...' /><button>Search Order</button></div>
        </div>
        <div className='Nav_options'>
          <ul id='opt'>
            <li onClick={Function_Target_Nav} id="AO">All Orders</li>
            <li onClick={Function_Target_Nav} id="NYS">Not Yet Shipped</li>
            <li onClick={Function_Target_Nav} id="CO">Cancelled Orders</li>
            <li onClick={Function_Target_Nav} id="SI">Saved Items</li>
          </ul>
          <div className='MainSection'> 
            <div className="AO">
              <span ><strong><b>5 Orders</b></strong> Placed in </span>
              <select value={intype} onChange={(e) => { setintype(e.target.value) }}>
                 <option value="Director" disabled >Select Your Prefered Time-Frame</option>
                 <option value='Time_Frame_1'>2 Weeks Ago</option>
                 <option value='Time_Frame_2'>3 Weeks Ago</option>
                 <option value='Time_Frame_3'>1 Month Ago</option>
                 <option value='Time_Frame_4'>3 Month Ago</option>
                 <option value='Time_Frame_5'>5 Month Ago</option>
                 <option value='Time_Frame_6'>8 Month Ago</option>
                 <option value='Time_Frame_7'>10 Month Ago</option>
                 <option value='Time_Frame_8'>1 Year Ago</option>
                 <option value='Time_Frame_9'>2 Year Ago</option>
                 <option value='Time_Frame_10'>3 Year Ago</option>
              </select>
              <hr />
              { paymentstatus && cartitems.map((item, index) => (
                <main id='MN'>
                   <div key={index}>
                     <div id='TopSec'>
                       <ul>
                         <li>ORDER PLACED ON : <strong>{item.orderDate}</strong></li>
                         <li>TOTAL COST : <strong>${item.totalCost} /-</strong></li>
                         <li>SHIPPED ADDRESS : <strong>{item.shippedAddress}</strong></li>
                         <li>ORDER ID :<strong>{item.orderId}</strong></li>
                         <li><strong><button>View Invoice</button></strong></li>
                       </ul>
                     </div>
                     <section id='Det'>
                       <img src="../images/Burger.png"/>
                       <span>
                         <li>Product Name : <strong>{item.productName}</strong></li>
                         <li>Product Cost : <strong>${item.productCost} /-</strong></li>
                         <li>Rating : <strong>{item.rating}</strong></li>
                         <li>Restraunt : <strong>{item.restraunt}</strong></li>
                       </span>
                       <span>
                         <form id='RF' ref={reviewForm} method="post">
                           <input placeholder={`Enter Your review about this product${DOT}`} {...reviewForm.register('data')} ></input>
                         </form>
                         <button type="submit" onClick={reviewForm.handleSubmit(reviewSubmitFunc)} >Submit Review</button></span>
                       <span id="Buttonss">
                         <li><strong><button>Buy It Again</button></strong></li>
                         <li><strong><button onClick={() => {dispatch(addItem({quantity:1}))}}>Add To Cart</button></strong></li>
                       </span>
                     </section>
                   </div>
                </main>
              ))}
            </div>
            <div className="NYS">
              <span><strong><b>1 Orders</b> </strong>is yet to be shipped{DOT}</span>
              {/* Will change the dynamic population for respective food categories... */}
              { paymentstatus && cartitems.map((item, index) => (
              <main id='MN'>
                   <div key={index}>
                     <div id='TopSec'>
                       <ul>
                         <li>ORDER PLACED ON : <strong>{item.orderDate}</strong></li>
                         <li>TOTAL COST : <strong>${item.totalCost} /-</strong></li>
                         <li>SHIPPED ADDRESS : <strong>{item.shippedAddress}</strong></li>
                         <li>ORDER ID :<strong>{item.orderId}</strong></li>
                         <li><strong><button>View Invoice</button></strong></li>
                       </ul>
                     </div>
                     <section id='Det'>
                       <img src="../images/Burger.png"/>
                       <span>
                         <li>Product Name : <strong>{item.productName}</strong></li>
                         <li>Product Cost : <strong>${item.productCost} /-</strong></li>
                         <li>Rating : <strong>{item.rating}</strong></li>
                         <li>Restraunt : <strong>{item.restraunt}</strong></li>
                       </span>
                       <span>
                         <form id='RF' ref={reviewForm} method="post">
                           <input placeholder={`Enter Your review about this product${DOT}`} {...reviewForm.register('data')} ></input>
                         </form>
                         <button type="submit" onClick={reviewForm.handleSubmit(reviewSubmitFunc)} >Submit Review</button></span>
                       <span id="Buttonss">
                         <li><strong><button>Buy It Again</button></strong></li>
                         <li><strong><button onClick={() => {dispatch(addItem({quantity:1}))}}>Add To Cart</button></strong></li>
                       </span>
                     </section>
                   </div>
                </main>
              ))}
            </div>
            <div className="CO">
              <span><strong><b>0 Orders</b> </strong>are cancelled yet</span>
              { paymentstatus && cartitems.map((item, index) => (
              <main id='MN'>
                   <div key={index}>
                     <div id='TopSec'>
                       <ul>
                         <li>ORDER PLACED ON : <strong>{item.orderDate}</strong></li>
                         <li>TOTAL COST : <strong>${item.totalCost} /-</strong></li>
                         <li>SHIPPED ADDRESS : <strong>{item.shippedAddress}</strong></li>
                         <li>ORDER ID :<strong>{item.orderId}</strong></li>
                         <li><strong><button>View Invoice</button></strong></li>
                       </ul>
                     </div>
                     <section id='Det'>
                       <img src="../images/Burger.png"/>
                       <span>
                         <li>Product Name : <strong>{item.productName}</strong></li>
                         <li>Product Cost : <strong>${item.productCost} /-</strong></li>
                         <li>Rating : <strong>{item.rating}</strong></li>
                         <li>Restraunt : <strong>{item.restraunt}</strong></li>
                       </span>
                       <span>
                         <form id='RF' ref={reviewForm} method="post">
                           <input placeholder={`Enter Your review about this product${DOT}`} {...reviewForm.register('data')} ></input>
                         </form>
                         <button type="submit" onClick={reviewForm.handleSubmit(reviewSubmitFunc)} >Submit Review</button></span>
                       <span id="Buttonss">
                         <li><strong><button>Buy It Again</button></strong></li>
                         <li><strong><button onClick={() => {dispatch(addItem({quantity:1}))}}>Add To Cart</button></strong></li>
                       </span>
                     </section>
                   </div>
                </main>
              ))}
            </div>
            <div className="SI">
              <span><strong><b>3 Items</b> </strong>are Saved for later</span>
              { paymentstatus && cartitems.map((item, index) => (
              <main id='MN'>
                   <div key={index}>
                     <div id='TopSec'>
                       <ul>
                         <li>ORDER PLACED ON : <strong>{item.orderDate}</strong></li>
                         <li>TOTAL COST : <strong>${item.totalCost} /-</strong></li>
                         <li>SHIPPED ADDRESS : <strong>{item.shippedAddress}</strong></li>
                         <li>ORDER ID :<strong>{item.orderId}</strong></li>
                         <li><strong><button>View Invoice</button></strong></li>
                       </ul>
                     </div>
                     <section id='Det'>
                       <img src="../images/Burger.png"/>
                       <span>
                         <li>Product Name : <strong>{item.productName}</strong></li>
                         <li>Product Cost : <strong>${item.productCost} /-</strong></li>
                         <li>Rating : <strong>{item.rating}</strong></li>
                         <li>Restraunt : <strong>{item.restraunt}</strong></li>
                       </span>
                       <span>
                         <form id='RF' ref={reviewForm} method="post">
                           <input placeholder={`Enter Your review about this product${DOT}`} {...reviewForm.register('data')} ></input>
                         </form>
                         <button type="submit" onClick={reviewForm.handleSubmit(reviewSubmitFunc)} >Submit Review</button></span>
                       <span id="Buttonss">
                         <li><strong><button>Buy It Again</button></strong></li>
                         <li><strong><button onClick={() => {dispatch(addItem({quantity:1}))}}>Add To Cart</button></strong></li>
                       </span>
                     </section>
                   </div>
                </main>
              ))}
            </div>
          </div>
        </div>
        </>

      )
      }
    </div>
  )
}

export default UserOrder;
