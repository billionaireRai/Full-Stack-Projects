import '../components/SignIn.css';
import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const SignIn = () => {
  const navigate = useNavigate() ;
  const signinForm = useForm() ;

  async function onsubmit(data) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const response = await fetch('http://localhost:4000/SignInfo',{
      method:'POST',
      headers:{'Content-Type':'application/json'} ,
      body:JSON.stringify(data),
    })
    if (response.ok) {
      const result = await response.json() ;
      console.log('Credentials Saved in Database :',result);
      navigate('/TraceLocation')
    } else {
      console.log('Failed to save Credentials...');
    }
  }

  return (
    <div className="Full">
      <div className="main">
        <h1>SignUp</h1>
        <form onSubmit={signinForm.handleSubmit(onsubmit)} id='SectionOne' action="" method="post">
          <input placeholder='Enter Your EmailId' type="email" {...signinForm.register('email',{required:{value:true , message:'Its a Neccessary SignUp Detail'}})} />
          {signinForm.formState.errors.email && (<span className="error">{signinForm.formState.errors.email.message}</span>) }
          <input placeholder='Enter your Password' type="password" {...signinForm.register('password',{required:{value:true , message:'Its a Neccessary SignUp Detail'}})} />
          {signinForm.formState.errors.password && (<span className="error">{signinForm.formState.errors.password.message}</span>) }
          <input placeholder='Enter Your PhoneNumber(International Format)' type="tel" {...signinForm.register('phonenumber',{required:{value:true , message:'Its a Neccessary SignUp Detail'}})} />
          {signinForm.formState.errors.phonenumber && (<span className="error">{signinForm.formState.errors.phonenumber.message}</span>) }

          <button type="submit">Create Account</button>
        </form>
        <ul>
          <li><NavLink to='/LogIn'><strong>Already Have An Account ?</strong></NavLink></li>
        </ul>
      </div>
    </div>
  );
};

export default SignIn;
