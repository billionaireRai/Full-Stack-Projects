import axios from 'axios';
import './aboutPage.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer, Slide } from 'react-toastify';
import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const AboutPage = ({dotState}) => {
  const videoRef = useRef(null);
  const socialForm = useForm() ; // initializing the react-hook-form...
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5; // Set playback speed to 0.5x
  }, []);
  const socialDetailsSubmission = async (socialMediaInfo) => {
    const response = await axios.post('/api/connect/socialMedia', socialMediaInfo,{withCredentials:true});
    if (response.status === 200) {
      console.log("Social media credentials successfully sent...")
      toast.success('Social media credentials successfully sent !!');
    }
    else console.log("Error in sending social_media credentials...")
   }
   const handleResponseSubmission = async (responseText) => { 
    const response = await axios.get('/api/crush/feedback',responseText,{withCredentials:true});
    if (response.status === 200) {
      console.log("Response successfully sent...")
      toast.success('Sending your feedback !!');
    }
    else console.log("Error in sending feedback...") ;
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
      <div id='topDiv'>
        <div className="left">
          <video ref={videoRef} playsInline preload='auto' autoPlay loop muted src="/coderstockvideo.mp4"></video>
          <div id='Asker'>lets connect on Social_Media</div>
          <form onSubmit={socialForm.handleSubmit(socialDetailsSubmission)} id='FORM'>
            <span><label htmlFor="insta">Instagram Id</label></span>
            <input {...socialForm.register('Insta_ID')} type="text" placeholder="Enter Your Instagram ID..." />
            <span><label htmlFor="facebook">FaceBook Id</label></span>
            <input {...socialForm.register('FaceBook_ID')} type="text" placeholder="Enter Your FaceBook ID..." />
            <span><label htmlFor="twitter">Twitter Id</label></span>
            <input {...socialForm.register('Twitter_ID')} type="text" placeholder="Enter Your Twitter ID..." />
            <span><label htmlFor="twitter">You_BirthDay</label></span>
            <input {...socialForm.register('crush_DOB')} type="date" placeholder="Enter you DOB" />
            <button disabled={socialForm.formState.isSubmitting} type='submit'>Connect</button>
          </form>
        </div>
        <div className='right'>
          <div className="header">unveiling the Craft: how i developed this software{dotState}</div>
          <p className="description">
          Hey! I’ve been working on something I think you’ll really like. It’s this super cool software that acts like a personal guide to make our hangouts perfect. Whenever we decide to go out, I just enter our location, and it gives me a list of the best places nearby—like cozy restaurants, fun spots, or places we can explore together. It’s all about finding spots that I think we’d both enjoy and love.
          But wait, it gets better! The app doesn’t just suggest places—it also shows us the best routes to get there, so we don’t waste time getting lost or stuck in traffic. We can just hop in and head straight to wherever we’re going, stress-free. I know how easy it is to lose track of time or get sidetracked, so this just makes things easier.
          Here’s the cute part: once we fix a date for our hangout, the app sends me an email reminder, so I don’t forget! That way, I can stay organized and make sure everything goes smoothly. It might sound simple, but I put a lot of thought into creating it because I want every moment we spend together to be fun and effortless. This way, we can focus on enjoying our time instead of worrying about the details.
          I made it so that every hangout we have will be the best it can be, with no stress or confusion. Whether it’s a last-minute idea or something we plan in advance, I’ve got the perfect way to make it happen. I can’t wait for our next adventure together—this app is going to make it even more special! 😊
          </p>
          <div id='question'>do you liked it ?</div>
          <ul>
            <li><button onClick={(e) => { handleResponseSubmission(e.target.id) }} id='yes'>Yes</button></li>
            <li><button onClick={(e) => { handleResponseSubmission(e.target.id) }} id='no'>No</button></li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default AboutPage;