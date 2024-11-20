import '../components/LogIn.css';
import React, { useState, useEffect } from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const SignIn = () => {
  const navigate = useNavigate() ;

  const loginForm = useForm() ;
  const OtpForm = useForm() ;
  const EnterForm = useForm() ;
  const ResetForm = useForm() ;

  const [timer, setTimer] = useState(90);
  const [inputType, setInputType] = useState('email'); // State to manage input type

  // Start the interval when component mounts
  useEffect(() => {
    const intervalId = setInterval(() => {setTimer(prevTimer => prevTimer - 1);}, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle timer start
  const handleTimerStart = () => {
    // Show the 'Time' element
    let element = document.getElementById('Time');
    if (!OtpForm.formState.errors.credential) {
      element.style.display = 'block';
    } else {
      element.style.display = 'none' ;
    }
      setTimer(90); // Reset timer to 90 seconds
      const intervalId = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 0) {
            clearInterval(intervalId); // Clear the interval
            alert("Your OTP has expired. Please send it again."); // Alert when timer expires
            return 0; // Reset timer to 0
          } else {
            return prevTimer - 1; // Decrease timer by 1 second
          }
        });
      }, 1000);
  };
  // Function for handling the Forgot Password click
  const handleClick = () => {
    let targetedsection = document.getElementsByClassName('ForgetedProccess')[0];
    if (targetedsection) {
      targetedsection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // Function to handle dynamic change of input type...
  const handleSelectChange = (e) => {
    setInputType(e.target.value); // Set input type based on selected option
    };

  async function handlelogin(logindata) {
    // Simulating the delay of data proccessing... 
    await new Promise(resolve => setTimeout(resolve,2000)) ;
    const response = await fetch('http://localhost:4000/LogInfo',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(logindata),
    })
    if (response.ok) {
      const result = await response.json() ;
      console.log("Authentication Successfull :",result) ;
      navigate('/TraceLocation');
    } else {
         alert('Please Enter Valid Credentials...');
         console.log("Authentication Failed...");
         navigate('/LogIn');
      }
  }
  async function handleotp(otpcredential) {
    console.log(otpcredential);
    const fetching = await fetch('http://localhost:4000/sendotp',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(otpcredential),
    });
    if (fetching.ok) {
      const result = await fetching.json();
      console.log('Response Successfully Sent:', result);
    } else {
      console.log('Error:', fetching.status, fetching.statusText);
    }
  }
  async function Enterhandle(OTP) {
    const sendOTP = await fetch('http://localhost:4000/enterotp',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(OTP)
    });
    if (sendOTP.ok) {
      document.getElementById('Formatting').scrollIntoView({behavior: 'smooth'});
      console.log('Response Successfully Sent:', sendOTP);
    } else {
      console.log('Error:', sendOTP.status, sendOTP.statusText);
    }
  }
  async function Resethandling(NewPassword) {
    const NewData = await fetch('http://localhost:4000/reseting',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(NewPassword),
    })
    if (NewData.ok) {
      const Result = await NewData.json() ;
      document.getElementById('SectionOne').scrollIntoView({behavior:'smooth'}) ;
      console.log("Newly Set Password :",Result) ;
    } else {
      console.log('Error:', NewData.status, NewData.statusText)
    }
  }
  return (
    <div className="Full">
      <div className="main">
        <h1>LogIn</h1>
        <form onSubmit={loginForm.handleSubmit(handlelogin)} id='SectionOne' action="" method="post">
          <input placeholder='Enter Your EmailId' type="email" {...loginForm.register('email',{required:{value:true , message:'Neccesary for Account Authentication'}})} />
          {loginForm.formState.errors.email && (<span className='error'>{loginForm.formState.errors.email.message}</span>)}
          <input placeholder='Enter your Password' type="password" {...loginForm.register('password',{required:{value:true , message:'Neccesary for Account Authentication'}})} />
          {loginForm.formState.errors.password &&  (<span className='error'>{loginForm.formState.errors.password.message}</span>)}
          <input placeholder='Enter Your PhoneNumber(International Format)'  type="tel" {...loginForm.register('phonenumber',{required:{value:true , message:'Neccesary for Account Authentication'}})} />
          {loginForm.formState.errors.phonenumber &&  (<span className='error'>{loginForm.formState.errors.phonenumber.message}</span>)}
          <button type="submit">Access Account</button>
        </form>
        <ul>
          <li><NavLink to='/SignIn'><strong>Don't Have An Account ?</strong></NavLink></li>
          <li onClick={handleClick}>Forgot Password</li>
        </ul>
        <div className='ForgetedProccess'>
          <h1>Formatting Your Password</h1>
          <form onSubmit={OtpForm.handleSubmit(handleotp)} action="" method="post">
             <select value={inputType} onChange={handleSelectChange}>
               <option disabled >Choose One Of These</option>
               <option value='tel'>PhoneNumber</option>
               <option value='email'>EmailId</option>
             </select>
             <input placeholder='Enter The Selected Credential' type={inputType} {...OtpForm.register('credential',{required:{value:true , message:'Need To Choose Any One Credential'}})} />
             {OtpForm.formState.errors.credential &&  (<span className='error'>{OtpForm.formState.errors.credential.message}</span>)}
             <div className='buttons'>
               <button onClick={handleTimerStart} id='Sendotp' type="submit">Send OTP</button>
               <span id='Time'>{ '' ? OtpForm.formState.errors  :(<strong>OTP will expire in - {Math.max(0, timer)} sec </strong>)}</span>
             </div>
          </form>
          <form onSubmit={EnterForm.handleSubmit(Enterhandle)} action='' method='post'>
            <input placeholder='Enter The OTP Sended' inputMode='numeric' type="text" {...EnterForm.register('OTP',{required:{value:true , message:'Its needed for formating your Password...'}})} />
            {EnterForm.formState.errors.OTP &&  (<span className='error'>{EnterForm.formState.errors.OTP.message}</span>)}
            <button id='Enter' type="submit">Enter</button>
          </form> 
        </div>
        <div id='Formatting'>
          <form onSubmit={ResetForm.handleSubmit(Resethandling)} method='post'>
             <input placeholder='Enter The New Password... ' type="password" {...ResetForm.register('Password',{required:{value:true,message:'Its required for setting New Password to your Account'}})}  />
             {ResetForm.formState.errors.Password &&  (<span className='error'>{ResetForm.formState.errors.Password.message}</span>)}
             <button id='Reset' type="submit">Reset</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
