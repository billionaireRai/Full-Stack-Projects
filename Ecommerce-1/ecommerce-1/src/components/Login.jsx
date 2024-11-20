import "../components/Login.css";
import Typed from "typed.js";
import { NavLink , useNavigate } from "react-router-dom";
import React,{useEffect,useState} from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const LoginForm = useForm() ;
  const [dot, setdot] = useState('') ;
  
  const navigate = useNavigate() ;

  function DelaySimulator(t) {
    return new Promise((resolve) => { 
      setTimeout(() => {
        resolve()
      }, t * 1000);
     })
  }
  useEffect(() => {
    var typed = new Typed('#element', {
      strings: ["to keep your Account safe","for checking your Authentication","........"],
      typeSpeed: 50,startDelay:30,loop: true
    });

    // Clean up the Typed instance when the component unmounts
    return () => {
      typed.destroy();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  async function LoginSubmit(info) {
    // Start showing loading animation
    const interval = setInterval(() => {
      setdot((prevDot) => prevDot.length < 4 ? (prevDot + '.') : ''); 
    }, 200); // Adjust the timing of dots if needed

    try {
      await DelaySimulator(3) ;
      const response = await fetch('http://localhost:4000/userlogin',{
        method:'POST' ,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(info)
      }) ;
      if (response.ok) {
        const result = await response.json() ;
        console.log('Data is sent :',result) ;
        alert("Login completed successfully...")
        navigate('/Home')
        clearInterval(interval) ;
      } 
      else {
        console.log('Error is sending data...')
      }
    } 
    catch (error) {
      console.log('Error in request making proccess :',error)
    }
  }

  return (
    <>
      <div id="BG_img">
        <div className="LoginBox">
          <div className="left">
            <div id="Text">
              <h1>Account Login</h1>
              <span id="FirstSpan">
                Enter the required details to Access your Account {""}
              </span>
              <span id="element"></span>
            </div>
          </div>
          <div className="right">
          <h2>Lets Get Started</h2>
            <form onSubmit={LoginForm.handleSubmit(LoginSubmit)} action="" method="post">
              <div>
                <div>Email Address</div>
                <input type="email" placeholder="Enter your EmailID" {...LoginForm.register('EmailId',{required:true , message:'Its essential for Login purpose...'})} />
                {LoginForm.formState.errors.EmailId && (
                  <div className="red">{LoginForm.formState.EmailId.errors}</div>
                )}
              </div>
              <div>
                <div>Password</div>
                <input type="password" placeholder="Enter your Password" {...LoginForm.register('Password',{required:true , message:'Its important for user identification...'})}  />
                {LoginForm.formState.errors.Password && (
                  <div className="red">{LoginForm.formState.errors.Password.message}</div>)}
              </div>
              <button type="submit">Login</button>
              {LoginForm.formState.isSubmitting && <div>Loading{dot}</div>}
              <div id="Last">
                Are you a new User ? <NavLink to="/SignUp"> <b>SignUp</b></NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;