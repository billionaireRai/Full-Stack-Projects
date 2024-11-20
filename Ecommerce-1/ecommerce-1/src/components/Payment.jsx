import "./Payment.css";
import React,{useState} from "react";
import { useNavigate , useLocation } from "react-router-dom";
import {useForm} from "react-hook-form";
import { useSelector,useDispatch } from "react-redux";
import {clearCart} from './redux/cartSlice'
import {ResetQuantity} from './redux/counterSlice'

const Payment = () => {
  const location = useLocation(); 
  const dispatch = useDispatch() ;
  const CustomerName = 'Customer-Name' ;

  const homeCards = useSelector(state => state.card.HomeCards);
  const cartItems = useSelector(state => state.cart.items) ;
  
  const PaymentForm = useForm() ;  // Will use it later for form submission...
  const navigate = useNavigate() ; // Will use it later on payment getting successfull...

  const totalquantity = location.state?.totalquantity ;

  const [name1, setname1] = useState("ENTER YOUR CARD NUMBER")
  const [name2, setname2] = useState("MM/DD/YYYY")
  const [name3, setname3] = useState("CVV CODE")
  const [name4, setname4] = useState("NAME ON THE CARD")

  /* The optional chaining ensures that if state is null or undefined, the expression will short-circuit and 
  return undefined without throwing an error.*/
  const totalCost = location.state?.totalCost;

  function Delay(t) {
    return new Promise((resolve) => { 
      setTimeout(() => {
        resolve()
      }, t * 1000);
     })
  }
  async function PaymentSubmit(PaymentDetails) {
    const updatedPaymentDetails = {
      ...PaymentDetails,
      Amount: totalCost // Assuming totalCost is defined and retrieved correctly
    };
    // Making a post request to the server...
    try {
      await Delay(3) ;
      const response = await fetch('http://localhost:4000/PaymentDetails',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(updatedPaymentDetails)
      })  
      if (response.ok) {
        const result = await response.json() ;
        console.log('Payment is successfully Done :',result) ;
        alert("Payment Is successfully Done");
        dispatch(clearCart()) ;
        dispatch(ResetQuantity({cardId:homeCards.data.cardId})) ;
        navigate('/Home');
      } else {
        console.log('requests response is not ok...')
      }
    } 
    catch (error) {
      console.log(`Error occurred in making request - ${error.status}`, error);
    }    
  }
  return (
    <div className="main_card">
      <div className="upper">
        <div id="Visa">
          <img src="https://www.freepnglogos.com/uploads/visa-logo-download-png-21.png" alt=""/>
          <ul>
            <li>**** **** **** 1060</li>
            <li>Expiry date :10/16  </li>
            <li>Name : {CustomerName} </li>
          </ul>
        </div>
        <div id="Mastercard">
          <img src="https://www.freepnglogos.com/uploads/mastercard-png/file-mastercard-logo-svg-wikimedia-commons-4.png" alt=""/>
          <ul>
            <li>**** **** **** 1060</li>
            <li>Expiry date :10/16  </li>
            <li>Name : {CustomerName} </li>
          </ul>

        </div>
        <div id="Discover">
          <img src="https://www.freepnglogos.com/uploads/discover-png-logo/credit-cards-discover-png-logo-4.png" alt=""/>
          <ul>
            <li>**** **** **** 1060</li>
            <li>Expiry date : 10/16  </li>
            <li>Name : {CustomerName} </li>
          </ul>

        </div>
      </div>
      <div className="lower">
        <form onSubmit={PaymentForm.handleSubmit(PaymentSubmit)} action="" method="post">
          <div className="Head">Payment Methods</div>
          <div className="main_sec">
            <div className="Head">PayPal</div>
            <ul>
              <li><strong>Summary</strong></li>
              <li>Product-Categories : <b>{cartItems.length}</b></li>
              <li>Quantity Of Products: <b>{totalquantity}</b></li>
              <li>Price/Amount : <b>$ {totalCost} /-</b></li>
              <li>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur quas, id a soluta illum minus laboriosam. Provident sint officia obcaecati eligendi veniam omnis sit repellendus fugiat reprehenderit voluptatum numquam tempora, recusandae dicta dignissimos expedita est?</p>
              </li>
            </ul>
            <div className="Information">
               <input onChange={(e) => { setname1(e.target.value) }} placeholder={name1} type="number" {...PaymentForm.register('card_number',{required:true , message:'This feild is essential for card recognition...'})} />
               {PaymentForm.formState.errors.card_number && (
                  <div className="red">{PaymentForm.formState.errors.card_number.message}</div>)}
               <input onChange={(e) => { setname2(e.target.value) }} placeholder={name2} type="date" {...PaymentForm.register('expiry_date',{required:true , message:'This feild is important for your past score...'})} />
               {PaymentForm.formState.errors.expiry_date && (
                  <div className="red">{PaymentForm.formState.errors.expiry_date.message}</div>)}
               <input onChange={(e) => { setname3(e.target.value) }} placeholder={name3} type="text" {...PaymentForm.register('cvv_code',{
                required:true , messsage:'This feild is for accessing your account...'})}/>
               {PaymentForm.formState.errors.cvv_code && (
                  <div className="red">{PaymentForm.formState.errors.cvv_code.message}</div>)}
               <input onChange={(e) => { setname4(e.target.value) }} placeholder={name4} type="text" {...PaymentForm.register('card_name',{
                required:true , message:'This feild is not identifying Bank...'})}/>
                {PaymentForm.formState.errors.card_name && (
                  <div className="red">{PaymentForm.formState.errors.card_name.message}</div>)}
               <button id="SUBMIT_BTN"  type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
