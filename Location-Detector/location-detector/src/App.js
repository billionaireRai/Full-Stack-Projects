import './App.css';
import React from 'react';
import { BrowserRouter as Router , Routes , Route ,Link } from 'react-router-dom';

import TraceLocation from './components/TraceLocation';
import SignIn from './components/SignIn';
import LogIn from './components/LogIn';

function App() {
  return (
<>
  <Router>
    <nav>
      <ul>
        <li><Link to="/">GeoTracker</Link></li>
        <li><Link to="/SignIn">Sign In</Link></li>
        <li><Link to="/LogIn">Log In</Link></li> 
        <li><Link to="/TraceLocation">TraceLocation</Link></li> 
      </ul>
    </nav>
    <Routes>
          <Route path="/" element={<SignIn/>} />
          <Route path="/SignIn" element={<SignIn/>} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/TraceLocation" element={<TraceLocation/>} />
    </Routes>
  </Router>
</>
  );
}

export default App;
