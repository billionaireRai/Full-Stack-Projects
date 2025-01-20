import './LogIn.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer, Slide } from 'react-toastify';
import {useAuth} from '../userAuthContext.js'
import axios from 'axios' ;

const LogIn = () => {
  const {register,handleSubmit,formState} = useForm() ;
  const navigate = useNavigate() ;
  const { login } = useAuth() ;
  const waitFor = (t) => {
    return new Promise(resolve => setTimeout(resolve, t * 1000));
  };
  const handleO_Authentication = (o_authProvider) => {
    window.location.href = `http://localhost:4040/auth/Provider/${o_authProvider}`;
  };
  const handleLogin = async (loginData) => { 
    try {
      const response = await axios.post('/api/user/login', loginData ,{withCredentials:true});
      if (response.status === 200) {
          toast.success("LogIn Successfully Done...", { onClose: () => { 
            navigate('/song-library');
            login() // same user authentication context manipulation...
          }}); 
          waitFor(4);
          console.log("LogIn Process successfully done...");
      } else {
        toast.error(`User ${response.statusText} , Enter Correct credentials...`); 
      }
    } catch (error) {
      console.error("An Error Occurred in LogIn Process !!!", error.message);
      toast.error(`Error in Login Proccess...`);
    }
  }
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
    <div className='BOSS'>
      <div id='TopHead'>LogIn To Streamify</div>
      <div className='options'>
          <button onClick={(e) => { handleO_Authentication(e.target.id) }} id='google' type="button"><img alt='img' src={`${process.env.PUBLIC_URL}/Images/Google.logo.png`} />Countinue with Google</button>
          <button onClick={(e) => { handleO_Authentication(e.target.id) }} id='github' type="button"><img alt='img' src={`${process.env.PUBLIC_URL}/Images/GitHub.logo.png`} />Countinue with GitHub</button>
          <button onClick={(e) => { handleO_Authentication(e.target.id) }} id='twitter'type='button'><img alt='img' src={`${process.env.PUBLIC_URL}/Images/Twitter.logo.png`} />Countinue with Twitter</button>
        </div>
        <hr id='line' />
        <form onSubmit={handleSubmit(handleLogin)} className='input_Box'>
          <span>Email Or UserName</span>
          <input type="text" placeholder='Enter your Email-Id OR UserName' {...register('Text_Info',{
            required:{ value:true , message:'Required for User Identification...'},
          })} />
          {formState.errors.Text_Info && (
            <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.Text_Info.message}</span></div>
            )}
          <span>Password</span>
          <input type="password" placeholder='Enter Strong Password' {...register('Password',{
            required:{ value:true , message:'Required for Secure Access of Your Account...'},
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            maxLength: { value: 20, message: 'Password must not be more than 20' },
          })}/>
          {formState.errors.Password && (
              <div className='Red'><img src="./Images/warning.png" alt="img" /><span>{formState.errors.Password.message}</span></div>
            )}
          <button disabled={formState.isSubmitting} id='MainBtn' type="submit">LogIn</button>
        </form>
          <div id='FGT'>Forgot Your Passoword ??? <Link to={'/reset_password'}>Click Me</Link></div>
    </div>
    </>
  )
}

export default LogIn
