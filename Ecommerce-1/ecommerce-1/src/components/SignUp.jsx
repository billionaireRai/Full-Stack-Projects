import React, { useEffect, useState } from "react";
import "./SignUp.css";
import Typed from "typed.js";
import { useForm } from "react-hook-form";
import { NavLink , useNavigate  } from "react-router-dom";

const SignUp = () => {
  const SignUpForm = useForm();
  const [dot, setdot] = useState('') ; 


  const navigate = useNavigate() ;
  function DelaySimulator(t) {
    return new Promise((resolve,reject) => { 
      setTimeout(() => {
        resolve()
      }, t * 1000);
     })
  }
  useEffect(() => {
    var typed = new Typed('#element', {
      strings: ["be a trusted user.", "enjoy special Offers.", "have free Delivery.", "......."],
      typeSpeed: 50,
      startDelay: 30,
      loop: true
    });

    return () => {
      typed.destroy();
    };
  }, []);

  async function SignUpSubmit(data) {
    // Start showing loading animation
    const interval = setInterval(() => {
      setdot((prevDot) => prevDot.length < 4 ? (prevDot + '.') : ''); 
    }, 50); // Adjust the timing of dots if needed

       // Making a post request on backend
   try {
     await DelaySimulator(3) ; //  for simulating network delay... 
     const response = await fetch('http://localhost:4000/usersignup',{
       method:'POST' ,
       headers:{'Content-Type':'application/json'} ,
       body:JSON.stringify(data)
     })
     if (response.ok) {
       const result = await response.json() ;
       console.log("Response is Successfull",result)
       alert("Data is successfully saved...")
       navigate('/Home' , {state:{CustomerName:'Username'}} );
       clearInterval(interval) ;
     } 
     else {
       console.log("Error in making POST request");
     }
   } catch (error) {
    console.log("Some error in Request Making Proccess :",error)
   }
  }

  return (
    <>
      <div className="BackG_">
        <div className="SignUpBox">
          <div className="left">
            <div id="Text">
              <h1> Why Sign Up ???</h1>
              <span id="FirstSpan">Please Provide us the necessary details asked to </span>
              <span id="element"></span>

              <ul className="Lower">
                <li>Terms&Conditions</li>
                <li>Privacy Policies</li>
              </ul>
            </div>
          </div>
          <div className="right">
            <h2>Lets Get Started</h2>
            <form onSubmit={SignUpForm.handleSubmit(SignUpSubmit)} action="" method="post">
              <div>
                <div>UserName</div>
                <input type="text" placeholder="Enter your Username"{...SignUpForm.register('Username', { required: true , message:'This feild is required for Signup' })} />
                {SignUpForm.formState.errors.Username && (
                  <div className="red">{SignUpForm.formState.errors.Username.message}</div>
                )}
              </div>
              <div>
                <div>Email-Address</div>
                <input type="email" placeholder="Enter your Email" {...SignUpForm.register('EmailId', {required:true , message:'This felid is important for unique identification' })}
                />
                {SignUpForm.formState.errors.EmailId && (
                  <div className="red">{SignUpForm.formState.errors.EmailId.message}</div>
                )}
              </div>
              <div>
                <div>Password</div>
                <input type="password" placeholder="Enter Your password" {...SignUpForm.register('Password', { required:true , message:'This feild is for enhancing your security'  })}
                />
                {SignUpForm.formState.errors.Password && (
                  <div className="red">{SignUpForm.formState.errors.Password.message}</div>
                )}
              </div>
              {SignUpForm.formState.isSubmitting && <div id="loder">Loading{dot}</div>}
              <button disabled={SignUpForm.formState.isSubmitting} type="submit">Create Account</button>
              <div id="Last">
                Already have an account? <NavLink to="/Login"> <b>Login Now</b></NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
