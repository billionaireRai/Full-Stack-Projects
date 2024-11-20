import '../components/Home.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { updateData , DeliverySort , NewItemSort ,LowFatSort , RatingSort ,PriceSorting } from './Redux/dataSlice';
import { addItem } from './Redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate() ;
  // setting environment for using redux...
  const dispatch = useDispatch() ;
  const Data = useSelector(state => state.DataState.data) ;
  
  const BrandName = [
    'KFCpic.png', 'MACDONALDSpic.png', 'SUBWAYpic.png', 'PIZZAHUTpic.png',
    'DOMINOSpic.png', 'BURGERKINGpic.png', 'BASKINROBINSpic.png', 'HALDIRAMSpic.png',
    'COSTACOFFEEpic.png', 'STARBUCKSpic.png', 'CAFECOFFEEDAYpic.png'
  ];

  const MindFoodArr = [
    'BhindiMasala.png', 'Burger.png', 'ButterChicken.png', 'CheesePizza.png',
    'ChickenBiryani.png', 'ChickenPizza.png', 'ChickenTikka.png', 'ChikenFriedRice.png',
    'CholeBhature.png', 'HakkaNoodle.png', 'MuttonRoganJosh.png', 'PalakPaneer.png',
    'Paneer Malai Kofta.png', 'Pav Bhaji Food.png', 'Pizza.png', 'SaagAloo.png',
    'Samosa.png', 'TandooriChicken.png', 'VegBiryani.png'
  ];

  const [prevdot, setprevdot] = useState('');
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 16;

  // persisting accross the rerenders...  
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  // function for fetching more food items on button click...
  const fetchData = useCallback( async (page) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/fetchfood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, pageSize }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`) ; // single liner error handling...
      const { foodData, total } = await response.json();
      const newData = [...data, ...foodData];  // Append new data to the existing data...
      dispatch(updateData({NewData:newData}));  // Dispatch the updated data to Redux...
      setTotal(total);
      setdata(newData); // This line updates local state, which you might not need if you use Redux state directly...
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  });
  
  // As the page changes it fetches new data...
  useEffect(() => { fetchData(page); }, [page]);

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setprevdot(prevdot => (prevdot.endsWith('....') ? '' : prevdot + '.'));
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className='Top'>
        <ul>
          <li><h2>What's In your mind ? ? ?</h2></li>
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
        </ul>
        <div className='FoodItems' ref={scrollRef1}>
          {MindFoodArr.map((EachPic, index) => (
            <div key={index} className='food'>
              <img src={`${process.env.PUBLIC_URL}/images/${EachPic}`} alt={EachPic} />
              <span>{EachPic.substring(0, EachPic.length - 4)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='Middle'>
        <ul>
          <li><h2>Top restaurant chains in YourLocation{prevdot}</h2></li>
          <ul>
            <li>
              <button onClick={() => handlePreviousScroll(scrollRef2)}>
                <img height='37px' width='37px' src="BackArrow.png" alt="Back Arrow" />
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll(scrollRef2)}>
                <img height='37px' width='37px' src="FrontArrow.png" alt="Front Arrow" />
              </button>
            </li>
          </ul>
        </ul>
        <div className='FoodItems_2' ref={scrollRef2}>
          {BrandName.map((imagename, index) => (
            <div key={index} className='Brand'>
              {/* instead of (..) use proccess.env.PUBLIC_URL */} 
              <img src={`${process.env.PUBLIC_URL}/images/${imagename}`} alt={imagename} />
              <div>{imagename.substring(0, imagename.length - 7)}</div>
              <div className='Rating'>
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
                <span> {4.2}</span>
                <span>{50} Minutes</span>
              </div>
              <div className='Lo'>American FastFood Chain</div>
              <span className='Lo'>Chattarpur</span>
            </div>
          ))}
        </div>
      </div>
      <div className='Lower'>
        <div><h2>Restaurants with Online Food Delivery in YourLocation</h2></div>
        <ul id='LIL'>
          <li><button>FILTER <img height="10px" width="10px" src={`${process.env.PUBLIC_URL}/next.png`} alt="Filter" /></button></li>
          <li><button onClick={() => {dispatch(DeliverySort({Time:30})) }}>Fast Delivery</button></li>
          <li><button onClick={() => {dispatch(NewItemSort({offer:15})) }}>New On Twiggy</button></li>
          <li><button onClick={() => {dispatch(LowFatSort({Fatlimit:10})) }}>Low Fat-Content</button></li>
          <li><button onClick={() => {dispatch(RatingSort()) }}>Ratings 4.0 +</button></li>
          <li><button onClick={() => {dispatch(PriceSorting({PriceStr:"10"})) }}> Less Than $10 </button></li>
          <li><button onClick={() => {dispatch(PriceSorting({PriceStr:"$10-$20"})) }}> $10 - $20 </button></li>
          <li><button onClick={() => {dispatch(PriceSorting({PriceStr:"$20-$30"}))}}> $20 - $30 </button></li>
          <li><button onClick={() => {dispatch(PriceSorting({PriceStr:"Above $30"})) }}> Above $30 </button></li>
        </ul>
        <div className='foodITM'>
          {loading && <p>Loading...</p>}
          {error && <p>An Error Occured : {error}</p>}
          {Array.isArray(Data) && Data.map((Item_, index) => (
            <div  key={index}>
              <img src={Item_.Image_Url} alt={Item_.Name} />
              <main>
                <h4>{Item_.Restaurant_name}</h4>
                <ul className='SRP'>
                  <li>
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
                  </li>
                  <li>{Item_.Rating}</li>
                  <li>({Item_.Preparation_time})</li>
                </ul>
                <ul className='SRPA'>
                  <li>{Item_.Name}</li>
                  <li>${Item_.Price}</li>
                  <li style={{color:'orange'}}>{Item_.Availability_status}</li>
                </ul>
                <ul id='BTNS'>
                  <li><button onClick={() => {navigate('/Payment',{state:{item:Item_}})}} type="button">BuyNow</button></li>
                  <li><button onClick={() => dispatch(addItem({ Item_: Item_, quantity: 1 }))} type="button">AddToCart</button></li>
                </ul>
              </main>
            </div>
          ))}
          {Data.length < total && !loading && (
            <button id='LM' onClick={() => setPage(prevPage => prevPage + 1)}>Load More</button>
          )}
        </div>
      </div>
      <div className='Lower_section'>
        <ul>
          <li>For More Handy Experience,Download the Twiggy Mobile App Now</li>
          <li><a href="https://play.google.com/store/apps/details?id=in.swiggy.android&amp;referrer=utm_source%3Dswiggy%26utm_medium%3Dheader" rel="nofollow noopener" target="_blank" class="sc-doohEh eBBcOC"><img height="auto" width="250px" class="sc-bmzYkS duamAe sc-dxlmjS bhTIdR" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/play_store.png" alt="Download Android App" /></a></li>
          <li><a href="https://itunes.apple.com/in/app/id989540920?referrer=utm_source%3Dswiggy%26utm_medium%3Dhomepage" rel="nofollow noopener" target="_blank" class="sc-doohEh eBBcOC"><img height="auto" width="250px" class="sc-bmzYkS duamAe sc-dxlmjS bhTIdR" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png" alt="Download iOS App" /></a></li>
        </ul>
      </div>
      <div className='Lower_Sec'>
        <ul>
          <li><svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_b_674_19294)"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.3819 14.7977C20.5245 13.9563 20.3574 13.3121 19.9261 12.9756C19.2787 12.4711 18.3021 12.1959 15.9859 12.204C14.2724 12.2082 12.4327 12.2167 11.6469 12.2205C11.5739 12.2082 11.3093 12.1181 11.297 11.7938L11.2683 6.64781C11.2683 6.3236 11.5207 6.05694 11.8385 6.05694C12.1559 6.05694 12.412 6.31936 12.412 6.64358C12.412 6.64358 12.4285 9.43839 12.4327 10.4314C12.4327 10.5257 12.4897 10.7513 12.7011 10.8089C14.085 11.1822 21.0778 10.883 20.9639 9.57764C20.3536 4.16496 15.8884 -0.0164585 10.4829 4.87055e-05C8.78164 0.00385807 7.16965 0.426698 5.745 1.16952C2.33815 2.98744 -0.0755529 6.63977 0.00180748 10.8542C0.0546894 13.8374 1.98811 19.1396 3.16037 19.923C3.70173 20.2845 4.40996 20.1491 7.58886 20.1368C9.0298 20.1325 10.3732 20.1325 11.0324 20.1325C11.1016 20.1448 11.4599 20.2312 11.4637 20.5677L11.484 24.4782C11.484 24.8024 11.232 25.0691 10.9142 25.0691C10.5968 25.0691 10.3402 24.8109 10.3402 24.4824C10.3402 24.4824 10.3647 22.9108 10.3609 22.328C10.3609 22.1926 10.3689 21.9585 9.98235 21.7862C8.71622 21.2119 4.60532 21.5729 4.37737 22.2129C4.29191 22.4592 4.75185 23.4073 5.46418 24.6259C7.83331 28.4425 10.1571 31.4176 10.5318 31.8937C10.5563 31.9141 10.5766 31.9348 10.5968 31.9471C10.9104 31.5611 19.1078 22.2747 20.3819 14.7977Z" fill="white"></path></g><defs><filter id="filter0_b_674_19294" x="-9.26002" y="-9.26002" width="39.4853" height="50.4673" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feGaussianBlur in="BackgroundImageFix" stdDeviation="4.63001"></feGaussianBlur><feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_674_19294"></feComposite><feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_674_19294" result="shape"></feBlend></filter></defs></svg><span>Twiggy</span></li>
          <li className='corporation'> © 2024 AlpheNex Technologies... </li>
        </ul>
        <ul>
          <li><h5>Company</h5></li>
          <li className='corporation'>About</li>
          <li className='corporation'>Careers</li>
          <li className='corporation'>Team</li>
          <li className='corporation'>Twiggy one</li>
          <li className='corporation'>Twiggy instamart</li>
          <li className='corporation'>Twiggy Genie</li>
        </ul>
        <ul>
          <li><h5>Contact Us</h5></li>
          <li className='corporation'>Help & Support</li>
          <li className='corporation'>Partner With Us</li>
          <li className='corporation'>Ride with Us</li>
          <ol>
            <li><h5>Legal</h5></li>
            <li className='corporation'>Terms & Condition</li>
            <li className='corporation'>Cookies Policy</li>
            <li className='corporation'>Privacy Policies</li>
            <li className='corporation'>Investor Relations</li>
          </ol>
        </ul>
        <ul>
          <li><h5>We Deliver to :</h5></li>
          <li className='corporation'>Delhi</li>
          <li className='corporation'>Gurgoan</li>
          <li className='corporation'>Noida</li>
          <li className='corporation'>Hyderabad</li>
          <li className='corporation'>Banglore</li>
          <li className='corporation'>Mumbai</li>
          <li className='corporation'>Pune</li>
          <li className='corporation'>589 More cities{prevdot}</li>
        </ul>
      </div>
    </>
  );
};

export default Home;
