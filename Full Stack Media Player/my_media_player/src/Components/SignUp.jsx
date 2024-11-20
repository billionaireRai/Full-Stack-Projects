import './SignUp.css';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer, Slide } from 'react-toastify';
import axios from 'axios';

const SignUp = ({ DotState }) => {
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate() ;
  const waitFor = (t) => {
    return new Promise(resolve => setTimeout(resolve, t * 1000));
  };

  const handleSignUp = async (formdata) => {
    try {
      const response = await axios.post('/api/user/signup', formdata , {withCredentials:true});
      if (response.status === 200) {
        // cookies has been successfully set by the browser...
        toast.success('SignUp Successfully Done...',{ onClose : () => { 
          navigate('/song-library');
         }}) ;
        waitFor(4);
        console.log("SignUp Proccess successfully done...");
      }
      else toast.error(`${response.statusText}`) ; 
    } catch (error) {
      console.error("An Error Occurred in SignUp Process !!!", error);
      toast.error("Error in SignUp Process !!!");
    }
  };

  const handleO_Authentication = (o_authProvider) => {
    window.location.href = `http://localhost:4040/auth/Provider/${o_authProvider}`;
  };

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
      <div className='Main_Box'>
        <div className='Top_Portion'>
          <h2>We'll Help you Enjoy your favourite Music From Unlimited Artists{DotState}</h2>
          <p>Discover endless tunes, explore new artists, and immerse yourself in the ultimate music experience anytime, anywhere! Unleash the power of sound and let the rhythm take you on a journey like never before!</p>
        </div>
        <div className='Box'>
          <h2>Let's Sign-up . . .</h2>
          <div>Register With :</div>
          <div className='Options'>
            <button id='google' onClick={(e) => { handleO_Authentication(e.target.id) }} type="button">
              <img alt='img' src={`${process.env.PUBLIC_URL}/Images/Google.logo.png`} />Google
            </button>
            <button id='github' onClick={(e) => { handleO_Authentication(e.target.id) }} type="button">
              <img alt='img' src={`${process.env.PUBLIC_URL}/Images/GitHub.logo.png`} />GitHub
            </button>
            <button id='twitter' onClick={(e) => { handleO_Authentication(e.target.id) }} type="button">
              <img alt='img' src={`${process.env.PUBLIC_URL}/Images/Twitter.logo.png`} />Twitter
            </button>
          </div>
          <hr />
          <span id='or'>Or</span>
          <form onSubmit={handleSubmit(handleSignUp)} className='Input_Box'>
            <span>UserName</span>
            <input type="text" placeholder='Enter Your UserName' {...register('UserName', {
              required: { value: true, message: 'This Field is required for Name recognition...' },
              minLength: { value: 10, message: 'Username must be at least 10 characters long...' }
            })} />
            {formState.errors.UserName && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.UserName.message}</span></div>
            )}
            <span>Email</span>
            <input type="email" placeholder='Enter your Email-Id' {...register('Email', {
              required: { value: true, message: 'This Field is required for Notification services...' },
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email format' }
            })} />
            {formState.errors.Email && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.Email.message}</span></div>
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
            <span>Phone-Number</span>
            <input type="tel" placeholder='Enter your PhoneNumber' {...register('PhoneNumber', {
              required: { value: true, message: 'This Field is required for Contact...' },
              pattern: { value: /^\d{10}$/, message: 'Phone number must be 10 digits' }
            })} />
            {formState.errors.PhoneNumber && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.PhoneNumber.message}</span></div>
            )}
            <button disabled={formState.isSubmitting} id='MainBtn' type="submit">SignUp</button>
          </form>
          <p>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
          <div>Already Have An Account ?? <Link to={'/login'}>Click_Me</Link></div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
