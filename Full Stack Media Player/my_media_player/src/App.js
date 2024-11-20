import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import Landing_Page from './Components/Landing_Page.jsx';
import LogIn from './Components/LogIn.jsx';
import SignUp from './Components/SignUp.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';
import Library from './Components/Library.jsx';
import { useState,useEffect,useRef } from "react";
import SpeechRecognition,{useSpeechRecognition} from "react-speech-recognition";
import { useScroll, motion, useSpring } from "framer-motion";
import { Routes, Route, Link } from "react-router-dom";
import { toast , ToastContainer , Slide } from "react-toastify";
import axios from "axios";

function App() {
  const [dot, setdot] = useState(""); // used in dotter animation...
  const [searchText, setsearchText] = useState('') ;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const waitFor = (t) => {  return new Promise(resolve => setTimeout(resolve, t * 1000)) };

  // Adding location asking functionality...
  const [locationFetched, setLocationFetched] = useState(false);
  const isFetching = useRef(false); // Use useRef to track fetching state...

  useEffect(() => {
    const fetchLocation = () => {
      if ('geolocation' in navigator && !locationFetched && !isFetching.current) {
        isFetching.current = true; // Set flag to true to indicate fetching
        navigator.geolocation.getCurrentPosition( async (position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            try {
              await axios.get(`http://localhost:4040/api/user/location/${lat}/${long}`,{ withCredentials:true });
              setLocationFetched(true); // Set to true after fetching
            } catch (err) {
              console.log("Error in sending location Info to Backend: ", err.message);
            } finally {
              isFetching.current = false; // Reset fetching state once the location fetch is complete
            }
          },
          (error) => {
            console.error("Error getting geolocation: ", error.message);
            isFetching.current = false; // Ensure flag is reset in case of error
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser or location already fetched.");
      }
    };
    fetchLocation(); // Call the fetchLocation function
  }, [locationFetched]); // Only depend on locationFetched state


  const HandleHamburger = () => { 
    let Icon = document.querySelector('.HMB') ;
    Icon.classList.toggle('rotate');
    let nav = document.getElementsByTagName('nav');
    nav[0].classList.toggle('Top_0');
  
   }
   // function to handle the state of search text...
  //  const ws = new WebSocket('');
   const handleSearchText = async (e) => { 
    const updatedText = e.target.value;
    setsearchText(updatedText);

    // Send the new text to the backend via WebSocket
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(updatedText);
    }
  }
  
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  const handleSpeechCommand = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser does not support speech recognition");
      return; // Exit if the browser doesn't support speech recognition...
    }
    
    await waitFor(1.5);
    resetTranscript();  // clearing the transcpipt logs if something is there...
    toast.info('Ready for listening...');
    
    // Start listening with interim results enabled
    SpeechRecognition.startListening({ interimResults: true, language: 'en', continuous: true });
  
    // Wait for a longer time to give the user more time to speak
    await waitFor(10); 
  
    SpeechRecognition.stopListening();
  
    // Use a timeout to ensure the transcript is updated after stopping
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        if (transcript && transcript.trim()) { // Check if transcript is not empty
          ws.send(transcript, (error) => {
            if (error) {
              console.error("WebSocket send error:", error);
            } else {
              console.log("Transcript sent successfully.");
            }
          });
        } else {
          console.error("Transcript is empty.");
        }
      } else {
        console.error("WebSocket is not open. Cannot send transcript.");
      }
    }, 500); // Adjust timeout as necessary...
  };
  
  // Add error handling for speech recognition
  SpeechRecognition.onerror = (event) => {
    console.error("Speech recognition error detected: ", event.error);
    toast.error("Speech recognition error: " + event.error);
  };
  
  // Use the onResult callback to handle transcript updates in real-time
  const handleResult = (result) => {
    console.log("Updated transcript:", result);
  };
  
  // Register the onResult callback
  useEffect(() => {
    SpeechRecognition.onresult = (event) => {
      const currentTranscript = event.results[event.resultIndex][0].transcript;
      resetTranscript(); // Reset the transcript to avoid duplication
      handleResult(currentTranscript); // Handle the updated transcript
    };
  }, []);
    // dotting animation will as the components unmountation starts...
  useEffect(() => {
    const intervalId = setInterval(() => {
      setdot((prevdot) => { 
        if (prevdot.endsWith("....")) return ""; 
        return prevdot + ".";
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
    <ToastContainer
        autoClose={6000}
        icon={true}
        pauseOnHover={false}
        hideProgressBar={false}
        closeOnClick={false}
        newestOnTop={true}
        closeButton={true}
        position='bottom-right'
        transition={Slide} // Smooth transition...
      />
      <div className="App">
        <motion.div style={{ transformOrigin: '0%', height: '5px', borderRadius: '10px', zIndex: 2, scaleX:scaleX , backgroundColor: 'yellow', width: '100%', position: 'fixed', top: 0 }}/>
        <img alt="img" onClick={() => { HandleHamburger() }} className="HMB" src={`${process.env.PUBLIC_URL}/Images/Hambur.Icon.png`} />
        <nav>
         <span>
           <Link to="/landing_page"><img alt="img" id="Logo_Img" src="./Images/Streamify.logo.svg" /></Link><b>Streamify</b>
         </span>
          <span>
            <form>
              <input value={searchText} onChange={(e) => {handleSearchText(e)}} type="search" name="Search_Tag" placeholder={`Enter Artist Name / Track Or Anything${dot}`} />
              <button type="submit" id="SI"><img onClick={() => { handleSpeechCommand() }} alt="img" src="/Images/microphone.png" /></button>
            </form>
          </span>
          <ul>
            <li><Link to="/login"><button id="LI">LogIn</button></Link></li>
            <li><Link to="/signup"><button id="SU">SignUp</button></Link></li>
            <li id="Profile"><img alt="img" src={"/Images/GeneralPic.Profile.png"} /></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/reset_password" element={<ForgotPassword />} />
          <Route path="/landing_page" element={<Landing_Page dot={dot} />} />
          <Route path="/" element={<Landing_Page dot={dot} />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp DotState={dot} />} />
          <Route path="/song-library" element={<Library />} />
        </Routes>
      </div>
      </>
  );
}

export default App;