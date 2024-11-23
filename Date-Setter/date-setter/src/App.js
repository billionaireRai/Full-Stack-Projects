import './App.css';
import LandingPage from './Pages/landingPage.jsx';
import SecretPage from './Pages/secretPage.jsx';
import AboutPage from './Pages/aboutPage.jsx';
import React,{useState,useEffect} from 'react';
import { useScroll , motion , useSpring} from "framer-motion"; 
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [prev, setprev] = useState('.'); // for dot animation...
  useEffect(() => {
      const interval = setInterval(() => {
        setprev((prev) => (prev.length === 3 ? '' : prev + '.'));
      }, 800); 
  
      return () => clearInterval(interval); // Cleanup on unmount...
  }, []); // run once on mount

  return (
  <>
   <motion.div style={{ transformOrigin: '0%', height: '5px', borderRadius: '10px', zIndex: 6, scaleX:scaleX , backgroundColor: 'yellow', width: '100%', position: 'fixed', top: 0 }}/>
    <div className="App">
      <nav>
        <div id='mainHeading'><Link to="/home"><img id='heart' src='/Images/heart-attack.png' alt="heart" /><span>myCrush</span></Link></div>
        <ul>
          <li><Link to="/home"><img src="/Images/home.png" alt="home" /><span>Home</span></Link></li>
          <li><Link to="/about"><img src="/Images/about.png" alt="about" /><span>About</span></Link></li>
          <li><Link to="/topSecret"><img src="/Images/secret-file.png" alt="secret" /><span>Top_Secret</span></Link></li>
        </ul>
      </nav>
        <Routes>
          <Route path="/home" element={<LandingPage dotstate={prev} />} />
          <Route path="/" element={<LandingPage dotstate={prev} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/topSecret" element={<SecretPage />} />
        </Routes>
    </div>
  </>
  );
}

export default App;