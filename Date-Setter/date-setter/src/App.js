import './App.css';
import LandingPage from './Pages/landingPage.jsx';
import SecretPage from './Pages/secretPage.jsx';
import AboutPage from './Pages/aboutPage.jsx';
import Date from './Pages/Date.jsx';
import React,{useState,useEffect} from 'react';
import { useScroll , motion , useSpring} from "framer-motion"; 
import { Routes, Route, NavLink } from 'react-router-dom';

function App() {
  const [crushName, setcrushName] = useState('Beautifull');
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
        <div id='mainHeading'><NavLink to="/home"><img id='heart' src='/Images/heart-attack.png' alt="heart" /><span>forMyCrush</span></NavLink></div>
        <ul>
          <li><NavLink activeClassName='active' style={({ isActive }) => ({ color: isActive ? 'blue' : 'white' })} to="/home"><img src="/Images/home.png" alt="home" /><span>Home</span></NavLink></li>
          <li><NavLink activeClassName='active' style={({ isActive }) => ({ color: isActive ? 'blue' : 'white' })} to="/about"><img src="/Images/about.png" alt="about" /><span>About</span></NavLink></li>
          <li><NavLink activeClassName='active' style={({ isActive }) => ({ color: isActive ? 'blue' : 'white' })} to="/topSecret"><img src="/Images/secret-file.png" alt="secret" /><span>Top_Secret</span></NavLink></li>
        </ul>
      </nav>
        <Routes>
          <Route path="/home" element={<LandingPage dotstate={prev} crushName={crushName} setcrushName={setcrushName} />} />
          <Route path="/" element={<LandingPage dotstate={prev} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/location-setter" element={<Date crushName={crushName} dotstate={prev}/>} />
          <Route path="/topSecret" element={<SecretPage />} />
        </Routes>
    </div>
  </>
  );

}

export default App;

<NavLink 
        to="/home" 
        activeClassName="active"  // This will add 'active' class when the route is active
        style={({ isActive }) => ({ color: isActive ? 'green' : 'blue' })} // Inline style for active state
      ></NavLink>