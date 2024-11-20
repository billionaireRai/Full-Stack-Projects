import '../components/LogIn.css';
import Typed from 'typed.js'
import React,{ useEffect , useState } from 'react'
import { Link,useNavigate } from 'react-router-dom' ;
import { useForm } from 'react-hook-form';
import { useUser } from '../UserContext';
import { AuthUser } from '../AuthContext'



const LogIn = () => {
  const { setisAuth } = AuthUser();
  const { setUser } = useUser() ;
  // Making delay simulator function...
  const delayer = (t) => { 
    return new Promise((resolve) => { 
      setTimeout(() => { resolve() }, t * 1000);
     })
   }
  // Initializing the hooks we are using....
  const navigate =  useNavigate() ;
  const loginform  = useForm() ;
  const OtpForm = useForm() ;
  const EnterForm =  useForm() ;
  const ResetForm = useForm() ;

  const [inputType, setInputType] = useState('email'); // State to manage input type
    // Function to handle dynamic change of input type...
    const handleSelectChange = (e) => {
      setInputType(e.target.value); // Set input type based on selected option
    };

    async function handleotp(credential) {
      try {
        const response = await fetch('http://localhost:4000/sendotp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credential)
        });
    
        if (!response.ok)  throw new Error(`HTTP error! Status: ${response.status}`);

      } catch (error) {
        console.error(`Error making request: ${error.message}`);
      }
    };
    
    async function Enterhandle(OTPtoSend) {
      const response = await fetch('http://localhost:4000/EnterOTP',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(OTPtoSend)
      }) ;
      if (response.ok) {
        let elem = document.getElementById('Formatting') ;
        elem.scrollIntoView({behavior:'smooth'}) ;
      }
    }
    async function Resethandling(Password) {
      const response = await fetch('http://localhost:4000/ResetPassword',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(Password)
      }) ;
      if (response.ok) {
        window.scrollTo({ top: 0, behavior: 'smooth' });  // Scroll to the top smoothly...
      }
    }
  async function onsubmit(Data) {
    try {
      const response = await fetch('http://localhost:4000/Log-In-Process',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(Data)
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data) ;
        await delayer(1) ;
        setisAuth(true);
        navigate('/Home') ;
      }else {
        const errorText = await response.text();
        console.error('Failed to login:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.log(`Error In Making Request : ${error}`);
    }
  }
  async function HandleForgot() {
    let element = document.getElementById('FP') ;
    element.scrollIntoView({behavior:'smooth'}) ;
  }
    // Defining the typer Animation...
    useEffect(() => {
        var typed = new Typed('#element', {
          strings: ["A Higly trusted Brand.", "Enjoy special Offers.", "Have free One Hour Delivery.", "......."],
          typeSpeed: 50 , startDelay: 100 , loop: true
        });

        return () => {
          typed.destroy();
        };
      }, []);
  return (
    <>
    <div className='main'>
        <div className='left'>
            <h1 className='org'>Lets get LogIn ! ! ! </h1>
            <p>Already a member? Sign in to access your account, check your order history, and enjoy a personalized experience with our wide range of delicious options..... </p>
            <span style={{color:'orange'}} id='element'></span>
        </div>
        <div className='right'>
          <h2>LOG IN</h2>
          <hr />
          <form onSubmit={loginform.handleSubmit(onsubmit)} action="" method="post">
            <input placeholder='Enter Your UserName' type="text" {...loginform.register('UserName',{required:{value:true , message:'Required for Secured Access of your Account...'}})} />
            {loginform.formState.errors.UserName && (<div className='Red'>{loginform.formState.errors.UserName.message}</div>) }
            <input placeholder='Enter Your Password' type="password" {...loginform.register('Password',{required:{value:true , message:'Required for Secure Access of your Account...'}})} />
            {loginform.formState.errors.Password && (<div className='Red'>{loginform.formState.errors.Password.message}</div>) }
            <input placeholder='Enter Your Current Age' type="number" {...loginform.register('Age',{required:{value:true , message:'Required for Secure Access of your Account...'}})}  />
            {loginform.formState.errors.Age && (<div className='Red'>{loginform.formState.errors.Age.message}</div>) }
           <button disabled={loginform.formState.isSubmitting} className='SubmitBTN' type="submit">LOG IN</button>
          </form>
          <ul className='lower'>
            <Link to={'/SignUp'}><li>Are You A New User ? ? ?</li></Link>       
            <li onClick={HandleForgot}>Forgot Passwords ???</li>
          </ul>
        <div id='FP' className='ForgetedProccess'>
          <h2>Lets Format Your Password</h2>
          <form onSubmit={OtpForm.handleSubmit(handleotp)} action="" method="post">
             <select value={inputType} onChange={handleSelectChange}>
               <option style={{color:'grey'}} disabled >Choose One Of These</option>
               <option value='tel'>PhoneNumber(In International Format)</option>
               <option value='email'>EmailId</option>
             </select>
             <input placeholder='Enter The Selected Credential' type={inputType} {...OtpForm.register('credential',{required:{value:true , message:'Need To Choose Any One Credential'}})} />
             {OtpForm.formState.errors.credential &&  (<span className='error'>{OtpForm.formState.errors.credential.message}</span>)}
             <button id='Sendotp' type="submit">Send OTP</button>
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

    </>
  )
}

export default LogIn
