import '../components/SignUp.css'
import Typed from 'typed.js'
import React,{useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { useUser } from '../UserContext';

const SignUp = () => {
  const { setUser } = useUser() ;
  const delayer = (t) => { 
    return new Promise((resolve) => { 
      setTimeout(() => { resolve() }, t * 1000);
     })
  }
  const navigate = useNavigate() ;
  const SignForm = useForm() ; 

  async function onsubmit(Info) {
    try {
      const response = await fetch('http://localhost:4000/Sign-Up-Process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Info)
      });
      if (response.ok) {
        const userData = await response.json(); // Parse the response body as JSON...
        setUser(userData);
        await delayer(1);
        navigate('/Home');
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
    // Defining the typer Animation...
    useEffect(() => {
        var typed = new Typed('#element', {
          strings: ["A Higly trusted Brand.", "Enjoy special Offers.", "Have free Delivery on first Order", "......."],
          typeSpeed: 50,startDelay: 100,loop: true
        });

        return () => {
          typed.destroy();
        };
      }, []);
  return (
    <>
    <div className='main'>
        <div className='left'>
            <h1 className='org'>TWIGGY ? ? ?</h1>
            <p>We helps you in getting your Desired food from your Favourite restraunts delivered at your Home . And other benefits like.... </p>
            <span style={{color:'orange'}} id='element'></span>
        </div>
        <div className='right'>
          <h2>SIGN UP</h2>
          <hr />
          <form onSubmit={SignForm.handleSubmit(onsubmit)} action="" method="post">
            <input placeholder='Enter Your UserName' type="text" {...SignForm.register('UserName',{required:true , message:'This Feild is required for Name recognition'})} />
            {SignForm.formState.errors.UserName && (<div className='Red'>{SignForm.formState.errors.UserName.message}</div>)}
            <input placeholder='Enter Your Email-Adddress' type="email" {...SignForm.register('Email_Id',{required:true , message:'This Feild is required for future formatting'})} />
            {SignForm.formState.errors.Email_Id && (<div className='Red'>{SignForm.formState.errors.Email_Id.message}</div>)}
            <input placeholder='Enter A Password' type="password" {...SignForm.register('Password',{required:true , message:'This Feild is required for Credential security'})} />
            {SignForm.formState.errors.Password && (<div className='Red'>{SignForm.formState.errors.Password.message}</div>) }
            <input placeholder='Enter Your Current Age' type="number" {...SignForm.register('Age',{required:true , message:'This Feild is required for Age Determination' , 
            validate: {isAdult: (Age) => {
                return Age >= 18 || 'You must be at least 18 years old';
              }
            }})} />
            {SignForm.formState.errors.Age && (<div className='Red'>{SignForm.formState.errors.Age.message}</div>) }
            <input placeholder='Enter Your PhoneNumber (In International Format)' type="tel" {...SignForm.register('PhoneNumber',{required:true , message:'Required for Contact Info'})} />
            {SignForm.formState.errors.PhoneNumber && (<div className='Red'>{SignForm.formState.errors.PhoneNumber.message}</div>) }
            <ul>
              <li>
                 <input type="radio" id='option1' name='gender' value='Male' {...SignForm.register('Gender')} />
                 <label htmlFor="option1">Male</label>
              </li>
              <li>
                 <input type="radio" id='option2' name='gender' value='Female' {...SignForm.register('Gender')}  />
                 <label htmlFor="option2">Female</label>
              </li>
              <li>
                 <input type="radio" id='option3' name='gender' value='None' {...SignForm.register('Gender')}  />
                 <label htmlFor="option3">None</label>
              </li>
            </ul>
          <p>By clicking on SignUp button your aggree to <b className='org'>TERMS</b> , <b className='org'>PRIVACY POLICIES</b> and <b className='org'>COOKIES POLICIES</b></p>
          <div id='LL'>
            <button disabled={SignForm.formState.isSubmitting} className='SubmitBTN' type="submit">SIGN UP</button>
            <Link to={'/LogIn'}>Already Have An Account ???</Link>
          </div>
          </form>
        </div>
    </div>

    </>
  )
}

export default SignUp
