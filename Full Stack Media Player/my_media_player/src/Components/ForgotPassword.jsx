import './ForgotPassword.css';
import 'react-toastify/dist/ReactToastify.css';
import React,{useState} from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = () => {
  const [selectedoption, setselectedoption] = useState('PhoneNumber');
  const [otpMatched, setotpMatched] = useState(false);
  const infoSubmissionForm = useForm() ;
  const otpSubmissionForm = useForm() ;
  const passwordSubmissionForm = useForm() ;

  async function handleSubmitCredentials(credential) {
    try {
      const response = await axios.get('/api/user/resetcredentials', {params: { credential: credential, option: selectedoption}}); 
      if (response.status === 200) {
        console.log('Credentials successfully submitted...');
        toast.success("Sending OTP to your Credential...");
      }
      else console.log(`Error from the server => ${response.status} & ${response.statusText}`) ;
    } catch (error) {
      console.log(`Error is sending the credentials : ${error}`) ;
      toast.error("error occured in sending credentials...") ;
    }
  }
  async function submitOTP(otp) {
    try {
      const res = await axios.post('/api/user/matching_otp',{entered_otp : otp})
      if (res.status === 200) {
        console.log('OTP matched successfully...');
        setotpMatched(true);
        toast.success("OTP matched successfully...") ;
      }
      else console.log(`Error from the server => ${res.status} & ${res.statusText}`)
    } catch (error) {
      console.log(`Error in matching OTP : ${error}`) ;
      toast.error("error occured in sending OTP to server...") ;
    }
  }
  async function handlePassword(password) {
    try {
      const res = await axios.post('/api/user/resetpassword', {password: password});
      if (res.status === 200) {
        console.log('Password reset successfully...');
        toast.success("Password reset successfully...") ;
        setotpMatched(false) ;
      }
      else console.log(`Error from the server => ${res.status} & ${res.statusText}`)
    } catch (error) {
      console.log(`Error in resetting password : ${error}`) ;
      toast.error("error occured in sending new password to server...") ;
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
        transition={Zoom} // Smooth transition...
    />
    <div className="container">
      <div id='headingtext'>
        <span>lets format your password !!</span>
        <div>we'll be using a secured and monitored proccess for your password updation...</div>
      </div>
      <div id='mainform'>
        <form onSubmit={infoSubmissionForm.handleSubmit(handleSubmitCredentials)}>
          <span>username</span>
          <input type="text" name="username" placeholder="Enter your username" {...infoSubmissionForm.register('username',{required: {value:true , message:'Required for formating proccess...'},maxLength: 20, minLength: 5})} />
          {infoSubmissionForm.formState.errors.username && (
            <div className='Red'><img src="./Images/warning.png" alt="img" /><div>{infoSubmissionForm.formState.errors.username.message}</div></div>
            )}
          <select id="selection" value={selectedoption} onChange={(e) => {setselectedoption(e.target.value) }}>
            <option value="disabledOne" disabled >select any location category for hangout...</option>
            <option value="PhoneNumber">PhoneNumber</option>
            <option value="Email">Email</option>
          </select>
          <button disabled={infoSubmissionForm.formState.isSubmitting} type="submit">Send OTP</button>
        </form>
        <form onSubmit={otpSubmissionForm.handleSubmit(submitOTP)}>
          <span>your OTP</span>
          <input type="text" name="otp" placeholder="Enter your OTP" {...otpSubmissionForm.register('entered_otp',{
            required: {value:true , message:'Required for secured password reseting...'},maxLength: 6, minLength: 6, })}/>
          {otpSubmissionForm.formState.errors.entered_otp && (
            <div className='Red'><img src="./Images/warning.png" alt="img" /><div>{otpSubmissionForm.formState.errors.entered_otp.message}</div></div>)}
          <button type="submit">Submit OTP</button>
        </form>
        <form onSubmit={passwordSubmissionForm.handleSubmit(handlePassword)}>
          <span>new password</span>
          <input disabled={!otpMatched} type="password" name="newpassword" placeholder="Enter your new password" {...passwordSubmissionForm.register('new_password',{
            required: {value:true , message:'Required for setting new password '},minLength: 8, maxLength: 20, })} />
            {passwordSubmissionForm.formState.errors.new_password && (
            <div className='Red'><img src="./Images/warning.png" alt="img" /><div>{passwordSubmissionForm.formState.errors.new_password.message}</div></div>)}
          <button style={ !otpMatched ? {cursor:'not-allowed'} : {cursor:'pointer'} } type="submit">Change Password</button>
        </form>
      </div>
    </div>
    </>
  )
}

export default ForgotPassword
