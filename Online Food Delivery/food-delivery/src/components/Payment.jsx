import './Payment.css' ;
import React,{useRef,useCallback,useState} from 'react' ;
import {useNavigate,useLocation} from 'react-router-dom' ;
import { useForm } from 'react-hook-form';
import { usePaymentStatus } from '../PaymentContext.js';

const Payment = () => {
  const { setPaymentStatus } = usePaymentStatus() ;
  const navigate = useNavigate(); // after successfull payment completion we will redirect the user to HOME page...
  const location = useLocation();
  const { state } = location; // destructuring the state variable coming...
  const { FoodAdded, final_cost, item} = state || { FoodAdded: [], final_cost: 0, item: {} };
  console.log(typeof item , item);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // state for storing choosen payment method...
  const CardForm = useForm();
  const finalCost = final_cost || item.Price ;
    const PaymentMethod = ["CashOnDelivery.png","PaytmPay.Png","PhonePay.png","AmazonPay.png","GooglePay.png","MasterCardPay.png","VisaPay.png","PayPal.png"];
    const scrollRef1 = useRef(null);

    const delay = (t) => { 
      return new Promise((resolve) => setTimeout(resolve, t));
     }
// useCallback() memoizes the function accross rerenders...
  const handleScroll = useCallback((ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  }, []);

  const handlePreviousScroll = useCallback((ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  }, []);

  const handlePaymentChoice = useCallback((i) => {
    const methodItemsDiv = scrollRef1.current;
    if (methodItemsDiv) {
      const images = methodItemsDiv.querySelectorAll('img');
      if (images && images.length > 0) {
        // Reset the border color of all images
        images.forEach((image) => { image.style.borderColor = '' });
        // Check if the index is within bounds
        if (i >= 0 && i < images.length) {
          const selectedImage = images[i];
          selectedImage.style.borderColor = 'orange';
          setSelectedPaymentMethod(i+1);
        }
      }
    }
  },[scrollRef1]);
  const handlePayment = async (PaymentData) => { 
    if (PaymentData.MethodName === "CashOnDelivery") {
      await delay(2);
      setPaymentStatus(true);
      alert("Your Successfully placed by COD (Cash On Delivery)...");
      console.log("Sure! Your order is successfully Placed...");
      navigate('/Home');
    }
    // logic for other payment methods...
    let str = String(PaymentMethod[selectedPaymentMethod]) ;
    PaymentData = {...PaymentData,finalCost:finalCost,MethodName:str.substring(0,str.length - 4)}; // adding some more data in Paymentdata...
    const response = await fetch('http://localhost:4000/make-payment',{
      method:'POST',    
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(PaymentData)
    })
    if (!response.ok){
      throw new Error(response.statusText);
    }
    const data = await response.json();
    setPaymentStatus(true); // stating that payment is done successfully...
    alert(`${data.message} with Status : ${data.Payment_Status}`);
    navigate('/Home');
}
  return (
    <div className='Main'>
        <div className='L'>
            <div className='top_portion'></div>
            <div className='bottom_portion'>
                <ul>
                    <li>PRODUCTS</li>
                    <li>TOTAL-COST</li>
                </ul>
                <div className='Products'>
                {FoodAdded && Array.isArray(FoodAdded[0]) ? (
                  FoodAdded[0].map((item, index) => (
                     <div key={index + 1}><b>{item.Item_.Name}</b> <span>=></span> <b>${item.Item_.Price * item.quantity}</b></div>
                   ))
                ) : (
                    <div><b>{item.Name}</b> <span>=></span> <b>${item.Price}</b></div>
                )}
                </div>
                <div className='Total_Cost'>
                  <div>FINAL-COST :</div>
                  <div id='cost'> ${finalCost} /-</div>
                </div>
            </div>
        </div>
        <div className='R'> 
            <div className='heading'>
              <h1>Payment Gateway</h1>
              <h4>Choose a payment method : </h4>
            </div>
        <div className='option'>
          <ul>
            <li>
              <button onClick={() => handlePreviousScroll(scrollRef1)}>
                <img height='37px' width='37px' src="BackArrow.png" alt="Back Arrow" />
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll(scrollRef1)}>
                <img height='37px' width='37px' src="FrontArrow.png" alt="Front Arrow" />
              </button>
            </li>
          </ul>
          <div className='MethodItems' ref={scrollRef1}>
          {PaymentMethod.map((EachPic, index) => (
             <div key={index} className='methods'>
               <img 
                 onClick={() => handlePaymentChoice(index)} 
                 src={`${process.env.PUBLIC_URL}/${EachPic}`} 
                 alt={EachPic} 
                 style={{ borderColor: selectedPaymentMethod === index + 1 ? 'orange' : '' }}
               />
               <span>{EachPic.substring(0, EachPic.length - 4)}</span>
             </div>
          ))}
          </div>
        </div>
        <div className='FormPart'>
            <ul>
                <li>Billing Information</li>
                <li>Credit Card Details</li>
            </ul>
            <form onSubmit={CardForm.handleSubmit(handlePayment)} method='POST' className='Lower_Part'>
                <div id='BI'>
                  <span>Full Name : </span>
                  <input {...CardForm.register('FullName',{required:true , message:'Required for Bank Account Access...'})} type="text" placeholder='Enter Your Full Name' />
                  <span>Address : </span>
                  <input {...CardForm.register('Address',{required:true , message:'An Important credentail...'})} type="text" placeholder='Enter Current Address' />
                  <span>City : </span>
                  <input {...CardForm.register('City',{required:true , message:'Your location referencing...'})} type="text" placeholder='Enter Your City' />
                  <span>ZipCode : </span>
                  <input {...CardForm.register('ZipCode',{required:true , message:'Required for Contact Info'})} type="number" placeholder='Enter your ZipCode' />
                  <span>Country : </span>
                  <input {...CardForm.register('Country',{required:true , message:'Your location referencing...'})} type="text" placeholder='Enter your Country' />
                </div>
                <div id='CCD'>
                  <span>Card Number :</span>
                  <input {...CardForm.register('CardNumber',{required:true , message:'Your Card Identification...'})} type="number" placeholder='Enter Your Card Number' />
                  <span>Card Holder Name : </span>
                  <input {...CardForm.register('CardHolderName',{required:true , message:'Required for cross-verification...'})} type="text" placeholder='Enter Card Holders Name' />
                  <span>Cards Expiry Date : </span>
                  <input {...CardForm.register('Expiry-Date',{required:true , message:'For checking cards validity...'})} type="date" placeholder='Enter Cards Expiry Date' />
                  <span>Cards CVV Code : </span>
                  <input {...CardForm.register('CVV-Code',{required:true , message:'For Cards Unique Identification...'})} type="number" placeholder='Enter Cards CVV' />
                  <section>
                    <button type="submit">Make Payment</button>
                  </section>
                </div>
            </form>
        </div>
        </div>
    </div>
  )
}

export default Payment
